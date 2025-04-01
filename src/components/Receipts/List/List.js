import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import Icon from '../../shared/Icon/Icon';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import {
    StyledList,
    Item,
    Link,
    Uid,
    Hashtag,
    PaymentDue,
    ClientName,
    AmountPaid,
    StatusBadge,
    StatusDot,
    LoadingContainer
} from './ListStyles';

const List = ({ receipts, isLoading }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;

    if (isLoading) {
        return (
            <StyledList>
                <LoadingContainer>Loading receipts...</LoadingContainer>
            </StyledList>
        );
    }

    if (!receipts || receipts.length === 0) {
        return <ErrorMessage />;
    }

    return (
        <StyledList>
            {receipts.map((receipt) => (
                <RouterLink
                    to={`/receipt/${receipt.id}`}
                    key={receipt.id}
                    style={{ textDecoration: 'none' }}
                >
                    <Item>
                        <Link>
                            <PaymentDue>
                                {formatDate(receipt.createdAt)}
                            </PaymentDue>
                            <Uid>
                                <Hashtag>#</Hashtag>
                                {receipt.customId || receipt.id}
                            </Uid>
                            <ClientName>{receipt.clientName}</ClientName>
                            <AmountPaid>
                                {formatPrice(receipt.amount, receipt.currency)}
                            </AmountPaid>
                            <StatusBadge status={receipt.status}>
                                <StatusDot status={receipt.status} />
                                {receipt.status}
                            </StatusBadge>
                            {isDesktop && (
                                <Icon
                                    name="arrow-right"
                                    size={12}
                                    color={colors.purple}
                                />
                            )}
                        </Link>
                    </Item>
                </RouterLink>
            ))}
        </StyledList>
    );
};

export default List; 