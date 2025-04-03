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
    SearchIcon,
    ErrorMessage
} from './DashboardStyles';
import useDashboardStats from '../../hooks/useDashboardStats';
import useClientsData from '../../hooks/useClientsData';
import useRecentActivity from '../../hooks/useRecentActivity';
import LoadingSpinner from '../shared/LoadingSpinner/LoadingSpinner';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
    const { colors } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 5;
    const history = useHistory();

    // Fetch dashboard statistics
    const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
    
    // Fetch clients data with pagination and search
    const { 
        clients, 
        loading: clientsLoading, 
        error: clientsError,
        totalClients
    } = useClientsData(searchQuery, currentPage, itemsPerPage);
    
    // Fetch recent activity
    const { activities, loading: activitiesLoading, error: activitiesError } = useRecentActivity(4);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalClients / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'QAR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const handleClientClick = (clientId) => {
        history.push(`/client-statement/${clientId}`);
    };

    // Prepare stats data for display
    const statsData = [
        {
            label: 'Total Invoices',
            value: stats.totalInvoices.toLocaleString(),
            icon: 'invoice',
            color: colors.blueGrayish
        },
        {
            label: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            icon: 'statement',
            color: colors.statusPaid
        },
        {
            label: 'Pending Amount',
            value: formatCurrency(stats.pendingAmount),
            icon: 'calendar',
            color: colors.statusDraft
        },
        {
            label: 'Pending Payments',
            value: stats.pendingPayments.toLocaleString(),
            icon: 'menu',
            color: colors.statusPending
        },
        {
            label: 'Active Clients',
            value: stats.activeClients.toLocaleString(),
            icon: 'clients',
            color: colors.blueGrayish
        },
        {
            label: 'Total Quotes',
            value: stats.totalQuotes.toLocaleString(),
            icon: 'quotation',
            color: colors.blueGrayish
        },
        {
            label: 'Total Delivery Orders',
            value: stats.totalDeliveryOrders.toLocaleString(),
            icon: 'delivery',
            color: colors.statusPending
        },
        {
            label: 'Total Receipts',
            value: stats.totalReceipts.toLocaleString(),
            icon: 'receipt',
            color: colors.statusPaid
        }
    ];

    return (
        <Container>
            <Header>
                <Title>Dashboard</Title>
            </Header>

            {statsError ? (
                <ErrorMessage>Error loading statistics: {statsError}</ErrorMessage>
            ) : (
                <StatsGrid>
                    {statsLoading ? (
                        <LoadingSpinner text="Loading statistics..." />
                    ) : (
                        statsData.map((stat, index) => (
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
                        ))
                    )}
                </StatsGrid>
            )}

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

                {clientsError ? (
                    <ErrorMessage>Error loading clients: {clientsError}</ErrorMessage>
                ) : (
                    <>
                        <ClientsList>
                            {clientsLoading ? (
                                <LoadingSpinner text="Loading clients..." />
                            ) : clients.length > 0 ? (
                                clients.map((client, index) => (
                                    <ClientItem
                                        key={client.id}
                                        as={motion.div}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        onClick={() => handleClientClick(client.id)}
                                        style={{ cursor: 'pointer' }}
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
                                                <ClientStatValue>{formatCurrency(parseFloat(client.totalAmount))}</ClientStatValue>
                                                <ClientStatLabel>Total Amount</ClientStatLabel>
                                            </StatItem>
                                            <StatItem>
                                                <ClientStatValue>{client.lastInvoice}</ClientStatValue>
                                                <ClientStatLabel>Last Invoice</ClientStatLabel>
                                            </StatItem>
                                        </ClientStats>
                                    </ClientItem>
                                ))
                            ) : (
                                <EmptyState>
                                    <EmptyIcon>
                                        <Icon name="clients" size={48} color={colors.textTertiary} />
                                    </EmptyIcon>
                                    <EmptyText>No clients found</EmptyText>
                                </EmptyState>
                            )}
                        </ClientsList>

                        {!clientsLoading && clients.length > 0 && (
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
                        )}
                    </>
                )}
            </ClientsStatement>

            <RecentActivity>
                <Title>Recent Activity</Title>
                {activitiesError ? (
                    <ErrorMessage>Error loading activity: {activitiesError}</ErrorMessage>
                ) : activitiesLoading ? (
                    <LoadingSpinner text="Loading recent activity..." />
                ) : activities.length > 0 ? (
                    <ActivityList>
                        {activities.map((activity, index) => (
                            <ActivityItem
                                key={activity.id}
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