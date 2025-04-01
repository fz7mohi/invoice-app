import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../App/context';
import { motion } from 'framer-motion';
import { receiptsLengthMessage } from '../../utilities/helpers';
import { receiptsViewVariants } from '../../utilities/framerVariants';
import Header from './Header/Header';
import List from './List/List';
import styled from 'styled-components';

const StyledReceipts = styled(motion.div)`
    width: 100%;
    max-width: 1020px;
    margin: 0 auto;
    padding: 32px 24px;

    @media (min-width: 768px) {
        padding: 56px 48px;
    }

    @media (min-width: 1024px) {
        padding: 72px 48px;
        max-width: 1100px;
    }
`;

const Receipts = () => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [rawReceipts, setRawReceipts] = useState([]);

    // Filter receipts based on status and search query
    const filteredReceipts = useMemo(() => {
        let filtered = rawReceipts.filter(receipt => {
            const matchesStatus = filterType === 'all' || receipt.status === filterType;
            const matchesSearch = !searchQuery || searchableFields.some(field => {
                const value = receipt[field]?.toString().toLowerCase() || '';
                return value.includes(searchQuery.toLowerCase());
            });
            return matchesStatus && matchesSearch;
        });

        // Apply search filter if there's a search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(receipt => {
                const searchableFields = [
                    receipt.customId || receipt.id,    // Receipt ID
                    receipt.clientName,                // Client Name
                    receipt.description                // Project Description
                ].filter(Boolean);
                
                return searchableFields.some(field => 
                    field.toLowerCase().includes(query)
                );
            });
        }

        return filtered;
    }, [rawReceipts, filterType, searchQuery]);

    // Update document title based on filter
    useEffect(() => {
        const message = receiptsLengthMessage(
            filteredReceipts.length,
            filterType,
            windowWidth
        );
        document.title = `Invoice App | ${message}`;
    }, [filteredReceipts.length, filterType, windowWidth]);

    return (
        <StyledReceipts
            variants={receiptsViewVariants.container}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Header
                receiptsLength={filteredReceipts.length}
                filterType={filterType}
                setFilterType={setFilterType}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <List
                receipts={filteredReceipts}
                isLoading={false}
                variant={receiptsViewVariants}
            />
        </StyledReceipts>
    );
};

export default Receipts; 