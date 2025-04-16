const purchaseOrdersLengthMessage = (length, filter, windowWidth) => {
    const isMobile = windowWidth < 768;
    const count = length || 0;

    if (count === 0) {
        return filter === 'all' 
            ? 'No purchase orders' 
            : `No ${filter} purchase orders`;
    }

    if (isMobile) {
        return `${count} purchase order${count !== 1 ? 's' : ''}`;
    }

    return filter === 'all'
        ? `There ${count === 1 ? 'is' : 'are'} ${count} purchase order${count !== 1 ? 's' : ''}`
        : `There ${count === 1 ? 'is' : 'are'} ${count} ${filter} purchase order${count !== 1 ? 's' : ''}`;
};

export default purchaseOrdersLengthMessage; 