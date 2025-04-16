import { useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import { Filter as FilterStyled, Dropdown } from './FilterStyles';

const Filter = ({ filterType, setFilterType }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleFilterClick = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterSelect = (type) => {
        setFilterType(type);
        setIsFilterOpen(false);
    };

    return (
        <FilterStyled isFilterOpen={isFilterOpen} onClick={handleFilterClick}>
            <span>Filter by status</span>
            <Icon name="arrow-down" size={16} />
            {isFilterOpen && (
                <Dropdown>
                    <div onClick={() => handleFilterSelect('all')}>All</div>
                    <div onClick={() => handleFilterSelect('pending')}>Pending</div>
                    <div onClick={() => handleFilterSelect('approved')}>Approved</div>
                    <div onClick={() => handleFilterSelect('rejected')}>Rejected</div>
                </Dropdown>
            )}
        </FilterStyled>
    );
};

export default Filter; 