import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import { 
    TabBarContainer, 
    TabList, 
    TabItem, 
    TabIcon, 
    TabLabel 
} from './MobileTabBarStyles';

// Memoized tab item component for better performance
const TabItemComponent = React.memo(({ item, isActive }) => {
    const { colors } = useTheme();
    
    return (
        <TabItem $isActive={isActive}>
            <Link to={item.path} aria-label={item.name}>
                <TabIcon $isActive={isActive}>
                    <Icon 
                        name={item.icon} 
                        size={24} 
                        color={isActive ? colors.accent : colors.textTertiary}
                    />
                </TabIcon>
                <TabLabel $isActive={isActive}>{item.name}</TabLabel>
            </Link>
        </TabItem>
    );
});

const MobileTabBar = () => {
    const location = useLocation();
    
    // Memoize tab items to prevent unnecessary re-renders
    const tabItems = useMemo(() => [
        { name: 'Dashboard', icon: 'menu', path: '/dashboard' },
        { name: 'Clients', icon: 'clients', path: '/clients' },
        { name: 'Quotations', icon: 'quotation', path: '/quotations' },
        { name: 'Invoices', icon: 'invoice', path: '/invoices' }
    ], []);

    // Check if a path is active
    const isPathActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') {
            return true;
        }
        
        if (path === '/clients' && location.pathname === '/clients') {
            return true;
        }
        
        if (path === '/quotations' && 
            (location.pathname === '/quotations' || location.pathname.includes('/quotation/'))) {
            return true;
        }
        
        if (path === '/invoices' && 
            (location.pathname === '/invoices' || location.pathname.includes('/invoice/'))) {
            return true;
        }
        
        return false;
    };

    return (
        <TabBarContainer>
            <TabList>
                {tabItems.map((item) => (
                    <TabItemComponent 
                        key={item.name} 
                        item={item} 
                        isActive={isPathActive(item.path)} 
                    />
                ))}
            </TabList>
        </TabBarContainer>
    );
};

export default React.memo(MobileTabBar); 