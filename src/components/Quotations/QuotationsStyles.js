import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { headingTitle } from '../../utilities/typographyStyles';

export const Container = styled.section`
    padding: 32px 24px;
    margin-bottom: 40px;
    max-width: 100%;

    @media (min-width: 768px) {
        width: 100%;
        max-width: 95%;
        margin: 0 auto 40px auto;
        padding: 56px 24px;
    }
    
    @media (min-width: 1024px) {
        max-width: 90%;
        padding: 72px 32px 40px;
    }
    
    @media (min-width: 1440px) {
        max-width: 1300px;
        padding: 72px 40px 40px;
    }
`;

export const Header = styled(motion.header)`
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr auto auto;
        gap: 16px;
    }

    /* Override for New Quotation button */
    button[type="button"] {
        background-color: #7C5DFA !important;
        color: #FFFFFF !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 8px 24px !important;
        height: 48px !important;
        border-radius: 24px !important;
        font-weight: 700 !important;
        border: none !important;
        cursor: pointer !important;
        transition: background-color 0.3s ease !important;

        &:hover {
            background-color: #9277FF !important;
        }

        &:before {
            content: '+';
            font-size: 20px;
            margin-right: 4px;
            color: #FFFFFF !important;
        }

        @media (max-width: 767px) {
            padding: 8px 16px !important;
            
            span {
                display: none;
            }
        }
    }
`;

export const Info = styled.div``;

export const Title = styled.h1`
    ${headingTitle}
    margin-bottom: 4px;
`;

export const Text = styled.p`
    color: ${({ theme }) => theme.colors.textTertiary};
    transition: color 400ms ease-in;
`;

export const Options = styled.div`
    display: flex;
    align-items: center;
`;

export const FiltersContainer = styled.div`
    position: relative;
    margin-right: 16px;

    @media (min-width: 768px) {
        margin-right: 24px;
    }
`;

export const Filter = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.white} !important;
    padding: 8px 16px;
    border-radius: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.purple};
        color: ${({ theme }) => theme.colors.white} !important;
    }

    span {
        @media (max-width: 480px) {
            display: none;
        }
    }

    img {
        transition: transform 0.2s ease;
        transform: ${({ isFilterOpen }) =>
            isFilterOpen ? 'rotate(180deg)' : 'rotate(0)'};
    }
`;

export const Dropdown = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 192px;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    z-index: 10;

    div {
        padding: 16px 24px;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white} !important;
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
            background-color: ${({ theme }) => theme.colors.purple};
            color: ${({ theme }) => theme.colors.white} !important;
        }

        &:first-child {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }
`;

export const Checkbox = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.textPrimary};

    div {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 0.2rem;
        background-color: ${({ isChecked, theme }) =>
            isChecked ? theme.checkboxBg : theme.checkboxBgUnchecked};

        &:hover {
            border: 1px solid ${({ theme }) => theme.btnPrimary};
        }
    }
`;

export const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 24px;
    height: 48px;
    border-radius: 24px;
    background-color: ${({ theme }) => theme.colors.purple};
    color: ${({ theme }) => theme.colors.white};
    font-size: 15px;
    font-weight: 700;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;

    &::before {
        content: '+';
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin-right: 8px;
        color: ${({ theme }) => theme.colors.white};
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.lightPurple};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 767px) {
        padding: 8px 16px;
        font-size: 14px;
        
        span {
            display: none;
        }
    }

    ${({ $newInvoice }) =>
        $newInvoice &&
        css`
            background-color: ${({ theme }) => theme.colors.purple};
            color: ${({ theme }) => theme.colors.white};
            padding: 8px 24px;
            height: 48px;
            border-radius: 24px;
            font-weight: 700;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;

            &, &:visited, &:active {
                background-color: ${({ theme }) => theme.colors.purple};
                color: ${({ theme }) => theme.colors.white};
            }

            &:hover {
                background-color: ${({ theme }) => theme.colors.lightPurple};
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `}
`;

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

export const MsgBox = styled.div`
    margin-top: 10rem;
    h2 {
        color: ${({ theme }) => theme.textPrimary};
    }
`;

export const ErrorMessage = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 15rem;
    max-width: 20rem;

    img {
        width: 25rem;
        height: 20rem;
        object-fit: cover;
        margin-bottom: 4rem;
    }

    h2 {
        color: ${({ theme }) => theme.textPrimary};
        font-size: 2rem;
    }
    p {
        margin-top: 2rem;
        color: ${({ theme }) => theme.textSecondary};
        letter-spacing: -0.1px;
        font-size: 1.2rem;
        line-height: 1.5;
    }
`;

export const Loader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
`;

export const SpinnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    
    p {
        color: ${({ theme }) => theme.textSecondary};
        font-size: 1.6rem;
    }
`; 