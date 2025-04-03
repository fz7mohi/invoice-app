import styled from 'styled-components';

export const TabBarContainer = styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: ${({ theme }) => theme.colors.cardBg};
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
    z-index: 100;
    display: none;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    will-change: transform;
    transform: translateZ(0);
    
    @media (max-width: 1024px) {
        display: block;
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
        
        &:active {
            transform: scale(0.95);
        }
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: ${({ $isActive }) => ($isActive ? '24px' : '0')};
        height: 3px;
        background-color: ${({ theme }) => theme.colors.purple};
        border-radius: 3px;
        transform: translateX(-50%);
        transition: width 0.2s ease;
        opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    }
`;

export const TabIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
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
`;

export const TabLabel = styled.span`
    font-size: 10px;
    font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
    color: ${({ theme, $isActive }) => 
        $isActive ? theme.colors.purple : theme.colors.textTertiary};
    transition: color 0.2s ease, font-weight 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    text-align: center;
`; 