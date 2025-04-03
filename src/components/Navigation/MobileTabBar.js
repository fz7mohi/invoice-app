import React from 'react';
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

const MobileTabBar = () => {
    const { colors } = useTheme();
    const location = useLocation();
    
    const tabItems = [
        { name: 'Dashboard', icon: 'menu', path: '/dashboard' },
        { name: 'Clients', icon: 'clients', path: '/clients' },
        { name: 'Quotations', icon: 'quotation', path: '/quotations' },
        { name: 'Invoices', icon: 'invoice', path: '/invoices' }
    ];

    return (
        <TabBarContainer>
            <TabList>
                {tabItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                        (item.path === '/invoices' && location.pathname.includes('/invoice/')) ||
                        (item.path === '/quotations' && location.pathname.includes('/quotation/'));
                    
                    return (
                        <TabItem key={item.name} $isActive={isActive}>
                            <Link to={item.path} aria-label={item.name}>
                                <TabIcon $isActive={isActive}>
                                    <Icon 
                                        name={item.icon} 
                                        size={22} 
                                        color={isActive ? colors.purple : colors.btnTheme}
                                    />
                                </TabIcon>
                                <TabLabel $isActive={isActive}>{item.name}</TabLabel>
                            </Link>
                        </TabItem>
                    );
                })}
            </TabList>
        </TabBarContainer>
    );
};

export default MobileTabBar; 