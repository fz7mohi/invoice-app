import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useState, useMemo } from 'react';
import Icon from '../../shared/Icon/Icon';
import Status from '../../shared/Status/Status';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import {
    StyledList,
    Item,
    Link,
    Uid,
    Hashtag,
    PaymentDue,
    ClientName,
    TotalPrice,
    Description,
    StatusBadge,
    StatusDot
} from './ListStyles';
import styled from 'styled-components';

// Add a header component
const ListHeader = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-areas: 'date client project id price status icon';
        grid-template-columns: 100px 130px 130px 90px 130px 90px 20px;
        padding: 0 32px 12px 32px;
        font-weight: 600;
        font-size: 11px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin-bottom: 12px;
        border-bottom: 1px solid rgba(223, 227, 250, 0.1);
        letter-spacing: 0.5px;
    }
    
    @media (min-width: 1024px) {
        grid-template-columns: 110px 160px 160px 100px 150px 120px 20px;
        padding: 0 32px 12px 32px;
    }
    
    @media (min-width: 1440px) {
        grid-template-columns: 120px 180px 180px 120px 160px 140px 20px;
    }
`;

const HeaderItem = styled.div`
    &.date { 
        grid-area: date;
        padding-left: 0;
    }
    &.project { 
        grid-area: project;
    }
    &.id { 
        grid-area: id;
    }
    &.client { 
        grid-area: client;
    }
    &.price { 
        grid-area: price; 
        text-align: right;
        padding-right: 24px;
    }
    &.status { 
        grid-area: status; 
        text-align: center;
        padding-right: 20px;
    }

    // Add hover and active states
    &:hover {
        color: ${({ theme }) => theme.colors.primary};
        .sort-icon {
            opacity: 1;
        }
    }

    &.active {
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 600;
    }

    // Add transition for smooth effects
    transition: color 0.2s ease, font-weight 0.2s ease;
`;

const SortIcon = styled(Icon)`
    margin-left: 4px;
    opacity: 0.5;
    transition: opacity 0.2s ease, transform 0.2s ease;
    
    ${HeaderItem}:hover & {
        opacity: 1;
    }
    
    ${HeaderItem}.active & {
        opacity: 1;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 14px;
    text-align: center;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    @media (max-width: 767px) {
        padding: 32px 16px;
    }
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.textPrimary};
    }
    
    p {
        margin: 0;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        max-width: 400px;
    }
`;

const List = ({ internalPOs, isLoading, variant }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    
    // Check for empty internal POs
    const isEmpty = !internalPOs || internalPOs.length === 0;
    
    // State for direct Firebase data
    const [directData, setDirectData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    // Function to handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Function to sort internal POs
    const sortedInternalPOs = useMemo(() => {
        if (!sortConfig.key) return internalPOs;

        return [...internalPOs].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle special cases for different fields
            switch (sortConfig.key) {
                case 'paymentDue':
                case 'createdAt':
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                    break;
                case 'total':
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);
                    break;
                case 'status':
                    aValue = formatStatus(aValue);
                    bValue = formatStatus(bValue);
                    break;
                default:
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [internalPOs, sortConfig]);

    // Function to format status text
    const formatStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'paid':
                return 'Paid';
            case 'partially_paid':
                return 'Partially Paid';
            case 'void':
                return 'Void';
            default:
                return 'Draft';
        }
    };

    // Function to generate custom ID if not exists
    const generateCustomId = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `FTPO${randomNum}`;
    };
    
    // Function to fetch directly from Firebase
    const fetchDirectly = async () => {
        setLoading(true);
        try {
            const internalPOsCollection = collection(db, 'internalPOs');
            const internalPOsQuery = query(
                internalPOsCollection,
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(internalPOsQuery);
            
            const internalPOsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    paymentDue: data.paymentDue?.toDate() || new Date()
                };
            });
            
            setDirectData(internalPOsList);
        } catch (error) {
            console.error('Error fetching internal POs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <LoadingContainer>
                <div>Loading internal POs...</div>
            </LoadingContainer>
        );
    }

    if (isEmpty) {
        return (
            <EmptyContainer>
                <h3>No Internal POs</h3>
                <p>There are no internal POs to display. Create a new internal PO to get started.</p>
            </EmptyContainer>
        );
    }

    return (
        <>
            {isDesktop && (
                <ListHeader>
                    <HeaderItem 
                        className="date"
                        onClick={() => handleSort('createdAt')}
                    >
                        Date
                        <SortIcon 
                            name={sortConfig.key === 'createdAt' ? 
                                (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 
                                'arrow-up-down'}
                            size={12}
                            className="sort-icon"
                        />
                    </HeaderItem>
                    <HeaderItem 
                        className="client"
                        onClick={() => handleSort('clientName')}
                    >
                        Client
                        <SortIcon 
                            name={sortConfig.key === 'clientName' ? 
                                (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 
                                'arrow-up-down'}
                            size={12}
                            className="sort-icon"
                        />
                    </HeaderItem>
                    <HeaderItem 
                        className="project"
                        onClick={() => handleSort('description')}
                    >
                        Project
                        <SortIcon 
                            name={sortConfig.key === 'description' ? 
                                (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 
                                'arrow-up-down'}
                            size={12}
                            className="sort-icon"
                        />
                    </HeaderItem>
                    <HeaderItem 
                        className="id"
                        onClick={() => handleSort('id')}
                    >
                        ID
                        <SortIcon 
                            name={sortConfig.key === 'id' ? 
                                (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 
                                'arrow-up-down'}
                            size={12}
                            className="sort-icon"
                        />
                    </HeaderItem>
                    <HeaderItem 
                        className="price"
                        onClick={() => handleSort('total')}
                    >
                        Amount
                        <SortIcon 
                            name={sortConfig.key === 'total' ? 
                                (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 
                                'arrow-up-down'}
                            size={12}
                            className="sort-icon"
                        />
                    </HeaderItem>
                    <HeaderItem 
                        className="status"
                        onClick={() => handleSort('status')}
                    >
                        Status
                        <SortIcon 
                            name={sortConfig.key === 'status' ? 
                                (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 
                                'arrow-up-down'}
                            size={12}
                            className="sort-icon"
                        />
                    </HeaderItem>
                </ListHeader>
            )}
            <StyledList>
                {sortedInternalPOs.map((internalPO, index) => (
                    <Item
                        key={internalPO.id}
                        variants={variant('list', index)}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <RouterLink to={`/internal-pos/${internalPO.id}`}>
                            <PaymentDue>
                                {formatDate(internalPO.createdAt)}
                            </PaymentDue>
                            <Description>{internalPO.description || 'No Project'}</Description>
                            <Uid>
                                <Hashtag>#</Hashtag>
                                {internalPO.customId || generateCustomId()}
                            </Uid>
                            <ClientName>{internalPO.clientName}</ClientName>
                            <TotalPrice>
                                {formatPrice(internalPO.total, internalPO.currency)}
                            </TotalPrice>
                            <StatusBadge currStatus={internalPO.status}>
                                <StatusDot currStatus={internalPO.status} />
                                {formatStatus(internalPO.status)}
                            </StatusBadge>
                            {isDesktop && (
                                <Icon
                                    name="arrow-right"
                                    size={10}
                                    color={colors.purple}
                                />
                            )}
                        </RouterLink>
                    </Item>
                ))}
            </StyledList>
        </>
    );
};

export default List; 