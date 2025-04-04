import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useState } from 'react';
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

const List = ({ invoices, isLoading, variant }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    
    // Check for empty invoices
    const isEmpty = !invoices || invoices.length === 0;
    
    // State for direct Firebase data
    const [directData, setDirectData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Function to generate custom ID if not exists
    const generateCustomId = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `FTIN${randomNum}`;
    };
    
    // Function to fetch directly from Firebase
    const fetchDirectly = async () => {
        setLoading(true);
        try {
            const invoicesCollection = collection(db, 'invoices');
            const invoicesQuery = query(
                invoicesCollection,
                orderBy('createdAt', 'desc') // Sort by creation date in descending order
            );
            const querySnapshot = await getDocs(invoicesQuery);
            
            const invoicesList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const customId = data.customId || generateCustomId();
                const currency = data.currency || 'USD';
                
                return {
                    ...data,
                    id: doc.id,
                    customId: customId,
                    clientName: data.clientName || 'Unnamed Client',
                    description: data.description || 'No description',
                    status: data.status || 'draft',
                    total: data.total || 0,
                    currency: currency,
                    paymentDue: data.paymentDue || new Date(),
                    createdAt: data.createdAt || new Date()
                };
            });
            
            setDirectData(invoicesList);
        } catch (error) {
            console.error('Error fetching invoices:', error);
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
                    Loading invoices...
                </LoadingContainer>
            </StyledList>
        );
    }

    if (isEmpty) {
        return (
            <EmptyContainer>
                <h3>No Invoices Found</h3>
                <p>There are no invoices to display at this time. Create a new invoice to get started.</p>
            </EmptyContainer>
        );
    }

    return (
        <>
            <ListHeader>
                <HeaderItem className="date">Due Date</HeaderItem>
                <HeaderItem className="client">Client</HeaderItem>
                <HeaderItem className="project">Project</HeaderItem>
                <HeaderItem className="id">Invoice ID</HeaderItem>
                <HeaderItem className="price">Amount</HeaderItem>
                <HeaderItem className="status">Status</HeaderItem>
            </ListHeader>
            <StyledList>
                {invoices.map((invoice, index) => (
                    <Item
                        key={invoice.id}
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
                        <Link to={`/invoice/${invoice.id}`}>
                            <PaymentDue>
                                {formatDate(invoice.paymentDue)}
                            </PaymentDue>
                            <Description>{invoice.description || 'No Project'}</Description>
                            <Uid>
                                <Hashtag>#</Hashtag>
                                {invoice.customId || generateCustomId()}
                            </Uid>
                            <ClientName>{invoice.clientName}</ClientName>
                            <TotalPrice>
                                {formatPrice(invoice.total, invoice.currency)}
                            </TotalPrice>
                            <StatusBadge currStatus={invoice.status}>
                                <StatusDot currStatus={invoice.status} />
                                {invoice.status === 'partially_paid' ? 'Partially Paid' : 
                                 invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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
