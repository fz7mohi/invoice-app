import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { primaryFontStyles } from '../../utilities/typographyStyles';

// Common styles for interactive elements
const interactiveElement = css`
    transition: all 0.2s ease;
    cursor: pointer;
    
    @media (hover: hover) {
        &:hover {
            border-color: #7C5DFA;
        }
    }

    &:focus-visible {
        outline: 2px solid #7C5DFA;
        outline-offset: 2px;
        border-color: #7C5DFA;
    }
`;

export const defaultInput = css`
    width: 100%;
    padding: 14px 16px;
    border-radius: 8px;
    border: 1px solid #252945;
    background-color: #1E2139;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 500;
    min-height: 48px;
    ${interactiveElement}

    &::placeholder {
        color: #DFE3FA;
        opacity: 0.7;
    }

    @media (min-width: 768px) {
        font-size: 15px;
        padding: 12px 16px;
        min-height: 44px;
    }
`;

export const StyledClientFormController = styled(motion.div)`
    position: fixed;
    top: clamp(72px, 10.5vw, 80px);
    bottom: 0;
    left: -20px;
    background-color: #141625;
    padding: 0px 24px 190px 44px;
    z-index: 99;
    width: 100%;
    overscroll-behavior: contain;
    overflow-y: auto;
    overflow-x: hidden;

    /* Custom scrollbar styles */
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: #141625;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #252945;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #7C5DFA;
    }

    &::before {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        right: 0;
        height: 190px;
        background: linear-gradient(
            to top,
            #141625 20%,
            transparent 100%
        );
        z-index: 2;
        pointer-events: none;
    }

    @media (min-width: 700px) {
        max-width: 720px;
        border-radius: 0 20px 20px 0;
        overflow: hidden;
        padding: 56px 40px 127px 46px;
    }

    @media (min-width: 1024px) {
        max-width: 900px;
        padding: 56px 60px 100px 149px;
        top: 0;
    }
    
    @media (min-width: 1440px) {
        max-width: 1000px;
        padding: 56px 70px 100px 159px;
    }
`;

export const FormTitle = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: #141625;
    z-index: 10;
    margin: -24px -24px 24px -24px;
    padding: 20px 24px 20px 32px;
    border-bottom: 1px solid #252945;
    border-radius: 0;
    box-shadow: none;
    
    /* Add a subtle gradient background for better visual hierarchy */
    background: linear-gradient(to bottom, #1E2139, #141625);
    
    /* Add a subtle bottom shadow for depth */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .title-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    @media (min-width: 768px) {
        font-size: 28px;
        margin: -32px -32px 32px -32px;
        padding: 24px 32px;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    @media (min-width: 1024px) {
        font-size: 32px;
        margin: -40px -40px 40px -40px;
        padding: 28px 40px;
        border-radius: 16px 16px 0 0;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
`;

export const FormSection = styled.div`
    background: #252945;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    margin-top: 42px;
`;

export const SectionTitle = styled.h3`
    ${primaryFontStyles}
    color: #7C5DFA;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (min-width: 768px) {
        font-size: 14px;
    }
`;

export const InputGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
`;

export const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 16px;
    display: flex;
    gap: 8px;
    align-items: flex-end;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const InputContainer = styled.div`
    flex: 1;
`;

export const AutoFillButton = styled.button`
    background-color: #7C5DFA;
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    padding: 10px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background-color: #9277FF;
    }
    
    &:active {
        background-color: #6B4DE6;
    }
`;

export const Label = styled.label`
    ${primaryFontStyles}
    color: #DFE3FA;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 6px;
    letter-spacing: 0.3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Input = styled.input`
    ${defaultInput}
    ${({ $error }) =>
        $error &&
        css`
            border-color: #EC5757;
            &:hover, &:focus {
                border-color: #EC5757;
                box-shadow: 0 0 0 2px rgba(236, 87, 87, 0.1);
            }
        `}
    ${({ $valid }) =>
        $valid &&
        css`
            border-color: #33D69F;
            &:hover, &:focus {
                border-color: #33D69F;
                box-shadow: 0 0 0 2px rgba(51, 214, 159, 0.1);
            }
        `}
`;

export const TextArea = styled.textarea`
    ${defaultInput}
    min-height: 100px;
    resize: vertical;
    ${({ $error }) =>
        $error &&
        css`
            border-color: #EC5757;
            &:hover, &:focus {
                border-color: #EC5757;
                box-shadow: 0 0 0 2px rgba(236, 87, 87, 0.1);
            }
        `}
    ${({ $valid }) =>
        $valid &&
        css`
            border-color: #33D69F;
            &:hover, &:focus {
                border-color: #33D69F;
                box-shadow: 0 0 0 2px rgba(51, 214, 159, 0.1);
            }
        `}
`;

export const Select = styled.select`
    ${defaultInput}
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23DFE3FA' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.763L10.825 4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
    ${({ $error }) =>
        $error &&
        css`
            border-color: #EC5757;
            &:hover, &:focus {
                border-color: #EC5757;
                box-shadow: 0 0 0 2px rgba(236, 87, 87, 0.1);
            }
        `}
    ${({ $valid }) =>
        $valid &&
        css`
            border-color: #33D69F;
            &:hover, &:focus {
                border-color: #33D69F;
                box-shadow: 0 0 0 2px rgba(51, 214, 159, 0.1);
            }
        `}
`;

export const ErrorMessage = styled.span`
    color: #EC5757;
    font-size: 11px;
    margin-top: 4px;
    display: block;
    font-weight: 500;
`;

export const RequiredIndicator = styled.span`
    color: #EC5757;
    margin-left: 2px;
    font-size: 10px;
`;

export const Tooltip = styled.div`
    position: absolute;
    top: -36px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #252945;
    color: #FFFFFF;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    z-index: 10;
    
    &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #252945;
    }
`;

export const InputWrapperWithTooltip = styled(InputWrapper)`
    &:hover ${Tooltip} {
        opacity: 1;
        visibility: visible;
    }
`;

export const FormFooter = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(30, 33, 57, 0.95);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid #252945;
    z-index: 100;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));

    @media (min-width: 768px) {
        left: 80px;
        padding: 24px 32px;
        gap: 12px;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    
    button {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    button:first-child {
        background-color: transparent;
        color: #DFE3FA;
        border: 1px solid #252945;
        
        &:hover {
            background-color: rgba(223, 227, 250, 0.1);
            border-color: #DFE3FA;
        }
    }
    
    button:last-child {
        background-color: #7C5DFA;
        color: #FFFFFF;
        border: none;
        
        &:hover {
            background-color: #9277FF;
        }
    }
    
    @media (min-width: 768px) {
        gap: 12px;
        
        button {
            padding: 10px 20px;
            font-size: 15px;
        }
    }
`; 