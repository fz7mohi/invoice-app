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
    &.price { grid-area: price; text-align: right; }
    &.status { grid-area: status; text-align: center; }
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
    
    // Function to fetch directly from Firebase
    const fetchDirectly = async () => {
        setLoading(true);
        try {
            const quotationsCollection = collection(db, 'quotations');
            const quotationsQuery = query(
                quotationsCollection,
                orderBy('createdAt', 'desc') // Sort by creation date in descending order
            );
            const querySnapshot = await getDocs(quotationsQuery);
            
            // Generate ID function for missing IDs
            const generateCustomId = () => {
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                return `FTQ${randomNum}`;
            };
            
            const quotationsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                
                // Check if currency exists in the raw data
                console.log(`Raw Firestore document ${doc.id} has currency:`, data.currency);
                
                // Ensure each quotation has a custom ID in the correct format
                const customId = data.customId || generateCustomId();
                
                // Explicitly set currency with a clear default
                const currency = data.currency || 'USD';
                console.log(`Setting currency for ${customId} to:`, currency);
                
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
            console.error('Error fetching directly:', error);
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

    // Choose which data to display
    const dataToDisplay = quotations || [];
    
    if (isLoading || loading) {
        return (
            <StyledList
                variants={variant('list', 0)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <LoadingContainer>
                    Loading quotations...
                </LoadingContainer>
            </StyledList>
        );
    }

    if (dataToDisplay.length === 0) {
        return (
            <ErrorMessage variant={variant} />
        );
    }

    return (
        <>
            <ListHeader>
                <HeaderItem className="date">Due Date</HeaderItem>
                <HeaderItem className="project">Project</HeaderItem>
                <HeaderItem className="id">Quotation ID</HeaderItem>
                <HeaderItem className="client">Client</HeaderItem>
                <HeaderItem className="price">Amount</HeaderItem>
                <HeaderItem className="status">Status</HeaderItem>
            </ListHeader>
            <StyledList>
                {dataToDisplay.map((quotation, index) => (
                    <RouterLink 
                        to={`/quotation/${quotation.id}`} 
                        key={quotation.id}
                        style={{ textDecoration: 'none' }}
                    >
                        <Item
                            variants={variant('list', index)}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Link>
                                <PaymentDue>
                                    {formatDate(quotation.createdAt)}
                                </PaymentDue>
                                <Description>
                                    {quotation.description || 'No description'}
                                </Description>
                                <Uid>
                                    <Hashtag>#</Hashtag>
                                    {quotation.customId || quotation.id}
                                </Uid>
                                <ClientName>
                                    {quotation.clientName}
                                </ClientName>
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: windowWidth <= 768 ? '8px' : '0' }}>
                                <StatusBadge status={quotation.status}>
                                    <StatusDot status={quotation.status} />
                                    {formatStatus(quotation.status)}
                                </StatusBadge>
                                <TotalPrice>
                                    {formatPrice(quotation.total, quotation.currency)}
                                    <Icon name="arrow-right" size={12} color="#7C5DFA" />
                                </TotalPrice>
                            </div>
                        </Item>
                    </RouterLink>
                ))}
            </StyledList>
        </>
    );
};

export default List; 