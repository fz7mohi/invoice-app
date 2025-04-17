import { motion } from 'framer-motion';
import { ErrorMessageContainer, Title, Text } from './ErrorMessageStyles';

const ErrorMessage = ({ message, subMessage }) => {
    return (
        <ErrorMessageContainer
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Title>No Internal POs Found</Title>
            <Text>{message || 'There are no internal POs to display at this time.'}</Text>
            {subMessage && <Text>{subMessage}</Text>}
        </ErrorMessageContainer>
    );
};

export default ErrorMessage; 