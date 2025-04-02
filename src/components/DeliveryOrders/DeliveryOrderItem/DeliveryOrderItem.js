import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import Icon from '../../shared/Icon/Icon';
import { 
    Container,
    Content,
    Header,
    Title,
    Status,
    StatusDot,
    StatusText,
    Info,
    InfoItem,
    InfoLabel,
    InfoValue,
    Actions,
    ActionButton
} from './DeliveryOrderItemStyles';

const DeliveryOrderItem = ({ order, isLoading, variant, index }) => {
    const history = useHistory();

    if (isLoading) {
        return (
            <Container
                as={motion.div}
                variants={variant('list', index)}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Content>
                    <Header>
                        <Title>Loading...</Title>
                        <Status>
                            <StatusDot />
                            <StatusText>Loading...</StatusText>
                        </Status>
                    </Header>
                    <Info>
                        <InfoItem>
                            <InfoLabel>Client</InfoLabel>
                            <InfoValue>Loading...</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Date</InfoLabel>
                            <InfoValue>Loading...</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Total</InfoLabel>
                            <InfoValue>Loading...</InfoValue>
                        </InfoItem>
                    </Info>
                </Content>
            </Container>
        );
    }

    const handleView = () => {
        history.push(`/delivery-orders/${order.id}`);
    };

    const handleEdit = () => {
        history.push(`/delivery-orders/${order.id}/edit`);
    };

    return (
        <Container
            as={motion.div}
            variants={variant('list', index)}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Content>
                <Header>
                    <Title>
                        Delivery Order #{order.customId || order.id}
                    </Title>
                    <Status>
                        <StatusDot $status={order.status} />
                        <StatusText>{order.status}</StatusText>
                    </Status>
                </Header>
                <Info>
                    <InfoItem>
                        <InfoLabel>Client</InfoLabel>
                        <InfoValue>{order.clientName}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Date</InfoLabel>
                        <InfoValue>
                            {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Total</InfoLabel>
                        <InfoValue>${order.total.toFixed(2)}</InfoValue>
                    </InfoItem>
                </Info>
                <Actions>
                    <ActionButton
                        onClick={handleView}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon name="eye" size={16} />
                        View
                    </ActionButton>
                    <ActionButton
                        onClick={handleEdit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon name="edit" size={16} />
                        Edit
                    </ActionButton>
                </Actions>
            </Content>
        </Container>
    );
};

export default DeliveryOrderItem; 