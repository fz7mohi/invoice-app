import { BiHomeAlt, BiFile, BiUser, BiListOl } from 'react-icons/bi';

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
            </Menu>
        </StyledSidebar>
    );
}; 