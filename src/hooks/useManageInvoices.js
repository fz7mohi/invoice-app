import { useState, useEffect, useReducer } from 'react';
import { invoicesReducer } from '../store/reducers/invoicesReducer';
import * as ACTIONS from '../store/actions/invoicesActions';
import allowOnlyNumbers from '../utilities/allowOnlyNumbers';
import formValidation from '../utilities/formValidation';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    doc, 
    orderBy, 
    query,
    where,
    Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Function to get invoices array from localStorage.
 * @return   {object}    Array containing invoices
 */
const getInvoicesFromLocalStorage = () => {
    try {
        const storedInvoices = localStorage.getItem('invoices');
        return storedInvoices ? JSON.parse(storedInvoices) : [];
    } catch (error) {
        console.error('Error getting invoices from localStorage:', error);
        return [];
    }
};

/**
 * Function to post invoices array to localStorage.
 * @param   {object} invoices Array with invoices
 */
const postInvoicesToLocalStorage = (invoices) => {
    try {
        localStorage.setItem('invoices', JSON.stringify(invoices));
    } catch (error) {
        console.error('Error posting invoices to localStorage:', error);
    }
};

// Initial state values
const initialAddress = {
    street: '',
    city: '',
    postCode: '',
    country: '',
};

const initialItems = {
    name: '',
    quantity: 0,
    price: 0,
    total: 0,
};

const initialInvoice = {
    createdAt: new Date(),
    paymentDue: ``,
    description: '',
    paymentTerms: '30',
    clientName: '',
    clientEmail: '',
    senderAddress: initialAddress,
    clientAddress: initialAddress,
    items: [],
    total: 0,
};

const initialState = {
    invoices: [],
    isFormOpen: false,
    isModalOpen: { status: false, name: '' },
    isInvoiceEdited: false,
    currInvoiceIndex: null,
    errors: { err: {}, msg: [] },
    isLoading: false,
    firebaseError: false
};

/**
 * Generate a unique invoice ID
 * @returns {string} A unique ID
 */
const generateId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Custom hook to handle managing invoices and forms using Firebase.
 */
const useManageInvoices = () => {
    const [state, dispatch] = useReducer(invoicesReducer, initialState);
    const [invoice, setInvoice] = useState(initialInvoice);
    const [senderAddress, setSenderAddress] = useState(initialAddress);
    const [clientAddress, setClientAddress] = useState(initialAddress);
    const [items, setItems] = useState([]);

    // Update invoice state everytime dependency array has changed.
    useEffect(() => {
        setInvoice((oldState) => {
            return { ...oldState, senderAddress, clientAddress, items };
        });
    }, [senderAddress, clientAddress, items]);

    // Load invoices from Firestore when the component mounts
    useEffect(() => {
        let isMounted = true;
        
        const fetchInvoices = async () => {
            if (!isMounted) return;
            
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                // First try to get data from Firestore
                try {
                    const invoicesCollection = collection(db, 'invoices');
                    const invoicesQuery = query(
                        invoicesCollection,
                        orderBy('createdAt', 'desc') // Sort by creation date in descending order
                    );
                    const querySnapshot = await getDocs(invoicesQuery);
                    
                    if (!isMounted) return;
                    
                    const invoicesList = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        // Convert Firestore Timestamp back to Date object
                        const createdAt = data.createdAt?.toDate() || new Date();
                        const paymentDue = data.paymentDue?.toDate() || new Date();
                        
                        return {
                            id: doc.id,
                            ...data,
                            createdAt,
                            paymentDue
                        };
                    });
                    
                    dispatch({ type: 'SET_INVOICES', payload: invoicesList });
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: false });
                } catch (firebaseError) {
                    console.error('Firebase error, falling back to localStorage:', firebaseError);
                    
                    if (!isMounted) return;
                    
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                    
                    // Fallback to localStorage if Firebase fails
                    const localInvoices = getInvoicesFromLocalStorage();
                    dispatch({ type: 'SET_INVOICES', payload: localInvoices });
                }
            } catch (error) {
                console.error('Error loading invoices:', error);
            } finally {
                if (isMounted) {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            }
        };
        
        fetchInvoices();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);
    
    // Save to localStorage as a backup when invoices change
    useEffect(() => {
        if (state.invoices.length > 0) {
            postInvoicesToLocalStorage(state.invoices);
        }
    }, [state.invoices]);

    // HANDLERS
    /**
     * Function to handle user input. Update appropriate state based on type prop given.
     * @param    {object} event    Event (pass false if type === 'date')
     * @param    {string} type    String with state to edit (available: invoice, senderAddress, clientAddress, date or items)
     * @param    {object} date    Date istance. (Pass false if type !== 'date')
     * @param    {number} index    Index of item. (Required only for type 'items')
     */
    const handleInvoiceChange = (event, type, date, index) => {
        let name = event ? event.target.name : null;
        let value = event ? event.target.value : null;

        switch (type) {
            case 'invoice':
                setInvoice({ ...invoice, [name]: value });
                break;
            case 'senderAddress':
                setSenderAddress({ ...senderAddress, [name]: value });
                break;
            case 'clientAddress':
                setClientAddress({ ...clientAddress, [name]: value });
                break;
            case 'date':
                setInvoice((oldState) => {
                    return { ...oldState, ['createdAt']: date };
                });
                break;
            case 'items':
                const newItems = [...items];
                if (name === 'quantity' || name === 'price') {
                    newItems[index][name] = allowOnlyNumbers(value);
                } else {
                    newItems[index][name] = value;
                }
                // Calculate item subtotal (before VAT)
                const itemPrice = parseFloat(newItems[index].price) || 0;
                const itemQuantity = parseFloat(newItems[index].quantity) || 0;
                const itemSubtotal = itemPrice * itemQuantity;
                
                // Calculate VAT for UAE clients
                if (clientAddress?.country?.toLowerCase().includes('emirates') || 
                    clientAddress?.country?.toLowerCase().includes('uae')) {
                    const itemVat = itemSubtotal * 0.05;
                    newItems[index]['vat'] = itemVat;
                    newItems[index]['total'] = itemSubtotal + itemVat; // Store total including VAT
                } else {
                    newItems[index]['vat'] = 0;
                    newItems[index]['total'] = itemSubtotal;
                }
                
                setItems(newItems);
                break;
            default:
                throw new Error('no matching type');
        }
    };

    /**
     * Function to add another object with inintialItems values to Items state
     * to render another item with inputs in form Item List.
     */
    const handleItemsAdd = () => {
        setItems([...items, { ...initialItems }]);
    };

    /**
     * Function to remove item from Items state.
     * @param    {number} index    Index of deleted item
     */
    const handleItemsRemove = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    /**
     * Function to submit form. Based on type prop we either add new invoice with validation,
     * change current invoice with validation or save form as draft without validation.
     * @param    {object} event    Event
     * @param    {string} type    String with type of preffered action. (available: 'new', 'save', 'change')
     */
    const handleSubmit = async (event, type) => {
        event.preventDefault();

        if (type === 'add' && formValidation(invoice, setErrors)) {
            await addInvoice(invoice, state, 'new');
            restoreToInitial();
        } else if (type === 'save') {
            await addInvoice(invoice, state, 'draft');
            restoreToInitial();
        } else if (type === 'change' && formValidation(invoice, setErrors)) {
            await changeInvoice(invoice);
            restoreToInitial();
        }
    };

    // HELPERS
    /**
     * Function to set all states responsible for displaying data to inputs with current edited invoice data.
     * @param    {string} index    String with id of edited invoice.
     */
    const setEditedInvoice = (index) => {
        const invoice = state.invoices.find((item) => item.id === index);
        if (invoice) {
            setInvoice(invoice);
            setClientAddress(invoice.clientAddress || initialAddress);
            setSenderAddress(invoice.senderAddress || initialAddress);
            setItems(invoice.items || []);
        }
    };

    /**
     * Function to restore all states to initial state.
     */
    const restoreToInitial = () => {
        setInvoice(initialInvoice);
        setClientAddress(initialAddress);
        setSenderAddress(initialAddress);
        setItems([]);
        setErrors({}, []);
    };

    // DISPATCHERS
    /**
     * Function to add invoice to state.
     * @param    {object} invoice    Object of created invoice
     * @param    {string} state    Object of state
     * @param    {string} type    String with type of invoice. (available: 'new' or 'draft')
     */
    const addInvoice = async (invoice, state, type) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            // Create a new invoice object
            let newInvoice = { 
                ...invoice,
                status: type === 'new' ? 'pending' : 'draft',
                id: generateId() // Default ID in case Firebase fails
            };
            
            // Try to add to Firebase if not in error state
            if (!state.firebaseError) {
                try {
                    const { id, ...invoiceData } = invoice;
                    
                    // Convert Date objects to Firestore Timestamps
                    const firestoreInvoice = {
                        ...invoiceData,
                        createdAt: Timestamp.fromDate(invoice.createdAt || new Date()),
                        paymentDue: invoice.paymentDue ? Timestamp.fromDate(new Date(invoice.paymentDue)) : null,
                        status: type === 'new' ? 'pending' : 'draft',
                        clientId: invoice.clientId || null // Ensure clientId is set
                    };
                    
                    // If we have client data but no clientId, try to find the client by name
                    if (!firestoreInvoice.clientId && invoice.clientName) {
                        try {
                            const clientsRef = collection(db, 'clients');
                            const q = query(clientsRef, where('companyName', '==', invoice.clientName));
                            const querySnapshot = await getDocs(q);
                            
                            if (!querySnapshot.empty) {
                                firestoreInvoice.clientId = querySnapshot.docs[0].id;
                            }
                        } catch (error) {
                            console.error('Error finding client by name:', error);
                        }
                    }
                    
                    // Calculate totalVat for UAE clients
                    if (invoice.clientAddress?.country?.toLowerCase().includes('emirates') || 
                        invoice.clientAddress?.country?.toLowerCase().includes('uae')) {
                        // Calculate subtotal first (sum of price * quantity for each item)
                        const subtotal = invoice.items?.reduce((sum, item) => {
                            const itemPrice = parseFloat(item.price) || 0;
                            const itemQuantity = parseFloat(item.quantity) || 0;
                            return sum + (itemPrice * itemQuantity);
                        }, 0) || 0;
                        
                        // Calculate VAT (5% of subtotal)
                        const totalVat = subtotal * 0.05;
                        
                        // Total is subtotal plus VAT
                        const total = subtotal + totalVat;
                        
                        firestoreInvoice.subtotal = subtotal;
                        firestoreInvoice.totalVat = totalVat;
                        firestoreInvoice.total = total;
                        
                        // Add VAT to each item
                        firestoreInvoice.items = invoice.items?.map(item => {
                            const itemSubtotal = (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
                            const itemVat = itemSubtotal * 0.05;
                            return {
                                ...item,
                                total: itemSubtotal + itemVat,
                                vat: itemVat
                            };
                        }) || [];
                    } else {
                        // For non-UAE clients, calculate total without VAT
                        const subtotal = invoice.items?.reduce((sum, item) => {
                            const itemPrice = parseFloat(item.price) || 0;
                            const itemQuantity = parseFloat(item.quantity) || 0;
                            return sum + (itemPrice * itemQuantity);
                        }, 0) || 0;
                        
                        firestoreInvoice.subtotal = subtotal;
                        firestoreInvoice.totalVat = 0;
                        firestoreInvoice.total = subtotal;
                        
                        firestoreInvoice.items = invoice.items?.map(item => {
                            const itemSubtotal = (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
                            return {
                                ...item,
                                total: itemSubtotal,
                                vat: 0
                            };
                        }) || [];
                    }
                    
                    const docRef = await addDoc(collection(db, 'invoices'), firestoreInvoice);
                    
                    newInvoice = {
                        ...invoice,
                        id: docRef.id,
                        status: type === 'new' ? 'pending' : 'draft'
                    };
                } catch (firebaseError) {
                    console.error('Firebase add error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                    // Continue with the default newInvoice with generated ID
                }
            }
            
            dispatch(ACTIONS.add(newInvoice, state, type));
        } catch (error) {
            console.error('Error adding invoice:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Function to save changes on editing invoice.
     * @param    {object} invoice    Object of edited invoice
     */
    const changeInvoice = async (invoice) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            // Try to update in Firebase if not in error state
            if (!state.firebaseError) {
                try {
                    const { id, ...invoiceData } = invoice;
                    
                    // Convert Date objects to Firestore Timestamps
                    const firestoreInvoice = {
                        ...invoiceData,
                        createdAt: Timestamp.fromDate(invoice.createdAt || new Date()),
                        paymentDue: invoice.paymentDue ? Timestamp.fromDate(new Date(invoice.paymentDue)) : null
                    };
                    
                    // Calculate totalVat and grandTotal for UAE clients
                    if (invoice.clientAddress?.country?.toLowerCase().includes('emirates') || 
                        invoice.clientAddress?.country?.toLowerCase().includes('uae')) {
                        // Calculate subtotal first (sum of price * quantity for each item)
                        const subtotal = invoice.items?.reduce((sum, item) => {
                            const itemPrice = parseFloat(item.price) || 0;
                            const itemQuantity = parseFloat(item.quantity) || 0;
                            return sum + (itemPrice * itemQuantity);
                        }, 0) || 0;
                        
                        // Calculate VAT (5% of subtotal)
                        const totalVat = subtotal * 0.05;
                        
                        // Total is subtotal plus VAT
                        const total = subtotal + totalVat;
                        
                        firestoreInvoice.subtotal = subtotal;
                        firestoreInvoice.totalVat = totalVat;
                        firestoreInvoice.total = total;
                        
                        // Add VAT to each item
                        firestoreInvoice.items = invoice.items?.map(item => {
                            const itemSubtotal = (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
                            const itemVat = itemSubtotal * 0.05;
                            return {
                                ...item,
                                total: itemSubtotal + itemVat,
                                vat: itemVat
                            };
                        }) || [];
                    } else {
                        // For non-UAE clients, calculate total without VAT
                        const subtotal = invoice.items?.reduce((sum, item) => {
                            const itemPrice = parseFloat(item.price) || 0;
                            const itemQuantity = parseFloat(item.quantity) || 0;
                            return sum + (itemPrice * itemQuantity);
                        }, 0) || 0;
                        
                        firestoreInvoice.subtotal = subtotal;
                        firestoreInvoice.totalVat = 0;
                        firestoreInvoice.total = subtotal;
                        
                        firestoreInvoice.items = invoice.items?.map(item => {
                            const itemSubtotal = (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
                            return {
                                ...item,
                                total: itemSubtotal,
                                vat: 0
                            };
                        }) || [];
                    }
                    
                    const invoiceRef = doc(db, 'invoices', id);
                    await updateDoc(invoiceRef, firestoreInvoice);
                } catch (firebaseError) {
                    console.error('Firebase update error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch(ACTIONS.change(invoice));
        } catch (error) {
            console.error('Error updating invoice:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Function to toggle form to edit existing invoice.
     * @param    {string} index    String with invoice index
     */
    const editInvoice = (index) => {
        dispatch(ACTIONS.edit(index));
        setEditedInvoice(index);
    };

    /**
     * Function to delete invoice.
     */
    const deleteInvoice = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const invoiceId = state.currInvoiceIndex;
            
            // Try to delete from Firebase if not in error state
            if (!state.firebaseError) {
                try {
                    const invoiceRef = doc(db, 'invoices', invoiceId);
                    await deleteDoc(invoiceRef);
                } catch (firebaseError) {
                    console.error('Firebase delete error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch(ACTIONS.remove());
        } catch (error) {
            console.error('Error deleting invoice:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Function to change status of invoice to 'paid'.
     */
    const markInvoiceAsPaid = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const invoiceId = state.currInvoiceIndex;
            
            // Try to update status in Firebase if not in error state
            if (!state.firebaseError) {
                try {
                    const invoiceRef = doc(db, 'invoices', invoiceId);
                    await updateDoc(invoiceRef, { status: 'paid' });
                } catch (firebaseError) {
                    console.error('Firebase mark as paid error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch(ACTIONS.paid());
        } catch (error) {
            console.error('Error marking invoice as paid:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Function to toggle form to create new invoice.
     */
    const createInvoice = () => {
        dispatch(ACTIONS.create());
    };

    /**
     * Function to discard/hide form.
     */
    const discardChanges = () => {
        dispatch(ACTIONS.discard());
        restoreToInitial();
    };

    /**
     * Function to toggle modal.
     * @param    {string} index    String with invoice index
     * @param    {string} name    String with name of modal (available: 'delete' or 'status')
     */
    const toggleModal = (index = null, name = '') => {
        dispatch(ACTIONS.modal(index, name));
    };

    /**
     * Function to set form errors.
     * @param    {object} err    Object with errors
     * @param    {array} msg    Array with error messages
     */
    const setErrors = (err, msg) => {
        dispatch(ACTIONS.errors(err, msg));
    };

    return {
        state,
        invoice,
        senderAddress,
        clientAddress,
        items,
        handleInvoiceChange,
        handleItemsAdd,
        handleItemsRemove,
        handleSubmit,
        editInvoice,
        deleteInvoice,
        markInvoiceAsPaid,
        createInvoice,
        discardChanges,
        toggleModal,
    };
};

export default useManageInvoices;
