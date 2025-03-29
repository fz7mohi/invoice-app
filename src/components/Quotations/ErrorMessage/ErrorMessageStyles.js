import styled from 'styled-components';
import { motion } from 'framer-motion';
import IllustrationEmpty from '../../../assets/images/illustration-empty.svg';

export const StyledErrorMessage = styled(motion.div)`
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-top: 64px;

    @media (min-width: 768px) {
        margin-top: 134px;
    }

    @media (min-width: 1024px) {
        margin-top: 140px;
    }
`;

export const Illustration = styled.div`
    width: 200px;
    height: 200px;
    background-image: url('${IllustrationEmpty}');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-bottom: 40px;

    @media (min-width: 768px) {
        width: 242px;
        height: 200px;
        margin-bottom: 64px;
    }
`;

export const Title = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 20px;
    margin-bottom: 23px;
`;

export const Text = styled.p`
    color: ${({ theme }) => theme.colors.textTertiary};
    max-width: 220px;
    text-align: center;
    line-height: 1.4;
    font-size: 12px;

    @media (min-width: 768px) {
        max-width: 240px;
    }
`;

export const Bold = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
`; 