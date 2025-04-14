import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import Icon from '../../shared/Icon/Icon';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import {
    StyledList,
    Item,
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
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

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

// Add LoadingContainer styled component
const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 14px;
    text-align: center;
    width: 100%;
    
    @media (max-width: 767px) {
        padding: 32px 16px;
    }
`;

const List = ({ quotations, isLoading, variant }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    
    // Check for empty quotations
    const isEmpty = !quotations || quotations.length === 0;
    
    // State for direct Firebase data
    const [directData, setDirectData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    // Force a re-render when quotations change
    useEffect(() => {
        // No-op effect to track changes
    }, [quotations]);
    
    // Function to fetch directly from Firebase
    const fetchDirectly = async () => {
        setLoading(true);
        try {
            const quotationsCollection = collection(db, 'quotations');
            const quotationsQuery = query(
                quotationsCollection,
                orderBy('modifiedAt', 'desc') // Sort by modified date in descending order
            );
            const querySnapshot = await getDocs(quotationsQuery);
            
            // Generate ID function for missing IDs
            const generateCustomId = () => {
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                return `FTQ${randomNum}`;
            };
            
            const quotationsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                
                // Ensure each quotation has a custom ID in the correct format
                const customId = data.customId || generateCustomId();
                
                // Explicitly set currency with a clear default
                const currency = data.currency || 'USD';
                
                return {
                    ...data,
                    id: doc.id,
                    customId: customId, // Ensure custom ID always exists
                    clientName: data.clientName || 'Unnamed Client',
                    status: data.status || 'pending',
                    total: parseFloat(data.total) || 0,
                    currency: currency, // Explicitly set currency
                    paymentDue: data.paymentDue?.toDate?.() || new Date()
                };
            });
            
            setDirectData(quotationsList);
        } catch (error) {
            // Error handling is done silently
        } finally {
            setLoading(false);
        }
    };

    // Function to format status text
    const formatStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'invoiced':
                return 'Invoiced';
            case 'draft':
                return 'Draft';
            default:
                return 'Draft';
        }
    };

    // Function to handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Function to sort quotations
    const sortedQuotations = useMemo(() => {
        if (!sortConfig.key) return quotations;

        return [...quotations].sort((a, b) => {
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
    }, [quotations, sortConfig]);

    // Choose which data to display
    const dataToDisplay = quotations || [];
    
    // Show loading state if either the parent is loading or we're loading directly
    if (isLoading || loading) {
        return (
            <StyledList
                variants={variant('list', 0)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <LoadingContainer>
                    <Icon name="spinner" size={24} style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />
                    Loading quotations...
                </LoadingContainer>
            </StyledList>
        );
    }

    // Only show error message if we're not loading and there are no quotations
    if (!isLoading && !loading && dataToDisplay.length === 0) {
        return (
            <ErrorMessage variant={variant} />
        );
    }
    
    return (
        <>
            <ListHeader>
                <HeaderItem 
                    className={`date ${sortConfig.key === 'createdAt' ? 'active' : ''}`}
                    onClick={() => handleSort('createdAt')}
                    style={{ cursor: 'pointer' }}
                >
                    Date
                    <SortIcon 
                        name={sortConfig.key === 'createdAt' 
                            ? (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down')
                            : 'arrow-up-down'
                        } 
                        size={12}
                        className="sort-icon"
                    />
                </HeaderItem>
                <HeaderItem 
                    className={`client ${sortConfig.key === 'clientName' ? 'active' : ''}`}
                    onClick={() => handleSort('clientName')}
                    style={{ cursor: 'pointer' }}
                >
                    Client
                    <SortIcon 
                        name={sortConfig.key === 'clientName' 
                            ? (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down')
                            : 'arrow-up-down'
                        } 
                        size={12}
                        className="sort-icon"
                    />
                </HeaderItem>
                <HeaderItem 
                    className={`project ${sortConfig.key === 'description' ? 'active' : ''}`}
                    onClick={() => handleSort('description')}
                    style={{ cursor: 'pointer' }}
                >
                    Project
                    <SortIcon 
                        name={sortConfig.key === 'description' 
                            ? (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down')
                            : 'arrow-up-down'
                        } 
                        size={12}
                        className="sort-icon"
                    />
                </HeaderItem>
                <HeaderItem 
                    className={`id ${sortConfig.key === 'customId' ? 'active' : ''}`}
                    onClick={() => handleSort('customId')}
                    style={{ cursor: 'pointer' }}
                >
                    Quotation ID
                    <SortIcon 
                        name={sortConfig.key === 'customId' 
                            ? (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down')
                            : 'arrow-up-down'
                        } 
                        size={12}
                        className="sort-icon"
                    />
                </HeaderItem>
                <HeaderItem 
                    className={`price ${sortConfig.key === 'total' ? 'active' : ''}`}
                    onClick={() => handleSort('total')}
                    style={{ cursor: 'pointer' }}
                >
                    Amount
                    <SortIcon 
                        name={sortConfig.key === 'total' 
                            ? (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down')
                            : 'arrow-up-down'
                        } 
                        size={12}
                        className="sort-icon"
                    />
                </HeaderItem>
                <HeaderItem 
                    className={`status ${sortConfig.key === 'status' ? 'active' : ''}`}
                    onClick={() => handleSort('status')}
                    style={{ cursor: 'pointer' }}
                >
                    Status
                    <SortIcon 
                        name={sortConfig.key === 'status' 
                            ? (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down')
                            : 'arrow-up-down'
                        } 
                        size={12}
                        className="sort-icon"
                    />
                </HeaderItem>
            </ListHeader>
            <StyledList
                variants={variant('list', 0)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {sortedQuotations.map((quotation, index) => (
                    <Item
                        key={quotation.id}
                        variants={variant('list', index)}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <RouterLink 
                            to={`/quotation/${quotation.id}`}
                            style={{ 
                                textDecoration: 'none',
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ 
                                display: 'grid',
                                gridTemplateAreas: isDesktop 
                                    ? '"date client project id price status arrow"'
                                    : '"id status" "project project" "client client" "date price"',
                                gridTemplateColumns: isDesktop 
                                    ? '100px 130px 130px 90px 130px 90px 20px'
                                    : '1fr auto',
                                alignItems: 'center',
                                gap: isDesktop ? '16px' : '12px',
                                width: '100%'
                            }}>
                                <Uid>
                                    <Hashtag>#</Hashtag>
                                    {quotation.customId || quotation.id}
                                </Uid>
                                <Description>
                                    {quotation.description || 'No description'}
                                </Description>
                                <ClientName>
                                    {quotation.clientName}
                                </ClientName>
                                <PaymentDue>
                                    {formatDate(quotation.createdAt)}
                                </PaymentDue>
                                <TotalPrice>
                                    {formatPrice(quotation.total, quotation.currency)}
                                </TotalPrice>
                                <StatusBadge status={quotation.status}>
                                    <StatusDot status={quotation.status} />
                                    {formatStatus(quotation.status)}
                                </StatusBadge>
                                {isDesktop && (
                                    <Icon name="arrow-right" size={12} color="#7C5DFA" />
                                )}
                            </div>
                        </RouterLink>
                    </Item>
                ))}
            </StyledList>
        </>
    );
};

export default List; 