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
    EmptyState,
    EmptyHeading,
    EmptyText
} from './ListStyles';
import styled from 'styled-components';

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
            
            const fetchedData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    customId: data.customId || generateCustomId(),
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    paymentDue: data.paymentDue?.toDate() || new Date(),
                };
            });
            
            setDirectData(fetchedData);
        } catch (error) {
            console.error('Error fetching quotations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isEmpty && !isLoading) {
        return (
            <EmptyState>
                <img 
                    src={require('../../../assets/images/illustration-empty.svg')} 
                    alt="No quotations" 
                />
                <EmptyHeading>There is nothing here</EmptyHeading>
                <EmptyText>
                    Create a new quotation by clicking the New Quotation button and get started
                </EmptyText>
            </EmptyState>
        );
    }

    return (
        <StyledList>
            {quotations.map((quotation, index) => (
                <Item
                    key={quotation.id}
                    variants={variant('list', index)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                >
                    <Link>
                        <Uid>
                            <Hashtag>#</Hashtag>
                            {quotation.customId || quotation.id}
                        </Uid>
                        <PaymentDue>Due {formatDate(quotation.paymentDue)}</PaymentDue>
                        <ClientName>{quotation.clientName}</ClientName>
                        <Description>{quotation.description || 'No description'}</Description>
                    </Link>
                    
                    <TotalPrice>
                        <h3>{formatPrice(quotation.total)}</h3>
                        <Status currStatus={quotation.status}>
                            <span>•</span>
                            {quotation.status}
                        </Status>
                    </TotalPrice>
                </Item>
            ))}
        </StyledList>
    );
};

export default List; 