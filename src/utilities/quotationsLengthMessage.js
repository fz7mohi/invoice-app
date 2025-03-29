/**
 * Function to handle displaying info message below Quotations header.
 * Its resposive to windowWidth.
 * @param    {array} filteredQuotations    Array with filteredQuotations
 * @param    {string} filterType    String with selected filter
 * @param    {number} windowWidth    Number with width of window
 * @return   {string}    String with message
 */
const quotationsLengthMessage = (filteredQuotations, filterType, windowWidth) => {
    const isDesktop = windowWidth >= 768;
    
    if (filteredQuotations?.length === 0) {
        if (filterType !== 'all') {
            return `No ${filterType} quotations`;
        } else {
            return 'No quotations';
        }
    } else {
        return isDesktop
            ? `There ${
                  filteredQuotations?.length === 1 ? 'is' : 'are'
              } ${filteredQuotations?.length} ${
                  filteredQuotations?.length === 1 ? 'quotation' : 'quotations'
              }${filterType === 'all' ? '' : ` ${filterType}`}`
            : `${filteredQuotations?.length} ${
                  filteredQuotations?.length === 1 ? 'quotation' : 'quotations'
              }`;
    }
};

export default quotationsLengthMessage; 