import styled, { css } from 'styled-components';
import { primaryFontStyles } from '../../../utilities/typographyStyles';

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

export const FormContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: calc(24px + env(safe-area-inset-top));
    
    @media (min-width: 768px) {
        padding: 32px;
        padding-top: 32px;
    }
    
    @media (min-width: 1024px) {
        padding: 40px;
        padding-top: 40px;
    }
`;

export const StyledForm = styled.form`
    width: 100%;
    height: 100%;
    padding: 24px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom) + 80px);
    background: #141625;
    border-radius: 12px;
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    
    @media (min-width: 768px) {
        padding: 32px;
        padding-bottom: 32px;
        border-radius: 12px;
    }
    
    @media (min-width: 1024px) {
        padding: 40px;
        padding-bottom: 40px;
    }
    
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
`;

export const FloatingButtons = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(30, 33, 57, 0.95);
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

export const Title = styled.h1`
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    position: sticky;
    top: 0;
    background: #141625;
    z-index: 10;
    margin: -24px -24px 24px -24px;
    padding: 20px 24px 20px 32px;
    border-bottom: 1px solid #252945;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    /* Add a subtle gradient background for better visual hierarchy */
    background: linear-gradient(to bottom, #1E2139, #141625);
    
    /* Add a subtle bottom shadow for depth */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
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

export const Hashtag = styled.span`
    color: #7C5DFA;
`;

export const Fieldset = styled.fieldset`
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-flow: column;
    gap: 16px;

    @media (min-width: 768px) {
        gap: 24px;
    }
`;

export const Legend = styled.legend`
    ${primaryFontStyles}
    color: #7C5DFA;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (min-width: 768px) {
        font-size: 14px;
    }
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-flow: column;
    gap: 8px;
    width: 100%;
`;

export const Label = styled.label`
    ${primaryFontStyles}
    color: #DFE3FA;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ErrorsWrapper = styled.div`
    display: flex;
    flex-flow: column;
    gap: 4px;
    margin-top: 4px;
    padding: 12px;
    background-color: rgba(236, 87, 87, 0.1);
    border-radius: 8px;
`;

export const Error = styled.span`
    color: #EC5757;
    font-size: 12px;
    font-weight: 500;
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

export const InputsGroup = styled.div`
    display: grid;
    gap: 16px;
    margin-bottom: 24px;
    grid-template-columns: 1fr;
    
    ${({ $fullWidthMobile }) =>
        $fullWidthMobile &&
        css`
            @media (max-width: 767px) {
                grid-template-columns: 1fr;
            }
        `}

    @media (min-width: 768px) {
        gap: 24px;
        grid-template-columns: ${({ $columns }) =>
            $columns ? $columns : 'repeat(3, 1fr)'};
    }
`;
