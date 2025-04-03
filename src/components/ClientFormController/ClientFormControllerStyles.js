import { motion } from 'framer-motion';
import styled from 'styled-components';

export const StyledClientFormController = styled(motion.div)`
    position: fixed;
    top: clamp(72px, 10.5vw, 80px);
    bottom: 0;
    left: -20px;
    background-color: #1E2139;
    padding: 32px 24px 190px 44px;
    z-index: 99;
    width: 100%;
    overscroll-behavior: contain;
    overflow-y: auto;
    overflow-x: hidden;

    /* Form elements styling */
    input, select, textarea {
        background-color: #1E2139 !important;
        border: 1px solid #252945 !important;
        color: #FFFFFF !important;

        &::placeholder {
            color: #DFE3FA !important;
        }

        &:focus {
            border-color: #7C5DFA !important;
        }
    }

    label {
        color: #DFE3FA !important;
    }

    h1, h2, h3, h4, h5, h6, p, span {
        color: #FFFFFF !important;
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
            #1E2139 20%,
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
    color: #FFFFFF;
    font-weight: 600;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const FormSection = styled.div`
    background: #252945;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
`;

export const SectionTitle = styled.h3`
    font-size: 12px;
    color: #DFE3FA;
    font-weight: 500;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const InputGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;

export const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 16px;
    display: flex;
    gap: 8px;
    align-items: flex-start;

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
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;
    
    &:hover {
        background-color: #9277FF;
    }
    
    &:active {
        background-color: #6B4DE6;
    }
`;

export const Label = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #DFE3FA;
    margin-bottom: 6px;
    letter-spacing: 0.3px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #252945;
    background-color: #1E2139;
    color: #FFFFFF;
    font-size: 13px;
    
    &:focus {
        border-color: #7C5DFA;
    }
    
    &::placeholder {
        color: #DFE3FA;
        opacity: 0.5;
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #252945;
    background-color: #1E2139;
    color: #FFFFFF;
    font-size: 13px;
    min-height: 100px;
    resize: vertical;
    
    &:focus {
        border-color: #7C5DFA;
    }
`;

export const Select = styled.select`
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #252945;
    background-color: #1E2139;
    color: #FFFFFF;
    font-size: 13px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23DFE3FA' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.763L10.825 4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
    
    &:focus {
        border-color: #7C5DFA;
    }
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
    background: #1E2139;
    padding: 16px 24px;
    border-top: 1px solid #252945;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    z-index: 10;

    @media (min-width: 768px) {
        left: -20px;
        right: auto;
        max-width: 720px;
        border-radius: 0 0 20px 0;
    }

    @media (min-width: 1024px) {
        max-width: 900px;
    }
`; 