import styled from 'styled-components';
import { motion } from 'framer-motion';
import { headingTitle } from '../../utilities/typographyStyles';

export const Container = styled.section`
    padding: 0 24px;
    margin-bottom: 40px;

    @media (min-width: 768px) {
        width: 100%;
        max-width: 730px;
        margin: 0 auto 40px auto;
        padding: 0;
    }
`;

export const Header = styled(motion.div)`
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 18px;
    align-items: center;
    margin: 32px 0;

    @media (min-width: 768px) {
        gap: 40px;
    }

    @media (min-width: 1024px) {
        margin: 72px 0 64px 0;
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
    margin-right: 4rem;

    @media (max-width: 768px) {
        margin-right: 1.8rem;
    }

    @media (max-width: 480px) {
        margin-right: 1.1rem;
    }
`;

export const Filter = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    color: ${({ theme }) => theme.textPrimary};

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
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    width: 19.2rem;
    border-radius: 0.8rem;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.25);
    background-color: ${({ theme }) => theme.dropdownBg};
    z-index: 2;

    div {
        padding: 1.6rem 2.4rem;
        cursor: pointer;

        &:first-child {
            border-top-left-radius: 0.8rem;
            border-top-right-radius: 0.8rem;
        }

        &:last-child {
            border-bottom-left-radius: 0.8rem;
            border-bottom-right-radius: 0.8rem;
        }

        &:hover {
            color: ${({ theme }) => theme.textCheckbox};
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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    height: 4.8rem;
    width: 15rem;
    border-radius: 2.4rem;
    background-color: ${({ theme }) => theme.btnPrimary};
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
    transition: background-color 0.2s ease;

    &:hover,
    &:focus {
        background-color: ${({ theme }) => theme.btnPrimaryHover};
    }

    span {
        position: relative;
        top: 0.1rem;
    }

    div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 50%;
        background-color: white;
    }

    @media (max-width: 480px) {
        width: 9rem;

        span {
            display: none;
        }
    }
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