import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import doxLogo from '../../assets/images/dox-logo.svg';
import avatar from '../../assets/images/image-avatar.png';

export const StyledHeader = styled.header`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    background-color: ${({ theme }) => theme?.backgrounds?.card || (theme?.mode === 'dark' ? '#1E2139' : '#ffffff')};
    height: clamp(72px, 10.5vw, 80px);
    transition: background-color 400ms ease-in-out;
    z-index: 100;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.purple || '#7c5dfa'}20;

    @media (min-width: 1024px) {
        position: fixed;
        top: 0;
        left: 0;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto auto;
        height: 100vh;
        width: 103px;
        border-radius: 0 20px 20px 0;
        overflow-y: auto;
        padding: 0;
        margin: 0;
        box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
        border-bottom: none;
    }
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    grid-column: 2;

    img {
        height: 32px;
        width: auto;
    }

    @media (min-width: 1024px) {
        display: none;
    }
`;

export const Logo = styled(Link)`
    position: relative;
    background-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    width: clamp(72px, 10.5vw, 80px);
    height: 100%;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    overflow: hidden;

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: 2px dashed ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
        outline-offset: 2px;
    }

    &::before {
        position: absolute;
        content: '';
        top: 50%;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme?.colors?.purpleLight || '#9277ff'};
        border-radius: 20px 0;
    }

    &::after {
        position: absolute;
        content: '';
        top: 50%;
        left: 50%;
        width: 28px;
        height: 28px;
        background-image: url('${logo}');
        background-repeat: no-repeat;
        background-size: contain;
        transform: translate(-50%, -50%);

        @media (min-width: 768px) {
            width: 31px;
            height: 31px;
        }

        @media (min-width: 1024px) {
            width: 40px;
            height: 40px;
        }
    }

    @media (min-width: 1024px) {
        width: 100%;
        height: 103px;
    }
`;

export const ThemeToggle = styled.button`
    background-color: transparent;
    border: none;
    padding: 0 clamp(24px, 4.5vw, 32px);
    cursor: pointer;

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: 2px dashed ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
        outline-offset: -4px;
    }

    @media (min-width: 768px) {
        &:hover svg {
            color: ${({ theme }) => theme?.colors?.btnThemeHover || '#dfe3fa'};
            transition: color 300ms ease-in;
        }
    }

    @media (min-width: 1024px) {
        padding: 32px 0;
    }
`;

export const Profile = styled.div`
    position: relative;
    width: clamp(80px, 12.5vw, 96px);
    border-left: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
    ${({ isMobile }) => isMobile && `
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-left: none;
        border-bottom: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
    `}

    @media (min-width: 1024px) {
        height: 88px;
        width: 100%;
        border-left: unset;
        border-top: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
    }

    &::before {
        position: absolute;
        content: '';
        top: 50%;
        left: 50%;
        width: 32px;
        height: 32px;
        background-image: url('${avatar}');
        background-position: center;
        background-size: cover;
        border-radius: 50%;
        transform: translate(-50%, -50%);

        @media (min-width: 1024px) {
            width: 40px;
            height: 40px;
        }
        
        ${({ isMobile }) => isMobile && `
            width: 48px;
            height: 48px;
        `}
    }
`;

export const MobileMenuButton = styled.button`
    background-color: transparent;
    border: none;
    padding: 0 24px;
    cursor: pointer;
    border-left: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: auto;
    grid-column: 3;
    justify-self: end;
    
    &:focus {
        outline: none;
    }
    
    &:focus-visible {
        outline: 2px dashed ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
        outline-offset: -4px;
    }

    @media (min-width: 1024px) {
        display: none;
    }
`;

export const MobileNavOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 90;
`;

export const MobileNavPanel = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    max-width: 320px;
    height: 100vh;
    background-color: ${({ theme }) => theme?.backgrounds?.card || (theme?.mode === 'dark' ? '#1E2139' : '#ffffff')};
    z-index: 100;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-out forwards;
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
`;
