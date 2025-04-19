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
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    headingExtraSmall,
    headingMedium,
} from '../../../utilities/typographyStyles';

const StyledList = styled.ul`
    display: flex;
    flex-flow: column;
    gap: 16px;
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
`;

const Item = styled(motion.li)`
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 12px;
    border: 1px solid rgba(223, 227, 250, 0.1);
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
`;

const StyledLink = styled(RouterLink)`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    padding: 24px;
    border: 1px solid transparent;
    border-radius: 12px;
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;

    @media (max-width: 767px) {
        grid-template-areas:
            "date project"
            "client client"
            "cost cost"
            "profit profit"
            "price price";
        grid-template-columns: 1fr auto;
        gap: 12px;
        padding: 20px;
    }

    @media (min-width: 768px) {
        display: grid;
        grid-template-areas: "date client project cost profit price arrow";
        grid-template-columns: 110px 160px 160px 130px 130px 130px 20px;
        align-items: center;
        padding: 20px 32px;
        gap: 16px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: 120px 180px 180px 140px 140px 140px 20px;
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        border: 1px solid ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 3px rgba(124, 93, 250, 0.2);
    }

    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.purple};
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 5%;
        width: 90%;
        height: 1px;
        background: linear-gradient(to right, 
            transparent, 
            rgba(223, 227, 250, 0.3), 
            transparent);
    }
`;

const ListHeader = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-areas: "date client project cost profit price arrow";
        grid-template-columns: 110px 160px 160px 130px 130px 130px 20px;
        padding: 0 32px 12px 32px;
        font-weight: 600;
        font-size: 11px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin-bottom: 12px;
        border-bottom: 1px solid rgba(223, 227, 250, 0.1);
        letter-spacing: 0.5px;
        gap: 16px;
        align-items: center;

        @media (min-width: 1024px) {
            grid-template-columns: 120px 180px 180px 140px 140px 140px 20px;
        }
    }
`;

const HeaderItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease;

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
`;

const PaymentDue = styled.p`
    grid-area: date;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    transition: color 200ms ease-in-out;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

const ClientName = styled.p`
    grid-area: client;
    font-size: 13px;
    font-weight: 700;
    transition: color 200ms ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;

    @media (max-width: 767px) {
        font-size: 12px;
        white-space: normal;
    }
`;

const Description = styled.p`
    grid-area: project;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 13px;
    transition: color 200ms ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;

    @media (max-width: 767px) {
        font-size: 12px;
        white-space: normal;
        line-height: 1.3;
    }
`;

const TotalPrice = styled.p`
    ${headingMedium}
    font-size: 14px;
    font-weight: 700;
    justify-self: end;
    white-space: nowrap;
    letter-spacing: 0.5px;
    padding-right: 24px;

    &:nth-of-type(1) {
        grid-area: cost;
    }
    &:nth-of-type(2) {
        grid-area: profit;
    }
    &:nth-of-type(3) {
        grid-area: price;
    }

    @media (max-width: 767px) {
        font-size: 13px;
        padding-right: 0;
    }
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
    border: 1px solid rgba(223, 227, 250, 0.1);
    
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
    border: 1px solid rgba(223, 227, 250, 0.1);
    
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
        line-height: 1.6;
    }
`;

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;
    
    @media (max-width: 767px) {
        grid-template-columns: 1fr;
        gap: 16px;
    }
`;

const StatCard = styled.div`
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(223, 227, 250, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
`;

const StatLabel = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StatValue = styled.div`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 24px;
    font-weight: 700;
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

    // Calculate totals for stat cards
    const calculateTotals = useMemo(() => {
        if (!internalPOs?.length) return { totalAmount: 0, totalNetCost: 0, totalNetProfit: 0 };

        return internalPOs.reduce((acc, internalPO) => {
            // Calculate Net Total Cost
            const netTotalCost = (
                // Total cost of items
                internalPO.items?.reduce((sum, item) => {
                    const orderQty = item.orderQuantity || item.quantity || 0;
                    const unitCost = item.unitCost || 0;
                    return sum + (orderQty * unitCost);
                }, 0) +
                // Total printing cost (per item + additional)
                internalPO.items?.reduce((sum, item) => {
                    const orderQty = item.orderQuantity || item.quantity || 0;
                    const printingCost = item.printingCost || 0;
                    return sum + (orderQty * printingCost);
                }, 0) + (internalPO.additionalPrintingCost || 0) +
                // Total shipping cost (per item + additional)
                internalPO.items?.reduce((sum, item) => {
                    const orderQty = item.orderQuantity || item.quantity || 0;
                    const shippingCost = item.shippingCost || 0;
                    return sum + (orderQty * shippingCost);
                }, 0) + (internalPO.additionalShippingCost || 0)
            ) || 0;

            return {
                totalAmount: acc.totalAmount + (internalPO.total || 0),
                totalNetCost: acc.totalNetCost + netTotalCost,
                totalNetProfit: acc.totalNetProfit + (internalPO.netProfit || 0)
            };
        }, { totalAmount: 0, totalNetCost: 0, totalNetProfit: 0 });
    }, [internalPOs]);

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
                    Loading internal POs...
                </LoadingContainer>
            </StyledList>
        );
    }

    if (isEmpty) {
        return (
            <EmptyContainer>
                <h3>No Internal POs Found</h3>
                <p>There are no internal POs to display at this time. Create a new internal PO to get started.</p>
            </EmptyContainer>
        );
    }

    const currency = internalPOs?.[0]?.currency || 'QAR';

    return (
        <>
            <StatsContainer>
                <StatCard>
                    <StatLabel>
                        <Icon name="money-bill" size={16} color={colors.purple} />
                        Total Amount
                    </StatLabel>
                    <StatValue>{formatPrice(calculateTotals.totalAmount, currency)}</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>
                        <Icon name="calculator" size={16} color={colors.purple} />
                        Net Total Cost
                    </StatLabel>
                    <StatValue>{formatPrice(calculateTotals.totalNetCost, currency)}</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>
                        <Icon name="chart-line" size={16} color={colors.purple} />
                        Net Profit
                    </StatLabel>
                    <StatValue>{formatPrice(calculateTotals.totalNetProfit, currency)}</StatValue>
                </StatCard>
            </StatsContainer>

            <ListHeader>
                <HeaderItem 
                    className={`date ${sortConfig.key === 'createdAt' ? 'active' : ''}`}
                    onClick={() => handleSort('createdAt')}
                    style={{ cursor: 'pointer' }}
                >
                    Internal PO Date
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
                    className={`cost ${sortConfig.key === 'netTotal' ? 'active' : ''}`}
                    onClick={() => handleSort('netTotal')}
                    style={{ cursor: 'pointer' }}
                >
                    Net Total (Cost)
                    <SortIcon 
                        name={sortConfig.key === 'netTotal' 
                            ? (sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down')
                            : 'arrow-up-down'
                        } 
                        size={12}
                        className="sort-icon"
                    />
                </HeaderItem>
                <HeaderItem 
                    className={`profit ${sortConfig.key === 'netProfit' ? 'active' : ''}`}
                    onClick={() => handleSort('netProfit')}
                    style={{ cursor: 'pointer' }}
                >
                    Net Profit
                    <SortIcon 
                        name={sortConfig.key === 'netProfit' 
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
            </ListHeader>
            <StyledList>
                {sortedInternalPOs.map((internalPO, index) => (
                    <Item
                        key={internalPO.id}
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
                        <StyledLink to={`/internal-pos/${internalPO.id}`}>
                            <PaymentDue>
                                {formatDate(internalPO.createdAt)}
                            </PaymentDue>
                            <ClientName>{internalPO.clientName}</ClientName>
                            <Description>{internalPO.description || 'No Project'}</Description>
                            <TotalPrice>
                                {formatPrice(
                                    // Total cost of items
                                    internalPO.items?.reduce((sum, item) => {
                                        const orderQty = item.orderQuantity || item.quantity || 0;
                                        const unitCost = item.unitCost || 0;
                                        return sum + (orderQty * unitCost);
                                    }, 0) +
                                    // Total printing cost (per item + additional)
                                    internalPO.items?.reduce((sum, item) => {
                                        const orderQty = item.orderQuantity || item.quantity || 0;
                                        const printingCost = item.printingCost || 0;
                                        return sum + (orderQty * printingCost);
                                    }, 0) + (internalPO.additionalPrintingCost || 0) +
                                    // Total shipping cost (per item + additional)
                                    internalPO.items?.reduce((sum, item) => {
                                        const orderQty = item.orderQuantity || item.quantity || 0;
                                        const shippingCost = item.shippingCost || 0;
                                        return sum + (orderQty * shippingCost);
                                    }, 0) + (internalPO.additionalShippingCost || 0),
                                    internalPO.currency
                                )}
                            </TotalPrice>
                            <TotalPrice>
                                {formatPrice(internalPO.netProfit || 0, internalPO.currency)}
                            </TotalPrice>
                            <TotalPrice>
                                {formatPrice(internalPO.total, internalPO.currency)}
                            </TotalPrice>
                            {isDesktop && (
                                <Icon
                                    name="arrow-right"
                                    size={10}
                                    color={colors.purple}
                                />
                            )}
                        </StyledLink>
                    </Item>
                ))}
            </StyledList>
        </>
    );
};

export default List; 