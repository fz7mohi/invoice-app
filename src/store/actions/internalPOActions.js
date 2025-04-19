import * as ACTION_TYPES from '../actions/action_type';
import generateUniqueId from '../../utilities/generateUniqueID';
import generatePaymentDueDate from '../../utilities/generatePaymentDueDate';
import { generateCustomId } from '../../utilities/generateCustomId';
import { calculatePaymentDueDate as calculatePaymentDueDateUtil } from '../../utilities/calculatePaymentDueDate';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// REDUCER ACTIONS
/**
 * Function to add internal PO to state. In payload we're passing new internal PO, new unique ID, paymentDue and status.
 * If passed type is equal to 'new' return 'pending' status otherwise 'draft'.
 * @param    {object} internalPO    Object of created internal PO
 * @param    {string} state    Object of state
 * @param    {string} type    String with type of internal PO. (available: 'new' or 'draft')
 */
export const add = (internalPO, type) => {
    const customId = generateCustomId('PO');
    const paymentDueDate = calculatePaymentDueDateUtil(internalPO.date, internalPO.paymentTerms);

    return {
        type: ACTION_TYPES.ADD_INTERNAL_PO,
        payload: {
            ...internalPO,
            customId,
            paymentDueDate,
            status: type === 'new' ? 'pending' : 'draft'
        }
    };
};

/**
 * Function to save changes on editing internal PO. In payload we're passing new internal PO, paymentDue and status 'pending'
 * @param    {object} internalPO    Object of edited internal PO
 */
export const change = (internalPO) => {
    const paymentDueDate = calculatePaymentDueDateUtil(internalPO.date, internalPO.paymentTerms);

    return {
        type: ACTION_TYPES.SAVE_INTERNAL_PO_CHANGES,
        payload: {
            ...internalPO,
            paymentDueDate,
            status: 'pending'
        }
    };
};

/**
 * Function to delete internal PO.
 */
export const remove = (id) => {
    return {
        type: ACTION_TYPES.DELETE_INTERNAL_PO,
        payload: id
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

export const createFromInvoice = (invoiceId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

            const { invoiceState } = getState();
            const invoice = invoiceState.invoices.find(inv => inv.id === invoiceId);

            if (!invoice) {
                throw new Error('Invoice not found');
            }

            // Generate new internal PO data
            const customId = generateCustomId('PO');
            const paymentDueDate = calculatePaymentDueDateUtil(invoice.date, invoice.paymentTerms);
            const now = new Date();

            // Create new internal PO object
            const newInternalPO = {
                ...invoice,
                customId,
                paymentDueDate,
                status: 'pending',
                type: 'internal',
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                // Keep the invoice ID for reference
                invoiceId: invoice.customId,
                // Remove invoice-specific fields
                invoiceStatus: undefined,
                // Add internal PO specific fields
                items: invoice.items.map(item => ({
                    ...item,
                    quantity: item.quantity || 1,
                    price: item.price || 0
                })),
                total: invoice.total || 0,
                paymentTerms: invoice.paymentTerms || 'Net 30',
                description: invoice.description || '',
                clientName: invoice.clientName || '',
                clientEmail: invoice.clientEmail || '',
                clientAddress: invoice.clientAddress || {
                    street: '',
                    city: '',
                    postCode: '',
                    country: ''
                }
            };

            // Save to Firestore
            const docRef = await addDoc(collection(db, 'internalPOs'), {
                ...newInternalPO,
                createdAt: Timestamp.fromDate(now),
                paymentDue: Timestamp.fromDate(new Date(paymentDueDate))
            });

            // Update the ID with the Firestore document ID
            newInternalPO.id = docRef.id;

            // Dispatch to Redux state
            dispatch({
                type: ACTION_TYPES.ADD_INTERNAL_PO,
                payload: newInternalPO
            });

            dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
            return newInternalPO;
        } catch (error) {
            console.error('Error creating internal PO:', error);
            dispatch({ 
                type: ACTION_TYPES.SET_FIREBASE_ERROR, 
                payload: error.message 
            });
            dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
            throw error;
        }
    };
}; 