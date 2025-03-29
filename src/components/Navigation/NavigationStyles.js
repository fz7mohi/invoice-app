import styled from 'styled-components';

export const StyledNav = styled.nav`
    margin-top: 16px;
    width: 100%;
    display: ${({ $isMobile }) => ($isMobile ? 'block' : 'none')};

    @media (min-width: 1024px) {
        display: block;
        height: calc(100vh - 103px - 88px);
        overflow-y: auto;
        padding: 16px 0;
    }
`;

export const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
`;

export const NavItem = styled.li`
    margin-bottom: 8px;
    width: 100%;

    a {
        display: flex;
        flex-direction: ${({ $isMobile }) => ($isMobile ? 'row' : 'column')};
        align-items: center;
        justify-content: ${({ $isMobile }) => ($isMobile ? 'flex-start' : 'center')};
        text-decoration: none;
        padding: ${({ $isMobile }) => ($isMobile ? '16px 24px' : '16px 0')};
        width: 100%;
        transition: background-color 0.3s ease;
        
        span {
            font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '10px')};
            font-weight: 600;
            margin-top: ${({ $isMobile }) => ($isMobile ? '0' : '6px')};
            margin-left: ${({ $isMobile }) => ($isMobile ? '16px' : '0')};
            color: ${({ $isActive, theme }) => 
                $isActive ? theme.colors.purple : theme.colors.btnTheme};
            transition: color 0.3s ease;
        }
        
        &:hover {
            background-color: ${({ theme }) => theme.colors.grayLight}10;
            
            span {
                color: ${({ theme }) => theme.colors.purple};
            }
            
            svg {
                color: ${({ theme }) => theme.colors.purple};
            }
        }
    }
    
    ${({ $isActive, theme, $isMobile }) => 
        $isActive && `
            background-color: ${theme.colors.grayLight}20;
            border-${$isMobile ? 'left' : 'left'}: 3px solid ${theme.colors.purple};
            
            a {
                padding-left: ${$isMobile ? '21px' : '0'};
            }
        `}
`; 