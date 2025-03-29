import * as ACTION_TYPES from './action_type';
import generateUniqueId from '../../utilities/generateUniqueID';

/**
 * Add new quotation to state.
 * @param    {object} quotation    Object of created quotation
 * @param    {string} state    Object of state
 * @param    {string} type    String with type of quotation. (available: 'new' or 'draft')
 * @return   {object}    Action to dispatch
 */
export const add = (quotation, state, type) => {
    return {
        type: ACTION_TYPES.ADD_QUOTATION,
        payload: {
            quotation,
            id: quotation.id || generateUniqueId(state.quotations),
            paymentDue: quotation.createdAt.setDate(
                quotation.createdAt.getDate() +
                    parseInt(quotation.paymentTerms)
            ),
            status: type === 'new' ? 'pending' : 'draft',
        },
    };
};

/**
 * Save changes of quotation to state.
 * @param    {object} quotation    Object of saved quotation
 * @return   {object}    Action to dispatch
 */
export const change = (quotation) => {
    return {
        type: ACTION_TYPES.SAVE_QUOTATION_CHANGES,
        payload: {
            quotation,
        },
    };
};

/**
 * Edit quotation form.
 * @param    {string} id    String with quotation id
 * @return   {object}    Action to dispatch
 */
export const edit = (id) => {
    return {
        type: ACTION_TYPES.EDIT_QUOTATION,
        payload: {
            id,
        },
    };
};

/**
 * Delete quotation from state.
 * @return   {object}    Action to dispatch
 */
export const remove = () => {
    return {
        type: ACTION_TYPES.DELETE_QUOTATION,
        payload: {},
    };
};

/**
 * Change quotation status to approved.
 * @return   {object}    Action to dispatch
 */
export const approved = () => {
    return {
        type: ACTION_TYPES.APPROVE_QUOTATION,
        payload: {},
    };
};

/**
 * Create a new quotation.
 * @return   {object}    Action to dispatch
 */
export const create = () => {
    return {
        type: ACTION_TYPES.CREATE_QUOTATION,
        payload: {},
    };
};

/**
 * Discard quotation form.
 * @return   {object}    Action to dispatch
 */
export const discard = () => {
    return {
        type: ACTION_TYPES.DISCARD_QUOTATION,
        payload: {},
    };
};

/**
 * Toggle modal for quotation.
 * @param    {string} id    String with quotation id
 * @param    {string} name    String with action to perform ('delete' or 'approve')
 * @return   {object}    Action to dispatch
 */
export const modal = (id, name) => {
    return {
        type: ACTION_TYPES.TOGGLE_QUOTATION_MODAL,
        payload: {
            id,
            name,
        },
    };
};

/**
 * Set errors object in state.
 * @param    {object} err    Object with form errors
 * @param    {array} msg    Array with form error messages
 * @return   {object}    Action to dispatch
 */
export const errors = (err, msg) => {
    return {
        type: ACTION_TYPES.SET_QUOTATION_ERRORS,
        payload: {
            err,
            msg,
        },
    };
}; 