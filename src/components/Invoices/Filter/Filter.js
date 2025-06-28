import { useState, useEffect, useRef } from 'react';
import Icon from '../../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../App/context';
import { StyledFilter, Button, List, Item, StatusFilter, DateFilterSection, DateFilterTitle, DateRangeContainer, DateInput, MonthFilterContainer, MonthSelect, ApplyButton, ClearButton } from './FilterStyles';

function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const Filter = ({ filterType, setFilterType, dateFilter, setDateFilter }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('status'); // 'status' or 'date'
    const ref = useRef();

    // Date filter states
    const [startDate, setStartDate] = useState(dateFilter?.startDate || '');
    const [endDate, setEndDate] = useState(dateFilter?.endDate || '');
    const [selectedMonth, setSelectedMonth] = useState(dateFilter?.month || '');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    /* Running an effect whenever isFilterOpen changes and we are binding a click event to the document 
    so that whenever the user clicks on the document, we can check if it is inside or outside the list 
    and hide the list accordingly. */
    useEffect(() => {
        const checkIfClickedOutside = (event) => {
            // Check if the click target is within the filter dropdown
            if (ref.current && ref.current.contains(event.target)) {
                return; // Don't close if clicking inside the dropdown
            }
            
            // Check if the click target is the filter button itself
            if (event.target.closest('button') && event.target.closest('button').textContent.includes('Filter')) {
                return; // Don't close if clicking the filter button
            }
            
            // Close the dropdown for all other clicks
            setIsFilterOpen(false);
        };

        if (isFilterOpen) {
            document.addEventListener('click', checkIfClickedOutside);
        }

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

    /* Function to handle date filter changes */
    const handleDateFilterChange = () => {
        const newDateFilter = {
            startDate,
            endDate,
            month: selectedMonth,
            year: selectedYear
        };
        setDateFilter(newDateFilter);
        setIsFilterOpen(false);
    };

    /* Function to clear date filters */
    const handleClearDateFilter = () => {
        setStartDate('');
        setEndDate('');
        setSelectedMonth('');
        setSelectedYear(new Date().getFullYear().toString());
        setDateFilter({ startDate: '', endDate: '', month: '', year: '' });
    };

    /* Function to handle month selection */
    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        if (month) {
            const year = parseInt(selectedYear, 10);
            const monthIndex = parseInt(month, 10) - 1;
            const firstDay = new Date(year, monthIndex, 1);
            const lastDay = new Date(year, monthIndex + 1, 0);

            const start = formatDateLocal(firstDay);
            const end = formatDateLocal(lastDay);

            setStartDate(start);
            setEndDate(end);
        } else {
            setStartDate('');
            setEndDate('');
        }
    };

    /* Function to handle year selection */
    const handleYearChange = (year) => {
        setSelectedYear(year);
        if (selectedMonth) {
            const monthIndex = parseInt(selectedMonth) - 1;
            const firstDay = new Date(parseInt(year), monthIndex, 1);
            const lastDay = new Date(parseInt(year), monthIndex + 1, 0);

            setStartDate(firstDay.toISOString().split('T')[0]);
            setEndDate(lastDay.toISOString().split('T')[0]);
        }
    };

    // Generate month options
    const monthOptions = [
        { value: '', label: 'Select Month' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    // Generate year options (current year and 5 years back)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
        yearOptions.push({ value: i.toString(), label: i.toString() });
    }

    return (
        <StyledFilter>
            <Button onClick={toggleFilterList}>
                Filter {isDesktop && 'by status & date'}
                {(dateFilter.startDate && dateFilter.endDate) && (
                    <span style={{
                        background: colors.purple,
                        color: '#fff',
                        borderRadius: '50%',
                        width: '8px',
                        height: '8px',
                        display: 'inline-block',
                        marginLeft: '4px'
                    }} />
                )}
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
                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', marginBottom: '16px', borderBottom: `1px solid ${colors.purple}20` }}>
                        <button
                            onClick={() => setActiveTab('status')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                background: activeTab === 'status' ? colors.purple : 'transparent',
                                color: activeTab === 'status' ? '#fff' : colors.white,
                                border: 'none',
                                borderRadius: '4px 4px 0 0',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                        >
                            Status
                        </button>
                        <button
                            onClick={() => setActiveTab('date')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                background: activeTab === 'date' ? colors.purple : 'transparent',
                                color: activeTab === 'date' ? '#fff' : colors.white,
                                border: 'none',
                                borderRadius: '4px 4px 0 0',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                        >
                            Date
                        </button>
                    </div>

                    {/* Status Filter Tab */}
                    {activeTab === 'status' && (
                        <>
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
                                    onClick={() => handleFilterChange('paid')}
                                    $isActive={filterType === 'paid'}
                                >
                                    Paid
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
                        </>
                    )}

                    {/* Date Filter Tab */}
                    {activeTab === 'date' && (
                        <DateFilterSection>
                            <DateFilterTitle>Filter by Date Range</DateFilterTitle>
                            <DateRangeContainer>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: colors.white }}>
                                        Start Date
                                    </label>
                                    <DateInput
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: colors.white }}>
                                        End Date
                                    </label>
                                    <DateInput
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </DateRangeContainer>

                            <DateFilterTitle>Or Filter by Month & Year</DateFilterTitle>
                            <MonthFilterContainer>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <MonthSelect
                                        value={selectedMonth}
                                        onChange={(e) => handleMonthChange(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ flex: 1 }}
                                    >
                                        {monthOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </MonthSelect>
                                    <MonthSelect
                                        value={selectedYear}
                                        onChange={(e) => handleYearChange(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ flex: 1 }}
                                    >
                                        {yearOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </MonthSelect>
                                </div>
                                {(selectedMonth && selectedYear) && (
                                    <div style={{ 
                                        fontSize: '12px', 
                                        color: colors.white, 
                                        opacity: 0.8,
                                        textAlign: 'center',
                                        padding: '4px',
                                        backgroundColor: colors.purple + '20',
                                        borderRadius: '4px'
                                    }}>
                                        {monthOptions.find(m => m.value === selectedMonth)?.label} {selectedYear}
                                    </div>
                                )}
                            </MonthFilterContainer>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <ApplyButton onClick={handleDateFilterChange}>
                                    Apply
                                </ApplyButton>
                                <ClearButton onClick={handleClearDateFilter}>
                                    Clear
                                </ClearButton>
                            </div>
                        </DateFilterSection>
                    )}
                </List>
            )}
        </StyledFilter>
    );
};

export default Filter;
