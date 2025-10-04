import { useState, useEffect, useMemo, memo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Filter from './Filter/Filter';
import List from './List/List';
import Button from '../shared/Button/Button';
import Icon from '../shared/Icon/Icon';
import LoadingPage from '../shared/LoadingPage/LoadingPage';
import invoicesLengthMessage from '../../utilities/invoicesLengthMessage';
import { invoicesVariants } from '../../utilities/framerVariants';
import { 
    Container, 
    Header, 
    HeaderTop,
    Info, 
    Title, 
    Text,
    SearchBar,
    SearchContainer,
    SearchInput,
    SearchIcon
} from './InvoicesStyles';

const Invoices = () => {
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '', month: '', year: '' });
    const shouldReduceMotion = useReducedMotion();
    const { windowWidth, invoiceState, createInvoice, refreshInvoices } = useGlobalContext();
    
    // Force loading to false if we have invoices data
    const rawInvoices = invoiceState?.invoices || [];
    const hasInvoices = rawInvoices && rawInvoices.length > 0;
    const isLoading = hasInvoices ? false : (invoiceState?.isLoading || false);
    const isDesktop = windowWidth >= 768;

    // Load invoices if we don't have any data yet and not already loading
    useEffect(() => {
        if ((!rawInvoices || rawInvoices.length === 0) && !isLoading) {
            refreshInvoices();
        }
    }, [rawInvoices, isLoading, refreshInvoices]);

    // Define searchable fields
    const searchableFields = ['customId', 'id', 'clientName', 'description'];

    // Check if date filter is active
    const isDateFilterActive = dateFilter.startDate && dateFilter.endDate;

    // Filter invoices based on status, search query, and date filter
    const filteredInvoices = useMemo(() => {
        let filtered = rawInvoices.filter(invoice => {
            // Status filter
            const matchesStatus = filterType === 'all' || invoice.status === filterType;
            
            // Search filter
            const matchesSearch = !searchQuery || searchableFields.some(field => {
                const value = invoice[field]?.toString().toLowerCase() || '';
                return value.includes(searchQuery.toLowerCase());
            });

            // Date filter
            let matchesDate = true;
            if (dateFilter.startDate && dateFilter.endDate) {
                const invoiceDate = new Date(invoice.createdAt || invoice.date);
                const startDate = new Date(dateFilter.startDate);
                const endDate = new Date(dateFilter.endDate);
                endDate.setHours(23, 59, 59, 999); // Set to end of day
                
                matchesDate = invoiceDate >= startDate && invoiceDate <= endDate;
            }

            return matchesStatus && matchesSearch && matchesDate;
        });

        return filtered;
    }, [rawInvoices, filterType, searchQuery, dateFilter]);

    // Generate filter message
    const getFilterMessage = () => {
        if (isLoading) return "Loading invoices...";
        
        let message = invoicesLengthMessage(filteredInvoices, filterType, windowWidth);
        
        // Add date filter info if active
        if (isDateFilterActive) {
            const startDate = new Date(dateFilter.startDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
            const endDate = new Date(dateFilter.endDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
            message += ` • Date range: ${startDate} - ${endDate}`;
        }
        
        return message;
    };

    // Update document title based on filter
    useEffect(() => {
        const message = getFilterMessage();
        document.title = `Fordox App | ${message}`;
    }, [filteredInvoices.length, filterType, windowWidth, dateFilter]);

    // Define variant based on element type and reduced motion preference
    const variant = (type, index) => {
        if (shouldReduceMotion) return invoicesVariants.reduced;
        
        if (type === 'container') return invoicesVariants.container;
        if (type === 'header') return invoicesVariants.header;
        if (type === 'list') return invoicesVariants.list(index);
        if (type === 'error') return invoicesVariants.errorMessage;
        
        return {};
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Show loading page while data is being fetched
    if (isLoading && (!rawInvoices || rawInvoices.length === 0)) {
        return (
            <LoadingPage 
                title="Loading Invoices"
                subtitle="Fetching your invoice data from the server"
                showProgress={true}
            />
        );
    }

    return (
        <Container>
            <Header
                variants={variant('header')}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <HeaderTop>
                    <Info>
                        <Title>Invoices</Title>
                        <Text>
                            {getFilterMessage()}
                        </Text>
                    </Info>
                    
                    <Filter 
                        filterType={filterType} 
                        setFilterType={setFilterType}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                    />
                </HeaderTop>

                <SearchBar>
                    <SearchContainer>
                        <SearchIcon>
                            <Icon name="search" size={16} />
                        </SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Search by Invoice ID, Client Name, or Project Description"
                            value={searchQuery}
                            onChange={handleSearch}
                            aria-label="Search invoices by ID, client name, or project description"
                        />
                    </SearchContainer>
                </SearchBar>
            </Header>

            <List 
                isLoading={isLoading}
                invoices={filteredInvoices} 
                variant={variant}
            />
        </Container>
    );
};

export default memo(Invoices);
