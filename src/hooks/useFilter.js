import { useMemo } from 'react';

/**
 * Custom hook to filter items based on filter type.
 * @param   {object} state The state containing items to filter
 * @param   {string} filterType The type of filter to apply
 * @returns {object} The filtered items and filter type
 */
const useFilter = (state, customFilterType = null) => {
    // Support for both invoices and quotations
    const items = state.invoices || state.quotations || [];
    const filterType = customFilterType || 'all';

    // Filter items based on filter type
    const filteredItems = useMemo(() => {
        switch (filterType) {
            case 'draft':
                return items.filter((item) => item.status === 'draft');
            case 'pending':
                return items.filter((item) => item.status === 'pending');
            case 'paid':
                return items.filter((item) => item.status === 'paid');
            case 'approved':
                return items.filter((item) => item.status === 'approved');
            default:
                return items;
        }
    }, [items, filterType]);

    return {
        filteredInvoices: state.invoices ? filteredItems : [],
        filteredQuotations: state.quotations ? filteredItems : [],
        filterType,
    };
};

export default useFilter;
