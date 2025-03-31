import styled, { css } from 'styled-components';
import { primaryFontStyles } from '../../../utilities/typographyStyles';

export const defaultInput = css`
    width: 100%;
    padding: 12px 16px;
    border-radius: 6px;
    border: 1px solid #252945;
    background-color: #1E2139;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;

    &::placeholder {
        color: #DFE3FA;
        opacity: 0.7;
    }

    &:hover {
        border-color: #7C5DFA;
    }

    &:focus {
        border-color: #7C5DFA;
        outline: none;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }
`;

export const FormContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const StyledForm = styled.form`
    width: 100%;
    display: flex;
    flex-flow: column;
    gap: 32px;
    padding: 24px;
    background-color: #1E2139;
    border-radius: 12px;
    flex: 1;
    overflow-y: auto;
    position: relative;
    padding-bottom: 120px;

    /* Custom scrollbar styles */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #1E2139;
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
    background-color: #1E2139;
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid #252945;
    z-index: 100;
    
    @media (min-width: 768px) {
        left: 80px;
        padding: 16px 32px;
    }
`;

export const Title = styled.h1`
    ${primaryFontStyles}
    color: #FFFFFF;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    position: sticky;
    top: 0;
    background-color: #1E2139;
    padding-bottom: 16px;
    z-index: 10;
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
    gap: 24px;
`;

export const Legend = styled.legend`
    ${primaryFontStyles}
    color: #7C5DFA;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
`;

export const ErrorsWrapper = styled.div`
    display: flex;
    flex-flow: column;
    gap: 4px;
    margin-top: 4px;
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
    gap: 24px;
    margin-bottom: 24px;
    
    ${({ $fullWidthMobile }) =>
        $fullWidthMobile &&
        css`
            @media (max-width: 767px) {
                grid-template-columns: 1fr;
            }
        `}

    @media (min-width: 768px) {
        grid-template-columns: ${({ $columns }) =>
            $columns ? $columns : 'repeat(3, 1fr)'};
    }
`;
