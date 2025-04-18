import React, { useState, useEffect } from 'react';
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
import LoadingSpinner from '../shared/LoadingSpinner/LoadingSpinner';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
    const { colors } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const itemsPerPage = 10;
    const history = useHistory();

    // Fetch dashboard statistics
    const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
    
    // Fetch clients data with pagination and search
    const { 
        clients, 
        loading: clientsLoading, 
        error: clientsError,
        totalClients
    } = useClientsData(debouncedSearchQuery, currentPage, itemsPerPage);
    
    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalClients / itemsPerPage);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setCurrentPage(1); // Reset to first page on new search
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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

            {statsLoading ? (
                <LoadingSpinner />
            ) : statsError ? (
                <ErrorMessage>Error loading dashboard stats: {statsError}</ErrorMessage>
            ) : (
                <StatsGrid>
                    {statsData.map((stat, index) => (
                        <StatCard
                            key={index}
                            as={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <StatIcon>
                                <Icon name={stat.icon} size={24} color={stat.color} />
                            </StatIcon>
                            <StatContent>
                                <StatValue>{stat.value}</StatValue>
                                <StatLabel>{stat.label}</StatLabel>
                            </StatContent>
                        </StatCard>
                    ))}
                </StatsGrid>
            )}

            <ClientsStatement>
                <ClientsHeader>
                    <Title>Clients Statement</Title>
                    <SearchBar>
                        <SearchIcon>
                            <Icon name="search" size={20} color={colors.textTertiary} />
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
                ) : clientsLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <ClientsList>
                            {clients.length > 0 ? (
                                clients.map((client, index) => (
                                    <ClientItem
                                        key={client.id}
                                        as={motion.div}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => handleClientClick(client.id)}
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
                                                <ClientStatValue>{formatCurrency(client.totalAmount)}</ClientStatValue>
                                                <ClientStatLabel>Total</ClientStatLabel>
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
        </Container>
    );
};

export default Dashboard; 