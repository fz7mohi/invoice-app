import { useGlobalContext } from '../../App/context';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledErrorMessage = styled(motion.div)`
    width: 100%;
    max-width: 220px;
    margin: 0 auto;
    text-align: center;

    @media (min-width: 768px) {
        max-width: 240px;
    }
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 20px;
    line-height: 1.5;
    letter-spacing: -0.63px;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        font-size: 24px;
        letter-spacing: -0.75px;
    }
`;

const Description = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.45;
    margin-bottom: 24px;

    span {
        font-weight: 700;
    }
`;

const ErrorMessage = () => {
    const { windowWidth } = useGlobalContext();

    return (
        <StyledErrorMessage>
            <Title>There are no receipts</Title>
            <Description>
                Create a new receipt by clicking the
                <span>{windowWidth >= 768 ? ' "New Receipt" ' : ' "New" '}</span>
                button and get started
            </Description>
        </StyledErrorMessage>
    );
};

export default ErrorMessage; 