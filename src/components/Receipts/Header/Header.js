import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../App/context';
import { receiptsLengthMessage } from '../../../utilities/helpers';
import Button from '../../shared/Button/Button';
import Icon from '../../shared/Icon/Icon';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { headingTitle } from '../../../utilities/typographyStyles';
import checkIcon from '../../../assets/images/icon-check.svg';

const StyledHeader = styled(motion.header)`
    margin-bottom: 32px;
`;

const HeaderTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        margin-bottom: 32px;
    }
`;

const Info = styled.div``;

const Title = styled.h1`
    ${headingTitle}
    margin-bottom: 4px;
`;

const Text = styled.p`
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 12px;
    line-height: 15px;
    letter-spacing: -0.25px;

    @media (min-width: 768px) {
        font-size: 14px;
        line-height: 18px;
    }
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: #252945;
    border-radius: 8px;
    border: 1px solid #252945;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
        padding: 16px 32px;
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 400px;
`;

const SearchInput = styled.input`
    background: none;
    border: none;
    color: #FFFFFF;
    font-size: 14px;
    width: 100%;
    padding: 0;
    margin: 0;
    outline: none;

    &::placeholder {
        color: #888EB0;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        -webkit-text-fill-color: #FFFFFF;
        -webkit-box-shadow: 0 0 0px 1000px #252945 inset;
        transition: background-color 5000s ease-in-out 0s;
    }
`;

const SearchIcon = styled.span`
    color: #888EB0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    ${SearchContainer}:focus-within & {
        color: #7C5DFA;
    }
`;

const StyledFilter = styled.div`
    position: relative;
    margin-right: 16px;

    @media (min-width: 768px) {
        margin-right: 24px;
    }
`;

const FilterButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    border-radius: 24px;
    color: ${({ theme }) => theme.colors.white};
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.purple};
    }

    @media (min-width: 768px) {
        padding: 8px 24px;
    }
`;

const FilterList = styled(motion.ul)`
    display: flex;
    position: absolute;
    flex-flow: column;
    gap: 16px;
    top: calc(100% + 8px);
    left: 50%;
    width: clamp(134px, 19vw, 192px);
    padding: 24px;
    background-color: #1E2139;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    transform: translateX(-50%);
    transition: all 0.3s ease;
    z-index: 10;
    border: 1px solid ${({ theme }) => theme.colors.purple};
`;

const FilterItem = styled.li``;

const StatusFilter = styled.button`
    position: relative;
    padding: 0 0 0 29px;
    width: 100%;
    text-align: left;
    color: #FFFFFF !important;
    transition: all 0.3s ease;
    background-color: #1E2139;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: -0.25px;

    &::before {
        position: absolute;
        content: '';
        top: -2px;
        left: 0;
        width: 16px;
        height: 16px;
        background-color: #1E2139;
        border: 1px solid ${({ theme }) => theme.colors.purple};
        border-radius: 2px;
        transition: all 0.3s ease;

        ${({ $isActive }) =>
            $isActive &&
            css`
                background-color: ${({ theme }) => theme.colors.purple};
                background-image: url('${checkIcon}');
                background-repeat: no-repeat;
                background-size: 10px;
                background-position: center;
                border-color: ${({ theme }) => theme.colors.purple};
            `}
    }

    &:hover {
        color: ${({ theme }) => theme.colors.purple} !important;
        background-color: #252945;
        
        &::before {
            border-color: ${({ theme }) => theme.colors.purple};
        }
    }

    @media (min-width: 768px) {
        font-size: 14px;
        line-height: 18px;
    }
`;

const Header = ({ receiptsLength, filterType, setFilterType, searchQuery, setSearchQuery }) => {
    const theme = useTheme();
    const { windowWidth } = useGlobalContext();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const ref = useRef();

    const filterOptions = [
        { value: 'all', label: 'All Receipts' },
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
    ];

    useEffect(() => {
        const checkIfClickedOutside = (event) => {
            const target = event.target.nodeName;
            if (target !== 'BUTTON' && target !== 'UL') {
                setIsFilterOpen(false);
            }
        };

        isFilterOpen && document.addEventListener('click', checkIfClickedOutside);

        return () => {
            document.removeEventListener('click', checkIfClickedOutside);
        };
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
        <StyledHeader
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <HeaderTop>
                <Info>
                    <Title>Receipts</Title>
                    <Text>{receiptsLengthMessage(receiptsLength, filterType, windowWidth)}</Text>
                </Info>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledFilter>
                        <FilterButton onClick={handleFilterClick}>
                            Filter {windowWidth >= 768 && 'by status'}
                            <Icon
                                name="arrow-down"
                                size={11}
                                color={theme.colors.purple}
                                customStyle={{
                                    transition: 'transform 350ms ease-in-out',
                                    transform: isFilterOpen ? 'rotate(180deg)' : 'none',
                                }}
                            />
                        </FilterButton>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <FilterList
                                    ref={ref}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {filterOptions.map((option) => (
                                        <FilterItem key={option.value}>
                                            <StatusFilter
                                                onClick={() => handleFilterSelect(option.value)}
                                                $isActive={filterType === option.value}
                                            >
                                                {option.label}
                                            </StatusFilter>
                                        </FilterItem>
                                    ))}
                                </FilterList>
                            )}
                        </AnimatePresence>
                    </StyledFilter>

                    <Button
                        type="button"
                        $newInvoice
                        onClick={() => {/* TODO: Implement new receipt creation */}}
                    >
                        New {windowWidth >= 768 && 'Receipt'}
                    </Button>
                </div>
            </HeaderTop>

            <SearchBar>
                <SearchContainer>
                    <SearchIcon>
                        <Icon name="search" size={16} />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder="Search by Receipt ID, Client Name, or Description"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        aria-label="Search receipts by ID, client name, or description"
                    />
                </SearchContainer>
            </SearchBar>
        </StyledHeader>
    );
};

export default Header; 