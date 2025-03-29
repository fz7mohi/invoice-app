import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../App/context';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import Status from '../../shared/Status/Status';
import Icon from '../../shared/Icon/Icon';
import { 
    StyledItem, 
    Uid, 
    Hashtag, 
    PaymentDue, 
    ClientName, 
    TotalPrice 
} from './QuotationItemStyles';

const QuotationItem = ({ quotation, index, variant }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    const { id, paymentDue, clientName, status, total } = quotation;

    return (
        <StyledItem
            layout
            variants={variant('list', index)}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Link to={`/quotation/${id}`}>
                <Uid>
                    <Hashtag>#</Hashtag>
                    {id}
                </Uid>
                <PaymentDue>
                    Due {formatDate(paymentDue)}
                </PaymentDue>
                <ClientName>{clientName}</ClientName>
                <TotalPrice>
                    {formatPrice(total)}
                </TotalPrice>
                <Status currStatus={status} $grid />
                {isDesktop && (
                    <Icon
                        name="arrow-right"
                        size={10}
                        color={colors.purple}
                    />
                )}
            </Link>
        </StyledItem>
    );
};

export default QuotationItem; 