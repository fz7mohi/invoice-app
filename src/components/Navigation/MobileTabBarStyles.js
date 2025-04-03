import styled from 'styled-components';

export const TabBarContainer = styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-top: 1px solid ${({ theme }) => `${theme.colors.purple}20`};
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    display: none;
    padding-bottom: env(safe-area-inset-bottom, 0);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    @media (max-width: 767px) {
        display: block;
    }
`;

export const TabList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 60px;
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
        text-decoration: none;
        height: 100%;
        padding: 8px 0;
        transition: all 0.2s ease;
        
        &:active {
            background-color: ${({ theme }) => `${theme.colors.purple}10`};
        }
    }
    
    ${({ $isActive, theme }) => 
        $isActive && `
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 25%;
                width: 50%;
                height: 3px;
                background-color: ${theme.colors.purple};
                border-radius: 3px 3px 0 0;
            }
        `}
`;

export const TabIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    transition: transform 0.2s ease;
    position: relative;
    
    ${({ $isActive }) => 
        $isActive && `
            transform: scale(1.1);
            
            &::after {
                content: '';
                position: absolute;
                top: -2px;
                right: -2px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: ${({ theme }) => theme.colors.purple};
            }
        `}
`;

export const TabLabel = styled.span`
    font-size: 10px;
    font-weight: 500;
    color: ${({ $isActive, theme }) => 
        $isActive ? theme.colors.purple : theme.colors.textTertiary};
    transition: color 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    text-align: center;
`; 