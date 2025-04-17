import * as ACTION_TYPES from '../actions/action_type';
import generateUniqueId from '../../utilities/generateUniqueID';
import generatePaymentDueDate from '../../utilities/generatePaymentDueDate';

// REDUCER ACTIONS
/**
 * Function to add internal PO to state. In payload we're passing new internal PO, new unique ID, paymentDue and status.
 * If passed type is equal to 'new' return 'pending' status otherwise 'draft'.
 * @param    {object} internalPO    Object of created internal PO
 * @param    {string} state    Object of state
 * @param    {string} type    String with type of internal PO. (available: 'new' or 'draft')
 */
export const add = (internalPO, state, type) => {
    // Ensure state.internalPOs exists, default to empty array if not
    const internalPOs = state?.internalPOs || [];
    
    return {
        type: ACTION_TYPES.ADD_INTERNAL_PO,
        payload: {
            internalPO: internalPO,
            id: generateUniqueId(internalPOs),
            paymentDue: generatePaymentDueDate(
                internalPO.createdAt,
                internalPO.paymentTerms
            ),
            status: type === 'new' ? 'pending' : 'draft',
        },
    };
};

/**
 * Function to save changes on editing internal PO. In payload we're passing new internal PO, paymentDue and status 'pending'
 * @param    {object} internalPO    Object of edited internal PO
 */
export const change = (internalPO) => {
    return {
        type: ACTION_TYPES.SAVE_INTERNAL_PO_CHANGES,
        payload: {
            internalPO: internalPO,
            paymentDue: generatePaymentDueDate(
                internalPO.createdAt,
                internalPO.paymentTerms
            ),
            status: 'pending',
        },
    };
};

/**
 * Function to delete internal PO.
 */
export const remove = () => {
    return {
        type: ACTION_TYPES.DELETE_INTERNAL_PO,
    };
};

/**
 * Function to toggle form to create new internal PO.
 */
export const create = () => {
    return {
        type: ACTION_TYPES.CREATE_INTERNAL_PO,
    };
};

/**
 * Function to edit an internal PO.
 * @param {string} index The index of the internal PO to edit
 */
export const edit = (index) => {
    return {
        type: ACTION_TYPES.EDIT_INTERNAL_PO,
        payload: index,
    };
};

/**
 * Function to mark an internal PO as paid.
 */
export const paid = () => {
    return {
        type: ACTION_TYPES.PAID_INTERNAL_PO,
    };
};

/**
 * Function to discard changes made to an internal PO.
 */
export const discard = () => {
    return {
        type: ACTION_TYPES.DISCARD_INTERNAL_PO,
    };
};

/**
 * Function to toggle modal for an internal PO.
 * @param {string} index The index of the internal PO
 * @param {string} name The name of the modal
 */
export const modal = (index, name) => {
    return {
        type: ACTION_TYPES.TOGGLE_INTERNAL_PO_MODAL,
        payload: { index, name },
    };
};

/**
 * Function to set errors for an internal PO.
 * @param {object} err Error object
 * @param {array} msg Array of error messages
 */
export const errors = (err, msg) => {
    return {
        type: ACTION_TYPES.SET_INTERNAL_PO_ERRORS,
        payload: { err, msg },
    };
}; 