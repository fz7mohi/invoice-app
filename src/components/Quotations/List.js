import { useGlobalContext } from '../App/context';
import { Link } from 'react-router-dom';
import { useReducedMotion, AnimatePresence } from 'framer-motion';
import { formatDate, formatPrice } from '../../utilities/helpers';
import arrowRight from '../../assets/images/icon-arrow-right.svg';
import { quotationsVariants } from '../../utilities/framerVariants';
import {
    ListContainer,
    QuotationItem,
    QuotationInfo,
    QuotationId,
    ClientName,
    DueDate,
    Total,
    StatusContainer,
    Status,
    ShowMore,
} from './ListStyles';

export const QuotationsList = ({ quotations }) => {
    const shouldReduceMotion = useReducedMotion();
    
    // Define variant based on motion preference
    const variant = shouldReduceMotion
        ? quotationsVariants.reduced
        : quotationsVariants;
        
    return (
        <ListContainer>
            <AnimatePresence>
                {quotations.map((quotation, index) => (
                    <QuotationItemComponent
                        key={quotation.id}
                        quotation={quotation}
                        index={index}
                        variant={variant}
                    />
                ))}
            </AnimatePresence>
        </ListContainer>
    );
};

const QuotationItemComponent = ({ quotation, index, variant }) => {
    const { windowWidth } = useGlobalContext();
    
    return (
        <QuotationItem
            as={Link}
            to={`/quotations/${quotation.id}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variant.list(index)}
            layout
        >
            <QuotationInfo>
                <QuotationId>
                    <span>#</span>
                    {quotation.id}
                </QuotationId>
                <DueDate>Due {formatDate(quotation.paymentDue)}</DueDate>
                <ClientName>{quotation.clientName}</ClientName>
            </QuotationInfo>
            <Total>
                <h3>{formatPrice(quotation.total)}</h3>
                <StatusContainer>
                    <Status status={quotation.status}>
                        <span>•</span>
                        {quotation.status}
                    </Status>
                    {windowWidth > 768 && (
                        <ShowMore>
                            <img src={arrowRight} alt="Show quotation" />
                        </ShowMore>
                    )}
                </StatusContainer>
            </Total>
            {windowWidth <= 768 && (
                <ShowMore>
                    <img src={arrowRight} alt="Show quotation" />
                </ShowMore>
            )}
        </QuotationItem>
    );
};