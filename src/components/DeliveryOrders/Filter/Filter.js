import styled from 'styled-components';
import { motion } from 'framer-motion';

const Filter = ({ filterType, setFilterType }) => {
    const filters = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <Container>
            {filters.map((filter) => (
                <FilterButton
                    key={filter.value}
                    $active={filterType === filter.value}
                    onClick={() => setFilterType(filter.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {filter.label}
                </FilterButton>
            ))}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--background-secondary)'};
    color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--primary-color);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--primary-color-light);
    }
`;

export default Filter; 