import styled from 'styled-components';
import { motion } from 'framer-motion';
import Icon from '../../shared/Icon/Icon';

const ErrorMessage = ({ message, variant }) => {
    return (
        <Container
            as={motion.div}
            variants={variant}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Icon name="alert-circle" size={24} color="var(--error-color)" />
            <Message>{message}</Message>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem;
    background-color: var(--background-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    text-align: center;
`;

const Message = styled.p`
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
`;

export default ErrorMessage; 