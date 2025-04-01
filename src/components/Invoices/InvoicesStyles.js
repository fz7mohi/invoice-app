import styled from 'styled-components';
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
    width: 100%;
`;

export const SearchContainer = styled.div`
    position: relative;
    width: 100%;
`;

export const SearchIcon = styled.div`
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textTertiary};
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 12px 16px 12px 40px;
    background: ${({ theme }) => theme.colors.bgInput};
    border: 1px solid ${({ theme }) => theme.colors.bgInputBorder};
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    line-height: 15px;
    letter-spacing: -0.25px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textTertiary};
    }

    @media (min-width: 768px) {
        font-size: 14px;
        line-height: 18px;
        padding: 14px 16px 14px 40px;
    }
`;
