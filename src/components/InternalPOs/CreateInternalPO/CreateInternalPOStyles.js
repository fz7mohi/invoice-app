import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const Modal = styled(motion.div)`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 8px;
    width: 100%;
    max-width: 480px;
    margin: 0 24px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 20px;
    font-weight: 700;
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.textPrimary};
    }
`;

export const Content = styled.div`
    padding: 24px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const Label = styled.label`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
`;

export const Select = styled.select`
    width: 100%;
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
    }
`;

export const Option = styled.option`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
`;

export const Button = styled.button`
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    ${({ $primary }) => $primary ? `
        background-color: ${({ theme }) => theme.colors.purple};
        color: ${({ theme }) => theme.colors.white};
        border: none;

        &:hover {
            background-color: ${({ theme }) => theme.colors.lightPurple};
        }
    ` : `
        background-color: transparent;
        color: ${({ theme }) => theme.colors.textSecondary};
        border: 1px solid ${({ theme }) => theme.colors.border};

        &:hover {
            color: ${({ theme }) => theme.colors.textPrimary};
            border-color: ${({ theme }) => theme.colors.textPrimary};
        }
    `}
`;

export const ErrorMessage = styled.p`
    color: ${({ theme }) => theme.colors.error};
    font-size: 14px;
    margin-top: 8px;
`; 