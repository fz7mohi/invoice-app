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
        Force Load Quotations
    </button>
);

// Add a header component
const ListHeader = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-areas: 'date id client description price status icon';
        grid-template-columns: 110px 110px 150px 1fr 120px 120px 20px;
        padding: 0 24px 16px 24px;
        font-weight: 500;
        font-size: 12px;
        color: ${({ theme }) => theme.colors.textSecondary};
    }
    
    @media (min-width: 1024px) {
        grid-template-columns: 120px 120px 180px 1fr 150px 140px 20px;
        padding: 0 32px 16px 32px;
    }
    
    @media (min-width: 1440px) {
        grid-template-columns: 140px 140px 220px 1fr 180px 160px 20px;
    }
`;

const HeaderItem = styled.div`
    &.date { grid-area: date; }
    &.id { grid-area: id; }
    &.client { grid-area: client; }
    &.description { grid-area: description; }
    &.price { grid-area: price; text-align: right; }
    &.status { grid-area: status; text-align: center; }
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
    const dataToDisplay = directData.length > 0 ? directData : quotations;
    const showEmptyState = dataToDisplay.length === 0 && !loading;
    
    if (isLoading) {
        return (
            <StyledList
                variants={variant('list', 0)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: '40px',
                    color: '#DFE3FA',
                    fontSize: '14px'
                }}>
                    Loading quotations...
                </div>
            </StyledList>
        );
    }

    if (isEmpty) {
        return (
            <>
                {showEmptyState && <ErrorMessage variant={variant} />}
                <ForceLoadButton onClick={fetchDirectly} />
            </>
        );
    }

    return (
        <StyledList
            variants={variant('list', 0)}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
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
    );
};

export default List; 