import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useState, useEffect } from 'react';
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
                <HeaderItem className="date">Due Date</HeaderItem>
                <HeaderItem className="client">Client</HeaderItem>
                <HeaderItem className="project">Project</HeaderItem>
                <HeaderItem className="id">Quotation ID</HeaderItem>
                <HeaderItem className="price">Amount</HeaderItem>
                <HeaderItem className="status">Status</HeaderItem>
            </ListHeader>
            <StyledList
                variants={variant('list', 0)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {dataToDisplay.map((quotation, index) => (
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