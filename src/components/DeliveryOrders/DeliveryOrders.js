import { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../App/context';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../shared/Button/Button';
import Icon from '../shared/Icon/Icon';
import { receiptsViewVariants } from '../../utilities/framerVariants';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import List from './List/List';
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
    SearchIcon,
    StyledFilter,
    FilterButton,
    FilterList,
    FilterItem,
    StatusFilter
} from './DeliveryOrdersStyles';

const DeliveryOrders = () => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [rawDeliveryOrders, setRawDeliveryOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const filterRef = useRef(null);

    // Fetch delivery orders from Firebase
    useEffect(() => {
        const fetchDeliveryOrders = async () => {
            try {
                setIsLoading(true);
                const deliveryOrdersCollection = collection(db, 'deliveryOrders');
                const deliveryOrdersQuery = query(
                    deliveryOrdersCollection,
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(deliveryOrdersQuery);
                
                const deliveryOrdersList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate() || new Date();
                    
                    return {
                        id: doc.id,
                        ...data,
                        createdAt
                    };
                });
                
                setRawDeliveryOrders(deliveryOrdersList);
            } catch (error) {
                console.error('Error fetching delivery orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveryOrders();
    }, []);

    // Filter delivery orders based on status and search query
    const filteredDeliveryOrders = useMemo(() => {
        let filtered = rawDeliveryOrders.filter(order => {
            const matchesStatus = filterType === 'all' || order.status === filterType;
            const matchesSearch = !searchQuery || [
                order.customId || order.id,
                order.clientName,
                order.description
            ].some(field => {
                const value = field?.toString().toLowerCase() || '';
                return value.includes(searchQuery.toLowerCase());
            });
            return matchesStatus && matchesSearch;
        });

        return filtered;
    }, [rawDeliveryOrders, filterType, searchQuery]);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const checkIfClickedOutside = (event) => {
            if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', checkIfClickedOutside);
        return () => document.removeEventListener('mousedown', checkIfClickedOutside);
    }, [isFilterOpen]);

    const handleFilterClick = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterSelect = (value) => {
        setFilterType(value);
        setIsFilterOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Container
            variants={receiptsViewVariants.container}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Header>
                <HeaderTop>
                    <Info>
                        <Title>Delivery Orders</Title>
                        <Text>
                            {isLoading 
                                ? "Loading delivery orders..."
                                : windowWidth >= 768 
                                    ? `There ${filteredDeliveryOrders.length === 1 ? 'is' : 'are'} ${filteredDeliveryOrders.length} ${filterType === 'all' ? '' : filterType + ' '}delivery order${filteredDeliveryOrders.length !== 1 ? 's' : ''}`
                                    : `${filteredDeliveryOrders.length} ${filterType === 'all' ? '' : filterType + ' '}delivery order${filteredDeliveryOrders.length !== 1 ? 's' : ''}`
                            }
                        </Text>
                    </Info>

                    <StyledFilter ref={filterRef}>
                        <FilterButton onClick={handleFilterClick}>
                            Filter by status
                            <Icon name="chevron-down" size={16} />
                        </FilterButton>
                        <AnimatePresence>
                            {isFilterOpen && (
                                <FilterList
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FilterItem>
                                        <StatusFilter
                                            $isActive={filterType === 'all'}
                                            onClick={() => handleFilterSelect('all')}
                                        >
                                            All
                                        </StatusFilter>
                                    </FilterItem>
                                    <FilterItem>
                                        <StatusFilter
                                            $isActive={filterType === 'pending'}
                                            onClick={() => handleFilterSelect('pending')}
                                        >
                                            Pending
                                        </StatusFilter>
                                    </FilterItem>
                                    <FilterItem>
                                        <StatusFilter
                                            $isActive={filterType === 'completed'}
                                            onClick={() => handleFilterSelect('completed')}
                                        >
                                            Completed
                                        </StatusFilter>
                                    </FilterItem>
                                </FilterList>
                            )}
                        </AnimatePresence>
                    </StyledFilter>

                    <Button
                        type="button"
                        $primary
                        onClick={() => {/* TODO: Implement create delivery order */}}
                    >
                        New {windowWidth >= 768 && 'Delivery Order'}
                    </Button>
                </HeaderTop>

                <SearchBar>
                    <SearchContainer>
                        <SearchIcon>
                            <Icon name="search" size={16} />
                        </SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Search by Order ID, Client Name, or Description"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            aria-label="Search delivery orders by ID, client name, or description"
                        />
                    </SearchContainer>
                </SearchBar>
            </Header>

            <List 
                deliveryOrders={filteredDeliveryOrders}
                isLoading={isLoading}
            />
        </Container>
    );
};

export default DeliveryOrders; 