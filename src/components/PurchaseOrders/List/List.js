import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useState, useMemo } from 'react';
import Icon from '../../shared/Icon/Icon';
import Status from '../../shared/Status/Status';
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
    SupplierName,
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
        grid-template-areas: 'date supplier project id price status icon';
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
    &.supplier { 
        grid-area: supplier;
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
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    text-align: center;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.surface};
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
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
    }
    
    p {
        margin: 0;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        max-width: 400px;
    }
`;

const List = ({ purchaseOrders, isLoading, variant }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    
    const isEmpty = !purchaseOrders || purchaseOrders.length === 0;
    
    const [directData, setDirectData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedPurchaseOrders = useMemo(() => {
        if (!sortConfig.key) return purchaseOrders;

        return [...purchaseOrders].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

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
    }, [purchaseOrders, sortConfig]);

    const formatStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            case 'void':
                return 'Void';
            default:
                return 'Draft';
        }
    };

    const generateCustomId = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `FTPO${randomNum}`;
    };
    
    const fetchDirectly = async () => {
        setLoading(true);
        try {
            const purchaseOrdersCollection = collection(db, 'purchaseOrders');
            const purchaseOrdersQuery = query(
                purchaseOrdersCollection,
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(purchaseOrdersQuery);
            
            const purchaseOrdersList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const customId = data.customId || generateCustomId();
                const currency = data.currency || 'USD';
                
                return {
                    ...data,
                    id: doc.id,
                    customId: customId,
                    supplierName: data.supplierName || 'Unnamed Supplier',
                    description: data.description || 'No description',
                    status: data.status || 'draft',
                    total: data.total || 0,
                    currency: currency,
                    paymentDue: data.paymentDue || new Date(),
                    createdAt: data.createdAt || new Date()
                };
            });
            
            setDirectData(purchaseOrdersList);
        } catch (error) {
            console.error('Error fetching purchase orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <StyledList
                variants={variant('list', 0)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <LoadingContainer>
                    <Icon name="loading" size={24} color={colors.purple} style={{ marginRight: '12px' }} />
                    Loading purchase orders...
                </LoadingContainer>
            </StyledList>
        );
    }

    if (isEmpty) {
        return (
            <EmptyContainer>
                <h3>No Purchase Orders Found</h3>
                <p>There are no purchase orders to display at this time. Create a new purchase order to get started.</p>
            </EmptyContainer>
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
                    PO Date
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
                    className={`supplier ${sortConfig.key === 'supplierName' ? 'active' : ''}`}
                    onClick={() => handleSort('supplierName')}
                    style={{ cursor: 'pointer' }}
                >
                    Supplier
                    <SortIcon 
                        name={sortConfig.key === 'supplierName' 
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
                    PO ID
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
            <StyledList>
                {sortedPurchaseOrders.map((order, index) => (
                    <Item
                        key={order.id}
                        layout
                        variants={variant('list', index)}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ scale: 1.01 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            delay: index * 0.03
                        }}
                    >
                        <Link to={`/purchase-order/${order.id}`}>
                            <PaymentDue>
                                {formatDate(order.createdAt)}
                            </PaymentDue>
                            <Description>{order.description || 'No Project'}</Description>
                            <Uid>
                                <Hashtag>#</Hashtag>
                                {order.customId || generateCustomId()}
                            </Uid>
                            <SupplierName>{order.supplierName}</SupplierName>
                            <TotalPrice>
                                {formatPrice(order.total, order.currency)}
                            </TotalPrice>
                            <StatusBadge currStatus={order.status}>
                                <StatusDot currStatus={order.status} />
                                {formatStatus(order.status)}
                            </StatusBadge>
                            {isDesktop && (
                                <Icon
                                    name="arrow-right"
                                    size={10}
                                    color={colors.purple}
                                />
                            )}
                        </Link>
                    </Item>
                ))}
            </StyledList>
        </>
    );
};

export default List;