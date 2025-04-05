import styled from 'styled-components';

export const TabBarContainer = styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background-color: ${({ theme }) => theme.colors.cardBg};
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
    z-index: 1000;
    display: none;
    background: aliceblue;
    border-top: 1px solid ${({ theme }) => theme.colors.accent};
    will-change: transform;
    transform: translateZ(0);
    padding-bottom: env(safe-area-inset-bottom, 0);
    
    @media (max-width: 1024px) {
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }

    @media (max-width: 480px) {
        height: 72px;
    }
`;

export const TabList = styled.ul`
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
`;

export const TabItem = styled.li`
    flex: 1;
    height: 100%;
    position: relative;
    
    a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-decoration: none;
        position: relative;
        transition: all 0.2s ease;
        padding: 10px 0;
        min-height: 48px; /* Increased minimum touch target size */
        
        &:active {
            transform: scale(0.95);
        }
    }
    
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        width: ${({ $isActive }) => ($isActive ? '36px' : '0')};
        height: 3px;
        background-color: ${({ theme }) => theme.colors.accent};
        border-radius: 0 0 3px 3px;
        transform: translateX(-50%);
        transition: width 0.2s ease;
        opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    }
`;

export const TabIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    position: relative;
    transition: transform 0.2s ease;
    
    svg {
        transition: transform 0.2s ease;
    }
    
    ${({ $isActive }) => $isActive && `
        transform: translateY(-2px);
        
        svg {
            transform: scale(1.1);
        }
    `}

    @media (max-width: 480px) {
        margin-bottom: 8px;
    }
`;

export const TabLabel = styled.span`
    font-size: 12px;
    font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
    color: ${({ theme, $isActive }) => 
        $isActive ? theme.colors.accent : theme.colors.textTertiary};
    transition: color 0.2s ease, font-weight 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    text-align: center;

    @media (max-width: 480px) {
        font-size: 11px;
    }
`; 