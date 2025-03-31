import { BiHomeAlt, BiFile, BiUser, BiListOl, BiCog } from 'react-icons/bi';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/logo.svg';

const Sidebar = () => {
    return (
        <StyledSidebar>
            <LogoContainer>
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
            </LogoContainer>
            <Menu>
                <MenuItem
                    exact
                    to="/"
                    activeStyle={{ color: '#7c5dfa' }}
                    title="Home"
                >
                    <BiHomeAlt />
                </MenuItem>
                <MenuItem
                    to="/invoices"
                    activeStyle={{ color: '#7c5dfa' }}
                    title="Invoices"
                >
                    <BiFile />
                </MenuItem>
                <MenuItem
                    to="/quotations"
                    activeStyle={{ color: '#7c5dfa' }}
                    title="Quotations"
                >
                    <BiListOl />
                </MenuItem>
                <MenuItem
                    to="/clients"
                    activeStyle={{ color: '#7c5dfa' }}
                    title="Clients"
                >
                    <BiUser />
                </MenuItem>
                <MenuItem
                    to="/settings"
                    activeStyle={{ color: '#7c5dfa' }}
                    title="Settings"
                >
                    <BiCog />
                </MenuItem>
            </Menu>
        </StyledSidebar>
    );
};

// Styled components
const StyledSidebar = styled.aside`
    position: fixed;
    top: 0;
    left: 0;
    width: 80px;
    height: 100vh;
    background-color: ${props => props.theme?.sidebarBackground || '#373B53'};
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    
    @media (max-width: 768px) {
        width: 100%;
        height: 80px;
        flex-direction: row;
        justify-content: space-between;
    }
`;

const LogoContainer = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme?.colors?.purple || '#7c5dfa'};
    
    img {
        width: 40px;
        height: 40px;
    }
    
    @media (max-width: 768px) {
        width: 80px;
        height: 100%;
    }
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    padding: 20px 0;
    
    @media (max-width: 768px) {
        flex-direction: row;
        padding: 0 20px;
    }
`;

const MenuItem = styled(NavLink)`
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme?.text?.secondary || '#888eb0'};
    font-size: 20px;
    transition: color 0.2s ease;
    
    &:hover {
        color: ${props => props.theme?.colors?.purple || '#7c5dfa'};
    }
    
    @media (max-width: 768px) {
        width: auto;
        margin-left: 24px;
    }
`;

export default Sidebar; 