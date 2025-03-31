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

    // Force a refresh of quotations data on component mount, only once
    useEffect(() => {
        refreshQuotations();
    }, []);

    // Filter quotations based on status and search query
    const filteredQuotations = useMemo(() => {
        let filtered = rawQuotations.filter(quotation => {
            if (filterType === 'all') return true;
            if (filterType === 'pending') return quotation.status === 'pending';
            if (filterType === 'paid') return quotation.status === 'paid';
            if (filterType === 'draft') return quotation.status === 'draft';
            return true;
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
        document.title = `Invoice App | ${message}`;
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
                                    filteredQuotations.length,
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
                        onClick={createQuotation}
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
                isLoading={isLoading}
                quotations={filteredQuotations} 
                variant={variant}
            />
        </Container>
    );
};

export default Quotations; 