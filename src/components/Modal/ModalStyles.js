import styled from 'styled-components';
import {
    primaryFontStyles,
    headingLarge,
} from '../../utilities/typographyStyles';
import { motion } from 'framer-motion';

export const StyledModal = styled(motion.div)`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    z-index: 100;
`;

export const Container = styled(motion.div)`
    width: 100%;
    max-width: 480px;
    padding: 32px;
    border-radius: 8px;
    background-color: #1E2139;
    border: 1px solid #252945;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
`;

export const Title = styled.h2`
    ${headingLarge}
    color: #FFFFFF;
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: 700;
`;

export const Text = styled.p`
    ${primaryFontStyles}
    color: #DFE3FA;
    margin-bottom: 24px;
    line-height: 1.84;
    font-size: 15px;
`;

export const CtaGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;

    button {
        min-width: 100px;
        padding: 16px 24px;
        border-radius: 24px;
        font-weight: 700;
        font-size: 15px;
        transition: all 0.3s ease;

        &:first-child {
            background-color: #252945;
            color: #DFE3FA;
            
            &:hover {
                background-color: #1E2139;
            }
        }

        &:last-child {
            background-color: #7C5DFA;
            color: #FFFFFF;
            
            &:hover {
                background-color: #9277FF;
            }
        }
    }
`;
