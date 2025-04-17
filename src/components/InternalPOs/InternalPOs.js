import { useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Filter from './Filter/Filter';
import List from './List/List';
import Button from '../shared/Button/Button';
import Icon from '../shared/Icon/Icon';
import internalPOLengthMessage from '../../utilities/internalPOLengthMessage';
import { internalPOVariants } from '../../utilities/framerVariants';
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
} from './InternalPOsStyles';

const InternalPOs = () => {
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const shouldReduceMotion = useReducedMotion();
    const { windowWidth, internalPOState, createInternalPO } = useGlobalContext();
    
    const isLoading = internalPOState?.isLoading || false;
    const rawInternalPOs = internalPOState?.internalPOs || [];
    const isDesktop = windowWidth >= 768;

    // Define searchable fields
    const searchableFields = ['customId', 'id', 'clientName', 'description'];

    // Filter internal POs based on status and search query
    const filteredInternalPOs = useMemo(() => {
        let filtered = rawInternalPOs.filter(internalPO => {
            const matchesStatus = filterType === 'all' || internalPO.status === filterType;
            const matchesSearch = !searchQuery || searchableFields.some(field => {
                const value = internalPO[field]?.toString().toLowerCase() || '';
                return value.includes(searchQuery.toLowerCase());
            });
            return matchesStatus && matchesSearch;
        });

        // Apply search filter if there's a search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(internalPO => {
                const searchableFields = [
                    internalPO.customId || internalPO.id, // Internal PO ID
                    internalPO.clientName,              // Client Name
                    internalPO.description              // Project Description
                ].filter(Boolean);
                
                return searchableFields.some(field => 
                    field.toLowerCase().includes(query)
                );
            });
        }

        return filtered;
    }, [rawInternalPOs, filterType, searchQuery]);

    // Update document title based on filter
    useEffect(() => {
        const message = internalPOLengthMessage(
            filteredInternalPOs.length,
            filterType,
            windowWidth
        );
        document.title = `Fordox App | ${message}`;
    }, [filteredInternalPOs.length, filterType, windowWidth]);

    // Define variant based on element type and reduced motion preference
    const variant = (type, index) => {
        if (shouldReduceMotion) return internalPOVariants.reduced;
        
        if (type === 'container') return internalPOVariants.container;
        if (type === 'header') return internalPOVariants.header;
        if (type === 'list') return internalPOVariants.list(index);
        if (type === 'error') return internalPOVariants.errorMessage;
        
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
                        <Title>Internal POs</Title>
                        <Text>
                            {isLoading 
                                ? "Loading internal POs..."
                                : internalPOLengthMessage(
                                    filteredInternalPOs,
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
                            placeholder="Search by Internal PO ID, Client Name, or Project Description"
                            value={searchQuery}
                            onChange={handleSearch}
                            aria-label="Search internal POs by ID, client name, or project description"
                        />
                    </SearchContainer>
                </SearchBar>
            </Header>

            <List 
                isLoading={isLoading}
                internalPOs={filteredInternalPOs} 
                variant={variant}
            />
        </Container>
    );
};

export default InternalPOs; 