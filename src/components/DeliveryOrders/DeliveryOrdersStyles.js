import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { headingTitle } from '../../utilities/typographyStyles';
import checkIcon from '../../assets/images/icon-check.svg';

export const Container = styled(motion.div)`
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
    margin-bottom: 32px;
`;

export const HeaderTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        margin-bottom: 32px;
    }
`;

export const Info = styled.div``;

export const Title = styled.h1`
    ${headingTitle}
    margin-bottom: 4px;
`;

export const Text = styled.p`
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 12px;
    line-height: 15px;
    letter-spacing: -0.25px;

    @media (min-width: 768px) {
        font-size: 14px;
        line-height: 18px;
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

export const StyledFilter = styled.div`
    position: relative;
    margin-right: 16px;

    @media (min-width: 768px) {
        margin-right: 24px;
    }
`;

export const FilterButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    border-radius: 24px;
    color: ${({ theme }) => theme.colors.white};
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.purple};
    }

    @media (min-width: 768px) {
        padding: 8px 24px;
    }
`;

export const FilterList = styled(motion.ul)`
    display: flex;
    position: absolute;
    flex-flow: column;
    gap: 16px;
    top: calc(100% + 8px);
    left: 50%;
    width: clamp(134px, 19vw, 192px);
    padding: 24px;
    background-color: #1E2139;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    transform: translateX(-50%);
    transition: all 0.3s ease;
    z-index: 10;
    border: 1px solid ${({ theme }) => theme.colors.purple};
`;

export const FilterItem = styled.li``;

export const StatusFilter = styled.button`
    position: relative;
    padding: 0 0 0 29px;
    width: 100%;
    text-align: left;
    color: #FFFFFF !important;
    transition: all 0.3s ease;
    background-color: #1E2139;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: -0.25px;

    &::before {
        position: absolute;
        content: '';
        top: -2px;
        left: 0;
        width: 16px;
        height: 16px;
        background-color: #1E2139;
        border: 1px solid ${({ theme }) => theme.colors.purple};
        border-radius: 2px;
        transition: all 0.3s ease;

        ${({ $isActive }) =>
            $isActive &&
            css`
                background-color: ${({ theme }) => theme.colors.purple};
                background-image: url('${checkIcon}');
                background-repeat: no-repeat;
                background-size: 10px;
                background-position: center;
                border-color: ${({ theme }) => theme.colors.purple};
            `}
    }

    &:hover {
        color: ${({ theme }) => theme.colors.purple} !important;
        background-color: #252945;
        
        &::before {
            border-color: ${({ theme }) => theme.colors.purple};
        }
    }
`;

export const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;

    @media (min-width: 768px) {
        padding: 48px;
    }
`;

export default Container; 