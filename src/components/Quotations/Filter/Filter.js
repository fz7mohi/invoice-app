import { useState, useEffect, useRef } from 'react';
import Icon from '../../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../App/context';
import { StyledFilter, Button, List, Item, StatusFilter } from './FilterStyles';

const Filter = ({ filterType, setFilterType }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const ref = useRef();

    /* Running an effect whenever isFilterOpen changes and we are binding a click event to the document 
    so that whenever the user clicks on the document, we can check if it is inside or outside the list 
    and hide the list accordingly. */
    useEffect(() => {
        const checkIfClickedOutside = (event) => {
            const target = event.target.nodeName;
            if (target !== 'BUTTON' && target !== 'UL') {
                setIsFilterOpen(false);
            }
        };

        isFilterOpen &&
            document.addEventListener('click', checkIfClickedOutside);

        return () => {
            document.removeEventListener('click', checkIfClickedOutside);
        };
    }, [isFilterOpen]);

    /* Function that toggle filter list. */
    const toggleFilterList = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    /* Function to handle filter changes */
    const handleFilterChange = (type) => {
        setFilterType(type);
        setIsFilterOpen(false);
    };

    return (
        <StyledFilter>
            <Button onClick={toggleFilterList}>
                Filter {isDesktop && 'by status'}
                <Icon
                    name="arrow-down"
                    size={11}
                    color={colors.purple}
                    customStyle={{
                        transition: 'transform 350ms ease-in-out',
                        transform: isFilterOpen ? 'rotate(180deg)' : 'none',
                    }}
                />
            </Button>
            {isFilterOpen && (
                <List ref={ref}>
                    <Item>
                        <StatusFilter
                            onClick={() => handleFilterChange('draft')}
                            $isActive={filterType === 'draft'}
                        >
                            Draft
                        </StatusFilter>
                    </Item>
                    <Item>
                        <StatusFilter
                            onClick={() => handleFilterChange('pending')}
                            $isActive={filterType === 'pending'}
                        >
                            Pending
                        </StatusFilter>
                    </Item>
                    <Item>
                        <StatusFilter
                            onClick={() => handleFilterChange('invoiced')}
                            $isActive={filterType === 'invoiced'}
                        >
                            Invoiced
                        </StatusFilter>
                    </Item>
                    <Item>
                        <StatusFilter
                            onClick={() => handleFilterChange('all')}
                            $isActive={filterType === 'all'}
                        >
                            All
                        </StatusFilter>
                    </Item>
                </List>
            )}
        </StyledFilter>
    );
};

export default Filter; 