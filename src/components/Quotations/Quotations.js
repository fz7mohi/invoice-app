import { useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Filter from './Filter/Filter';
import List from './List/List';
import Button from '../shared/Button/Button';
import Icon from '../shared/Icon/Icon';
import quotationsLengthMessage from '../../utilities/quotationsLengthMessage';
import { quotationsVariants } from '../../utilities/framerVariants';
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
} from './QuotationsStyles';

const Quotations = () => {
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const shouldReduceMotion = useReducedMotion();
    const { windowWidth, quotationState, createQuotation, refreshQuotations } = useGlobalContext();
    
    const isLoading = quotationState?.isLoading || false;
    const rawQuotations = quotationState?.quotations || [];
    const isDesktop = windowWidth >= 768;

    // Define searchable fields
    const searchableFields = ['customId', 'id', 'clientName', 'description'];

    // Force a refresh of quotations data on component mount, only once
    useEffect(() => {
        // Only refresh if we don't have quotations yet
        if (!rawQuotations || rawQuotations.length === 0) {
            refreshQuotations();
        }
    }, []);

    // Filter quotations based on status and search query
    const filteredQuotations = useMemo(() => {
        let filtered = rawQuotations.filter(quotation => {
            const matchesStatus = filterType === 'all' || quotation.status === filterType;
            const matchesSearch = !searchQuery || searchableFields.some(field => {
                const value = quotation[field]?.toString().toLowerCase() || '';
                return value.includes(searchQuery.toLowerCase());
            });
            return matchesStatus && matchesSearch;
        });

        // Apply search filter if there's a search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(quotation => {
                const searchableFields = [
                    quotation.customId || quotation.id, // Quote ID
                    quotation.clientName,              // Client Name
                    quotation.description              // Project Description
                ].filter(Boolean);
                
                return searchableFields.some(field => 
                    field.toLowerCase().includes(query)
                );
            });
        }

        return filtered;
    }, [rawQuotations, filterType, searchQuery]);

    // Update document title based on filter
    useEffect(() => {
        const message = quotationsLengthMessage(
            filteredQuotations.length,
            filterType,
            windowWidth
        );
        document.title = `Fordox App | ${message}`;
    }, [filteredQuotations.length, filterType, windowWidth]);

    // Define variant based on element type and reduced motion preference
    const variant = (type, index) => {
        if (shouldReduceMotion) return quotationsVariants.reduced;
        
        if (type === 'container') return quotationsVariants.container;
        if (type === 'header') return quotationsVariants.header;
        if (type === 'list') return quotationsVariants.list(index);
        if (type === 'error') return quotationsVariants.errorMessage;
        
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
                        <Title>Quotations</Title>
                        <Text>
                            {isLoading 
                                ? "Loading quotations..."
                                : quotationsLengthMessage(
                                    filteredQuotations,
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
                    
                    <Button 
                        type="button" 
                        $primary 
                        onClick={() => {
                            setTimeout(() => {
                                createQuotation();
                            }, 0);
                        }}
                        disabled={isLoading}
                    >
                        New {isDesktop && 'Quotation'}
                    </Button>
                </HeaderTop>

                <SearchBar>
                    <SearchContainer>
                        <SearchIcon>
                            <Icon name="search" size={16} />
                        </SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Search by Quote ID, Client Name, or Project Description"
                            value={searchQuery}
                            onChange={handleSearch}
                            aria-label="Search quotations by ID, client name, or project description"
                        />
                    </SearchContainer>
                </SearchBar>
            </Header>

            <List 
                key={`quotations-list-${rawQuotations.length}-${isLoading}`}
                isLoading={isLoading}
                quotations={filteredQuotations} 
                variant={variant}
            />
        </Container>
    );
};

export default Quotations; 