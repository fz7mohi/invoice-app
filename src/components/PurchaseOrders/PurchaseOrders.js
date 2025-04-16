import { useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Filter from './Filter/Filter';
import List from './List/List';
import Button from '../shared/Button/Button';
import Icon from '../shared/Icon/Icon';
import purchaseOrdersLengthMessage from '../../utilities/purchaseOrdersLengthMessage';
import { purchaseOrdersVariants } from '../../utilities/framerVariants';
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
} from './PurchaseOrdersStyles';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const PurchaseOrders = () => {
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const shouldReduceMotion = useReducedMotion();
    const { windowWidth, purchaseOrderState, createPurchaseOrder } = useGlobalContext();
    
    const isLoading = purchaseOrderState?.isLoading || false;
    const rawPurchaseOrders = purchaseOrderState?.purchaseOrders || [];
    const isDesktop = windowWidth >= 768;

    // Define searchable fields
    const searchableFields = ['customId', 'id', 'supplierName', 'description'];

    // Filter purchase orders based on status
    const filteredByStatus = useMemo(() => {
        if (filterType === 'all') return rawPurchaseOrders;
        return rawPurchaseOrders.filter(order => order.status === filterType);
    }, [rawPurchaseOrders, filterType]);

    // Filter purchase orders based on search query
    const filteredPurchaseOrders = useMemo(() => {
        if (!searchQuery) return filteredByStatus;
        
        const query = searchQuery.toLowerCase();
        return filteredByStatus.filter(order => 
            searchableFields.some(field => 
                String(order[field] || '').toLowerCase().includes(query)
            )
        );
    }, [filteredByStatus, searchQuery]);

    // Handle search input changes
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Get animation variant based on reduced motion preference
    const variant = useMemo(() => 
        purchaseOrdersVariants(shouldReduceMotion), 
        [shouldReduceMotion]
    );

    return (
        <Container>
            <Header
                variants={variant.header}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <HeaderTop>
                    <Info>
                        <Title>Purchase Orders</Title>
                        <Text>
                            {isLoading 
                                ? "Loading purchase orders..."
                                : purchaseOrdersLengthMessage(
                                    filteredPurchaseOrders,
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
                            placeholder="Search by PO ID, Supplier Name, or Description"
                            value={searchQuery}
                            onChange={handleSearch}
                            aria-label="Search purchase orders by ID, supplier name, or description"
                        />
                    </SearchContainer>
                </SearchBar>
            </Header>

            <List 
                isLoading={isLoading}
                purchaseOrders={filteredPurchaseOrders} 
                variant={variant}
            />
        </Container>
    );
};

export default PurchaseOrders; 