import { useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Filter from './Filter/Filter';
import List from './List/List';
import Button from '../shared/Button/Button';
import Icon from '../shared/Icon/Icon';
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
    const shouldReduceMotion = useReducedMotion();
    const { windowWidth, invoiceState, createInvoice } = useGlobalContext();
    
    const isLoading = invoiceState?.isLoading || false;
    const rawInvoices = invoiceState?.invoices || [];
    const isDesktop = windowWidth >= 768;

    // Define searchable fields
    const searchableFields = ['customId', 'id', 'clientName', 'description'];

    // Filter invoices based on status and search query
    const filteredInvoices = useMemo(() => {
        let filtered = rawInvoices.filter(invoice => {
            const matchesStatus = filterType === 'all' || invoice.status === filterType;
            const matchesSearch = !searchQuery || searchableFields.some(field => {
                const value = invoice[field]?.toString().toLowerCase() || '';
                return value.includes(searchQuery.toLowerCase());
            });
            return matchesStatus && matchesSearch;
        });

        // Apply search filter if there's a search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(invoice => {
                const searchableFields = [
                    invoice.customId || invoice.id, // Invoice ID
                    invoice.clientName,              // Client Name
                    invoice.description              // Project Description
                ].filter(Boolean);
                
                return searchableFields.some(field => 
                    field.toLowerCase().includes(query)
                );
            });
        }

        return filtered;
    }, [rawInvoices, filterType, searchQuery]);

    // Update document title based on filter
    useEffect(() => {
        const message = invoicesLengthMessage(
            filteredInvoices.length,
            filterType,
            windowWidth
        );
        document.title = `Fordox App | ${message}`;
    }, [filteredInvoices.length, filterType, windowWidth]);

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
                            {isLoading 
                                ? "Loading invoices..."
                                : invoicesLengthMessage(
                                    filteredInvoices,
                                    filterType,
                                    windowWidth
                                )
                            }
                        </Text>
                    </Info>
                    
                    <Filter 
                        filterType={filterType} 
                        setFilterType={setFilterType} 
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

export default Invoices;
