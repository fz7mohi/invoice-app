import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { headingTitle } from '../../utilities/typographyStyles';

export const Container = styled.section`
    width: 100%;
    max-width: 1020px;
    margin: 0 auto;
    padding: 32px 24px;

    @media (min-width: 768px) {
        padding: 56px 48px;
    }

    @media (min-width: 1024px) {
        padding: 72px 48px;
        max-width: 1100px;
    }
`;

export const Header = styled(motion.header)`
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        margin-bottom: 40px;
    }
`;

export const HeaderTop = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 24px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr auto auto;
        gap: 16px;
    }
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: #252945;
    border-radius: 8px;
    border: 1px solid #252945;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
        padding: 16px 32px;
    }
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 400px;
`;

export const SearchInput = styled.input`
    background: none;
    border: none;
    color: #FFFFFF;
    font-size: 14px;
    width: 100%;
    padding: 0;
    margin: 0;
    outline: none;

    &::placeholder {
        color: #888EB0;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        -webkit-text-fill-color: #FFFFFF;
        -webkit-box-shadow: 0 0 0px 1000px #252945 inset;
        transition: background-color 5000s ease-in-out 0s;
    }
`;

export const SearchIcon = styled.span`
    color: #888EB0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    ${SearchContainer}:focus-within & {
        color: #7C5DFA;
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

    ${({ $newInternalPO }) =>
        $newInternalPO &&
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