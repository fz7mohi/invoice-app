/**
 * Function to validate form. Iterate through each property of given object with user inputed values
 * and return errors if it doesn't meet criteria.
 * @param    {object} objectToValidate    Object with form inputs values
 * @param    {array} itemsArray    Array of items to validate
 * @param    {boolean} isDraft    Whether this is a draft submission
 * @return   {object}    Object with validation results
 */
const formValidation = (objectToValidate, itemsArray, isDraft = false) => {
    let errors = {};
    let messages = [];
    let isError = false;

    // For draft submissions, only validate client name
    if (isDraft) {
        if (!objectToValidate.clientName || objectToValidate.clientName === '') {
            errors.clientName = true;
            messages.push('- Client name cannot be empty');
            isError = true;
        }
        return { isError, err: errors, msg: messages };
    }

    // For regular submissions, validate all required fields
    const requiredFields = ['description', 'clientName', 'termsAndConditions'];
    for (const field of requiredFields) {
        if (!objectToValidate[field] || objectToValidate[field] === '') {
            errors[field] = true;
            messages.push(`- ${field} cannot be empty`);
            isError = true;
        }
    }

    // Skip validation for paymentDue as it's calculated
    
    // Check client email format if it exists
    if (objectToValidate.clientEmail && !emailValidation(objectToValidate.clientEmail)) {
        errors.clientEmail = true;
        messages.push('- The email must be correct');
        isError = true;
    }
    
    // Check client address
    if (objectToValidate.clientAddress) {
        // Make post code and city optional but still validate other address fields
        const requiredAddressFields = ['street', 'country'];
        for (const field of requiredAddressFields) {
            if (!objectToValidate.clientAddress[field] || objectToValidate.clientAddress[field] === '') {
                if (!errors.clientAddress) errors.clientAddress = {};
                errors.clientAddress[field] = true;
                messages.push(`- Client ${field} cannot be empty`);
                isError = true;
            }
        }
        
        // Post code and city are optional, so we don't validate them
    }
    
    // Validate items
    if (!itemsArray || itemsArray.length === 0) {
        errors.items = true;
        messages.push('- At least one item must be added');
        isError = true;
    } else {
        const itemsErrors = [];
        
        itemsArray.forEach((item, index) => {
            const itemError = {};
            
            // Check required item fields
            if (!item.name || item.name === '') {
                itemError.name = true;
                messages.push('- Item name cannot be empty');
                isError = true;
            }
            
            if (!item.quantity || isNaN(parseFloat(item.quantity))) {
                itemError.quantity = true;
                messages.push('- Item quantity must be a number');
                isError = true;
            }
            
            if (!item.price || isNaN(parseFloat(item.price))) {
                itemError.price = true;
                messages.push('- Item price must be a number');
                isError = true;
            }
            
            // Only add errors for this item if there are any
            if (Object.keys(itemError).length > 0) {
                itemsErrors[index] = itemError;
            }
        });
        
        // Only add items errors if there are any
        if (itemsErrors.length > 0) {
            errors.items = itemsErrors;
        }
    }
    
    // Return validation results
    return {
        isError,
        err: errors,
        msg: [...new Set(messages)] // Remove duplicate messages
    };
};

/**
 * Function that check if our email is correct
 * @param    {String} email    String with email address
 * @return   {Boolean}         Returns true or false
 */
const emailValidation = (email) => {
    if (!email) return false;
    const regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
};

export default formValidation;
