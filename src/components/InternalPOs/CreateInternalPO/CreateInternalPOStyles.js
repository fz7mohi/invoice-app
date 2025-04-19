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
    backdrop-filter: blur(8px);
`;

export const Modal = styled(motion.div)`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    margin: 0 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow: hidden;
    transform-origin: center;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

export const Title = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
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
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 40px;
    height: 40px;

    &:hover {
        color: ${({ theme }) => theme.colors.textPrimary};
        background-color: ${({ theme }) => theme.colors.backgroundAlt};
        transform: rotate(90deg);
    }
`;

export const Content = styled.div`
    padding: 32px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const Label = styled.label`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    display: block;
`;

export const Select = styled.select`
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 15px;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23DFE3FA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.purple}20`};
    }

    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const Option = styled.option`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 12px;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
`;

export const Button = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
    height: 48px;
    position: relative;
    overflow: hidden;

    ${({ $primary }) => $primary ? `
        background-color: ${({ theme }) => theme.colors.purple};
        color: ${({ theme }) => theme.colors.white};
        border: none;
        box-shadow: 0 2px 8px ${({ theme }) => `${theme.colors.purple}40`};

        &:hover {
            background-color: ${({ theme }) => theme.colors.lightPurple};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.purple}50`};
        }

        &:active {
            transform: translateY(1px);
            box-shadow: 0 1px 4px ${({ theme }) => `${theme.colors.purple}40`};
        }

        &::before {
            content: '+';
            margin-right: 6px;
            font-size: 18px;
        }
    ` : `
        background-color: ${({ theme }) => theme.colors.backgroundAlt};
        color: ${({ theme }) => theme.colors.textPrimary};
        border: 1.5px solid ${({ theme }) => theme.colors.border};

        &:hover {
            background-color: ${({ theme }) => theme.colors.backgroundItem};
            border-color: ${({ theme }) => theme.colors.purple};
            color: ${({ theme }) => theme.colors.purple};
            transform: translateY(-1px);
        }

        &:active {
            transform: translateY(1px);
        }
    `}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px ${({ theme, $primary }) => 
            $primary ? `${theme.colors.purple}30` : `${theme.colors.border}50`};
    }

    @media (max-width: 767px) {
        padding: 10px 20px;
        font-size: 14px;
        min-width: 100px;
        height: 44px;
    }
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    font-size: 14px;
    font-weight: 500;
    padding: 12px;
    background-color: ${({ theme }) => `${theme.colors.error}10`};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => `${theme.colors.error}20`};
    margin-top: 8px;
`; 