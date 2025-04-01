import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../App/context';
import { receiptsLengthMessage } from '../../../utilities/helpers';
import Button from '../../shared/Button/Button';
import Icon from '../../shared/Icon/Icon';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const StyledHeader = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 32px;
    }
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    h1 {
        color: ${({ theme }) => theme.colors.textPrimary};
        font-size: 24px;
        line-height: 1.25;
        letter-spacing: -0.75px;

        @media (min-width: 768px) {
            font-size: 32px;
            letter-spacing: -1px;
        }
    }

    p {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 13px;
        line-height: 1.5;
    }
`;

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        gap: 24px;
    }
`;

const SearchWrapper = styled.div`
    position: relative;
    width: 100%;

    @media (min-width: 768px) {
        width: 240px;
    }
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 12px 16px 12px 40px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 13px;
    line-height: 1.5;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purple}20;
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

const SearchIcon = styled(Icon)`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
`;

const FilterWrapper = styled.div`
    position: relative;
`;

const FilterButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 13px;
    font-weight: 700;
    line-height: 1.5;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purple}20;
    }
`;

const FilterList = styled(motion.div)`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 200px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow: hidden;
`;

const FilterItem = styled.button`
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 13px;
    font-weight: 700;
    line-height: 1.5;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundItemHover};
    }

    &:focus {
        outline: none;
        background-color: ${({ theme }) => theme.colors.backgroundItemHover};
    }

    ${({ $active }) =>
        $active &&
        `
        color: ${({ theme }) => theme.colors.purple};
    `}
`;

const Header = ({ receiptsLength, filterType, setFilterType, searchQuery, setSearchQuery }) => {
    const theme = useTheme();
    const { windowWidth } = useGlobalContext();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filterOptions = [
        { value: 'all', label: 'All Receipts' },
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
    ];

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
        <StyledHeader
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Info>
                <h1>Receipts</h1>
                <p>{receiptsLengthMessage(receiptsLength, filterType, windowWidth)}</p>
            </Info>

            <Controls>
                <SearchWrapper>
                    <SearchIcon name="search" size={16} />
                    <SearchInput
                        type="text"
                        placeholder="Search receipts..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </SearchWrapper>

                <FilterWrapper>
                    <FilterButton onClick={handleFilterClick}>
                        <Icon name="filter" size={16} />
                        {filterOptions.find((option) => option.value === filterType)?.label}
                    </FilterButton>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <FilterList
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {filterOptions.map((option) => (
                                    <FilterItem
                                        key={option.value}
                                        $active={filterType === option.value}
                                        onClick={() => handleFilterSelect(option.value)}
                                    >
                                        {option.label}
                                    </FilterItem>
                                ))}
                            </FilterList>
                        )}
                    </AnimatePresence>
                </FilterWrapper>

                <Button
                    type="primary"
                    icon="plus"
                    text={windowWidth >= 768 ? 'New Receipt' : 'New'}
                    onClick={() => {/* TODO: Implement new receipt creation */}}
                />
            </Controls>
        </StyledHeader>
    );
};

export default Header; 