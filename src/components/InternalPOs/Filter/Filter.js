import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'styled-components';
import Icon from '../../shared/Icon/Icon';
import { 
    FilterContainer, 
    FilterButton, 
    Dropdown, 
    Checkbox, 
    Label 
} from './FilterStyles';

const Filter = ({ filterType, setFilterType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const theme = useTheme();

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFilterChange = (type) => {
        setFilterType(type);
        setIsOpen(false);
    };

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'void', label: 'Void' }
    ];

    return (
        <FilterContainer ref={dropdownRef}>
            <FilterButton 
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span>Filter by status</span>
                <Icon 
                    name={isOpen ? 'chevron-up' : 'chevron-down'} 
                    size={12} 
                    color={theme.colors.purple} 
                />
            </FilterButton>
            
            {isOpen && (
                <Dropdown>
                    {filterOptions.map((option) => (
                        <Checkbox key={option.value}>
                            <input
                                type="radio"
                                id={option.value}
                                name="filter"
                                checked={filterType === option.value}
                                onChange={() => handleFilterChange(option.value)}
                            />
                            <Label htmlFor={option.value}>
                                {option.label}
                            </Label>
                        </Checkbox>
                    ))}
                </Dropdown>
            )}
        </FilterContainer>
    );
};

export default Filter; 