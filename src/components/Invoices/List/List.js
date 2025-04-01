import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import Status from '../../shared/Status/Status';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import { collection, getDocs } from 'firebase/firestore';
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

// Simple button component for force loading
const ForceLoadButton = ({ onClick }) => (
    <button 
        onClick={onClick}
        style={{
            padding: '8px 16px',
            backgroundColor: '#7c5dfa',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '20px auto',
            display: 'block'
        }}
    >
        Force Load Invoices
    </button>
);

// Add a header component
const ListHeader = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-areas: 'date project id client price status icon';
        grid-template-columns: 110px 140px 100px 1fr 140px 100px 20px;
        padding: 0 24px 16px 24px;
        font-weight: 500;
        font-size: 12px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin-bottom: 8px;
    }
    
    @media (min-width: 1024px) {
        grid-template-columns: 120px 180px 120px 1fr 160px 140px 20px;
        padding: 0 32px 16px 32px;
    }
    
    @media (min-width: 1440px) {
        grid-template-columns: 140px 200px 140px 1fr 180px 160px 20px;
    }
`;

const HeaderItem = styled.div`
    &.date { grid-area: date; }
    &.project { grid-area: project; }
    &.id { grid-area: id; }
    &.client { grid-area: client; }
    &.price { 
        grid-area: price; 
        text-align: right;
        padding-right: 16px;
    }
    &.status { 
        grid-area: status; 
        text-align: center;
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
    
    @media (max-width: 767px) {
        padding: 32px 16px;
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
            const querySnapshot = await getDocs(invoicesCollection);
            
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

    if (isLoading || loading) {
        return (
            <StyledList
                variants={variant('list', 0)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <LoadingContainer>
                    Loading invoices...
                </LoadingContainer>
            </StyledList>
        );
    }

    if (isEmpty) {
        return (
            <>
                <ErrorMessage variant={variant} />
                <ForceLoadButton onClick={fetchDirectly} />
            </>
        );
    }

    return (
        <>
            <ListHeader>
                <HeaderItem className="date">Due Date</HeaderItem>
                <HeaderItem className="project">Project</HeaderItem>
                <HeaderItem className="id">Invoice ID</HeaderItem>
                <HeaderItem className="client">Client</HeaderItem>
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
