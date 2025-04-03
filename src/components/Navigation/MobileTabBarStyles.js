import styled from 'styled-components';

export const TabBarContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-top: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    display: none;

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
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        width: 100%;
        height: 100%;
        padding: 8px 0;
        transition: all 0.2s ease-in-out;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 3px;
        background-color: ${({ theme }) => theme.colors.purple};
        transition: width 0.2s ease-in-out;
        border-radius: 3px 3px 0 0;
    }
    
    ${({ $isActive }) => 
        $isActive && `
            &::after {
                width: 40%;
            }
        `}
`;

export const TabIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    transition: transform 0.2s ease-in-out;
    
    ${({ $isActive }) => 
        $isActive && `
            transform: translateY(-2px);
        `}
`;

export const TabLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    color: ${({ $isActive, theme }) => 
        $isActive ? theme.colors.purple : theme.colors.textTertiary};
    transition: color 0.2s ease-in-out;
    white-space: nowrap;
`; 