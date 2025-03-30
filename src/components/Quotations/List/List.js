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

const List = ({ isLoading, quotations, variant }) => {
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
            const querySnapshot = await getDocs(quotationsCollection);
            
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

    // Choose which data to display
    const dataToDisplay = directData.length > 0 ? directData : quotations;
    const showEmptyState = dataToDisplay.length === 0 && !loading;
    
    return (
        <>
            {isEmpty && <ForceLoadButton onClick={fetchDirectly} />}
            {loading && <p style={{textAlign: 'center'}}>Loading directly from Firebase...</p>}
            
            {showEmptyState && <ErrorMessage variant={variant} />}
            {dataToDisplay.length > 0 && (
                <>
                    <ListHeader>
                        <HeaderItem className="date">Date</HeaderItem>
                        <HeaderItem className="id">Quote ID</HeaderItem>
                        <HeaderItem className="client">Client Name</HeaderItem>
                        <HeaderItem className="description">Project Description</HeaderItem>
                        <HeaderItem className="price">Total</HeaderItem>
                        <HeaderItem className="status">Status</HeaderItem>
                    </ListHeader>
                    <StyledList>
                        {dataToDisplay.map(
                            (quotation, index) => {
                                // Extract properties safely with defaults
                                const {
                                    id = 'Unknown',
                                    customId,
                                    paymentDue,
                                    clientName = 'Unnamed Client',
                                    status = 'pending',
                                    total = 0,
                                    description,
                                    currency,
                                } = quotation || {};
                                
                                // Add detailed debug logging
                                console.log(`Quotation ${customId} has currency:`, currency);

                                return (
                                    <Item
                                        key={id}
                                        layout
                                        variants={variant('list', index)}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <Link to={`/quotation/${id}`}>
                                            <PaymentDue>
                                                {formatDate(quotation.createdAt || new Date())}
                                            </PaymentDue>
                                            <Uid>
                                                <Hashtag>#</Hashtag>
                                                {customId || 'Unknown ID'}
                                            </Uid>
                                            <ClientName>{clientName}</ClientName>
                                            <Description>
                                                {description || 'No description'}
                                            </Description>
                                            <TotalPrice>
                                                {console.log(`Formatting price for ${customId} with currency:`, currency)}
                                                {formatPrice(total, currency || 'USD')}
                                            </TotalPrice>
                                            <Status currStatus={status} $grid />
                                            {isDesktop && (
                                                <Icon
                                                    name={'arrow-right'}
                                                    size={10}
                                                    color={colors.purple}
                                                />
                                            )}
                                        </Link>
                                    </Item>
                                );
                            }
                        )}
                    </StyledList>
                </>
            )}
        </>
    );
};

export default List; 