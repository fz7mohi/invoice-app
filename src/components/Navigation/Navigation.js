import { Link, useLocation } from 'react-router-dom';
import Icon from '../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import { StyledNav, NavList, NavItem } from './NavigationStyles';
import { FaHome, FaUsers, FaFileInvoice, FaFileAlt, FaShoppingCart, FaCog } from 'react-icons/fa';

const Navigation = ({ isMobile, onNavigate }) => {
    const { colors } = useTheme();
    const location = useLocation();
    
    const navItems = [
        { name: 'Dashboard', icon: 'menu', path: '/dashboard' },
        { name: 'Clients', icon: 'clients', path: '/clients' },
        { name: 'Quotations', icon: 'quotation', path: '/quotations' },
        { name: 'Invoices', icon: 'invoice', path: '/invoices' },
        { name: 'Receipts', icon: 'receipt', path: '/receipts' },
        { name: 'Delivery Orders', icon: 'delivery', path: '/delivery-orders' },
        { name: 'Settings', icon: 'settings', path: '/settings' },
        { name: 'Purchase Orders', icon: <FaShoppingCart />, path: '/purchase-orders' }
    ];

    const handleNavigate = () => {
        if (isMobile && onNavigate) {
            onNavigate();
        }
    };

    return (
        <StyledNav $isMobile={isMobile}>
            <NavList>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                        (item.path === '/invoices' && location.pathname.includes('/invoice/'));
                    
                    return (
                        <NavItem key={item.path} $isActive={isActive} $isMobile={isMobile}>
                            <Link to={item.path} aria-label={item.name} onClick={handleNavigate}>
                                {typeof item.icon === 'string' ? (
                                    <Icon 
                                        name={item.icon} 
                                        size={isMobile ? 20 : 16} 
                                        color={isActive ? colors.accent : colors.btnTheme}
                                    />
                                ) : (
                                    item.icon
                                )}
                                <span>{item.name}</span>
                            </Link>
                        </NavItem>
                    );
                })}
            </NavList>
        </StyledNav>
    );
};

export default Navigation; 