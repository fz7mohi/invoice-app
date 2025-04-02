import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import Icon from '../../shared/Icon/Icon';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { formatDate } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import {
    StyledList,
    Item,
    Link,
    Uid,
    Hashtag,
    PaymentDue,
    ClientName,
    Description,
    StatusBadge,
    StatusDot,
    LoadingContainer
} from './ListStyles';

const List = ({ deliveryOrders, isLoading }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;

    if (isLoading) {
        return (
            <StyledList>
                <LoadingContainer>Loading delivery orders...</LoadingContainer>
            </StyledList>
        );
    }

    if (!deliveryOrders || deliveryOrders.length === 0) {
        return <ErrorMessage />;
    }

    return (
        <StyledList>
            {deliveryOrders.map((order) => (
                <RouterLink
                    to={`/delivery-order/${order.id}`}
                    key={order.id}
                    style={{ textDecoration: 'none' }}
                >
                    <Item>
                        <Link>
                            <PaymentDue>
                                {formatDate(order.createdAt)}
                            </PaymentDue>
                            <Uid>
                                <Hashtag>#</Hashtag>
                                {order.customId || order.id}
                            </Uid>
                            <ClientName>{order.clientName}</ClientName>
                            <Description>{order.description}</Description>
                            <StatusBadge status={order.status}>
                                <StatusDot status={order.status} />
                                {order.status}
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