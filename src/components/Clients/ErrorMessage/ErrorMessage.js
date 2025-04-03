import { useGlobalContext } from '../../App/context';
import {
    StyledErrorMessage,
    Illustration,
    Title,
    Text,
    Bold,
} from './ErrorMessageStyles';

const ErrorMessage = ({ variant }) => {
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;

    return (
        <StyledErrorMessage
            variants={variant('error')}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Illustration />
            <Title>There is nothing here</Title>
            <Text>
                Create a client by clicking the{' '}
                <Bold>New Client</Bold> button and get started
            </Text>
        </StyledErrorMessage>
    );
};

export default ErrorMessage; 