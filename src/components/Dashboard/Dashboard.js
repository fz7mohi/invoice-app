import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import { 
    Container,
    Header,
    Title,
    StatsGrid,
    StatCard,
    StatIcon,
    StatContent,
    StatValue,
    StatLabel,
    RecentActivity,
    ActivityList,
    ActivityItem,
    ActivityIcon,
    ActivityContent,
    ActivityTitle,
    ActivityTime,
    EmptyState,
    EmptyIcon,
    EmptyText,
    ClientsStatement,
    ClientsHeader,
    ClientsList,
    ClientItem,
    ClientInfo,
    ClientName,
    ClientEmail,
    ClientStats,
    StatItem,
    StatValue as ClientStatValue,
    StatLabel as ClientStatLabel,
    Pagination,
    PageButton,
    PageInfo,
    SearchBar,
    SearchInput,
    SearchIcon
} from './DashboardStyles';

const Dashboard = () => {
    const { colors } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 5;

    // Mock data - replace with real data from your backend
    const stats = [
        { label: 'Total Invoices', value: '2,543', icon: 'invoice', color: colors.purple },
        { label: 'Pending Payments', value: '12', icon: 'quotation', color: colors.statusPending },
        { label: 'Total Revenue', value: '$45,231', icon: 'receipt', color: colors.statusPaid },
        { label: 'Active Clients', value: '156', icon: 'clients', color: colors.blueGrayish }
    ];

    const recentActivity = [
        { title: 'New Invoice Created', time: '2 minutes ago', icon: 'invoice' },
        { title: 'Payment Received', time: '1 hour ago', icon: 'receipt' },
        { title: 'New Client Added', time: '3 hours ago', icon: 'clients' },
        { title: 'Quotation Sent', time: '5 hours ago', icon: 'quotation' }
    ];

    // Mock clients data - replace with real data from your backend
    const clients = [
        { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', totalInvoices: 45, totalAmount: '$12,450', lastInvoice: '2024-03-15' },
        { id: 2, name: 'TechStart Inc.', email: 'billing@techstart.com', totalInvoices: 32, totalAmount: '$8,750', lastInvoice: '2024-03-14' },
        { id: 3, name: 'Global Industries', email: 'accounts@global.com', totalInvoices: 28, totalAmount: '$15,200', lastInvoice: '2024-03-13' },
        { id: 4, name: 'Digital Solutions', email: 'finance@digitalsol.com', totalInvoices: 15, totalAmount: '$6,800', lastInvoice: '2024-03-12' },
        { id: 5, name: 'Innovation Labs', email: 'billing@inno.com', totalInvoices: 21, totalAmount: '$9,500', lastInvoice: '2024-03-11' },
        { id: 6, name: 'Future Systems', email: 'accounts@future.com', totalInvoices: 38, totalAmount: '$11,300', lastInvoice: '2024-03-10' },
        { id: 7, name: 'Smart Tech', email: 'finance@smart.com', totalInvoices: 25, totalAmount: '$7,900', lastInvoice: '2024-03-09' },
        { id: 8, name: 'Data Corp', email: 'billing@datacorp.com', totalInvoices: 42, totalAmount: '$13,600', lastInvoice: '2024-03-08' },
    ];

    // Filter clients based on search query
    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Container>
            <Header>
                <Title>Dashboard</Title>
            </Header>

            <StatsGrid>
                {stats.map((stat, index) => (
                    <StatCard
                        key={stat.label}
                        as={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <StatIcon style={{ backgroundColor: `${stat.color}15` }}>
                            <Icon name={stat.icon} size={24} color={stat.color} />
                        </StatIcon>
                        <StatContent>
                            <StatValue>{stat.value}</StatValue>
                            <StatLabel>{stat.label}</StatLabel>
                        </StatContent>
                    </StatCard>
                ))}
            </StatsGrid>

            <ClientsStatement>
                <ClientsHeader>
                    <Title>Clients Statement</Title>
                    <SearchBar>
                        <SearchIcon>
                            <Icon name="clients" size={20} color={colors.textTertiary} />
                        </SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchBar>
                </ClientsHeader>

                <ClientsList>
                    {paginatedClients.map((client, index) => (
                        <ClientItem
                            key={client.id}
                            as={motion.div}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <ClientInfo>
                                <ClientName>{client.name}</ClientName>
                                <ClientEmail>{client.email}</ClientEmail>
                            </ClientInfo>
                            <ClientStats>
                                <StatItem>
                                    <ClientStatValue>{client.totalInvoices}</ClientStatValue>
                                    <ClientStatLabel>Invoices</ClientStatLabel>
                                </StatItem>
                                <StatItem>
                                    <ClientStatValue>{client.totalAmount}</ClientStatValue>
                                    <ClientStatLabel>Total Amount</ClientStatLabel>
                                </StatItem>
                                <StatItem>
                                    <ClientStatValue>{client.lastInvoice}</ClientStatValue>
                                    <ClientStatLabel>Last Invoice</ClientStatLabel>
                                </StatItem>
                            </ClientStats>
                        </ClientItem>
                    ))}
                </ClientsList>

                <Pagination>
                    <PageButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </PageButton>
                    <PageInfo>
                        Page {currentPage} of {totalPages}
                    </PageInfo>
                    <PageButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </PageButton>
                </Pagination>
            </ClientsStatement>

            <RecentActivity>
                <Title>Recent Activity</Title>
                {recentActivity.length > 0 ? (
                    <ActivityList>
                        {recentActivity.map((activity, index) => (
                            <ActivityItem
                                key={activity.title}
                                as={motion.div}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <ActivityIcon>
                                    <Icon name={activity.icon} size={20} color={colors.textTertiary} />
                                </ActivityIcon>
                                <ActivityContent>
                                    <ActivityTitle>{activity.title}</ActivityTitle>
                                    <ActivityTime>{activity.time}</ActivityTime>
                                </ActivityContent>
                            </ActivityItem>
                        ))}
                    </ActivityList>
                ) : (
                    <EmptyState>
                        <EmptyIcon>
                            <Icon name="menu" size={48} color={colors.textTertiary} />
                        </EmptyIcon>
                        <EmptyText>No recent activity</EmptyText>
                    </EmptyState>
                )}
            </RecentActivity>
        </Container>
    );
};

export default Dashboard; 