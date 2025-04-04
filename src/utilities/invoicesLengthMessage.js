/**
 * Function to handle displaying info message below Invoices header.
 * Its responsive to windowWidth.
 * @param    {array} filteredInvoices    Array with filteredInvoices
 * @param    {string} filterType    String with selected filter
 * @param    {number} windowWidth    Number with width of window
 * @return   {string}    String with message
 */
const invoicesLengthMessage = (filteredInvoices, filterType, windowWidth) => {
    const isDesktop = windowWidth >= 768;
    
    if (filteredInvoices?.length === 0) {
        if (filterType !== 'all') {
            return `No ${filterType} invoices`;
        } else {
            return 'No invoices';
        }
    } else {
        return isDesktop
            ? `There ${
                  filteredInvoices?.length === 1 ? 'is' : 'are'
              } ${filteredInvoices?.length} ${
                  filteredInvoices?.length === 1 ? 'invoice' : 'invoices'
              }${filterType === 'all' ? '' : ` ${filterType}`}`
            : `${filteredInvoices?.length} ${
                  filteredInvoices?.length === 1 ? 'invoice' : 'invoices'
              }`;
    }
};

export default invoicesLengthMessage;
