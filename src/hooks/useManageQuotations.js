import { useState, useEffect, useReducer } from 'react';
import { quotationsReducer } from '../store/reducers/quotationsReducer';
import { add, approved, change, create, discard, edit, errors, modal, remove } from '../store/actions/quotationsActions';
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
    Timestamp,
    limit,
    getDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Function to get quotations array from localStorage.
 * @return   {object}    Array containing quotations
 */
const getQuotationsFromLocalStorage = () => {
    try {
        const storedQuotations = localStorage.getItem('quotations');
        return storedQuotations ? JSON.parse(storedQuotations) : [];
    } catch (error) {
        return [];
    }
};

/**
 * Function to post quotations array to localStorage.
 * @param   {object} quotations Array with quotations
 */
const postQuotationsToLocalStorage = (quotations) => {
    try {
        localStorage.setItem('quotations', JSON.stringify(quotations));
    } catch (error) {
        // Silent error handling
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

const initialQuotation = {
    createdAt: new Date(),
    paymentDue: ``,
    description: '',
    paymentTerms: '30',
    clientName: '',
    clientEmail: '',
    senderAddress: initialAddress,
    clientAddress: {
        street: '',
        city: '',
        postCode: '',
        country: ''
    },
    items: [],
    total: 0,
    currency: 'USD', // Default currency
    termsAndConditions: '',
};

const initialState = {
    quotations: [],
    form: {
        isEditing: false,
        isCreating: false,
    },
    modal: {
        isOpen: false,
        action: null,
        id: null,
        name: null,
    },
    errors: {
        isError: false,
        fields: {},
        messages: [],
    },
    isLoading: false,
    firebaseError: false
};

/**
 * Generate a unique quotation ID in format FTQXXXX where X is a number
 * @returns {string} A unique ID in format FTQXXXX
 */
const generateId = () => {
    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `FTQ${randomNum}`;
};

/**
 * Custom hook to handle managing quotations and forms using Firebase.
 */
const useManageQuotations = () => {
    const [state, dispatch] = useReducer(quotationsReducer, initialState);
    const [quotation, setQuotation] = useState(initialQuotation);
    const [senderAddress, setSenderAddress] = useState(initialAddress);
    const [clientAddress, setClientAddress] = useState(initialAddress);
    const [items, setItems] = useState([]);

    // Load quotations from Firestore when the component mounts
    useEffect(() => {
        let isMounted = true;
        
        const fetchQuotations = async () => {
            if (!isMounted) return;
            
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                if (isMounted) {
                    const quotationsCollection = collection(db, 'quotations');
                    const quotationsQuery = query(
                        quotationsCollection,
                        orderBy('createdAt', 'desc') // Sort by creation date in descending order
                    );
                    const querySnapshot = await getDocs(quotationsQuery);
                    
                    if (!isMounted) return;
                    
                    const quotationsList = querySnapshot.docs.map(doc => {
                        try {
                            const data = doc.data() || {};
                            
                            // Convert Firestore Timestamp back to Date object safely
                            let createdAt = new Date();
                            let paymentDue = new Date();
                            
                            try {
                                createdAt = data.createdAt?.toDate() || new Date();
                            } catch (dateError) {
                                // Silent error handling
                            }
                            
                            try {
                                paymentDue = data.paymentDue?.toDate() || new Date();
                            } catch (dateError) {
                                // Silent error handling
                            }
                            
                            // Handle items specially to ensure they're always an array
                            const items = Array.isArray(data.items) ? data.items : [];
                            
                            // Special handling for quotation status
                            const status = data.status || 'pending';
                            
                            // Explicitly get the currency
                            const currency = data.currency || 'USD';
                            
                            // Create a complete quotation object with all required fields
                            return {
                                ...data,
                                id: doc.id, // Use Firestore doc ID as primary ID
                                customId: data.customId || doc.id, // Keep our custom ID for reference
                                clientName: data.clientName || 'Unnamed Client',
                                clientEmail: data.clientEmail || '',
                                description: data.description || '',
                                status,
                                items,
                                total: parseFloat(data.total) || 0,
                                currency: currency,
                                createdAt,
                                paymentDue
                            };
                        } catch (docError) {
                            // Return a minimal valid document to prevent rendering errors
                            return {
                                id: doc.id,
                                customId: generateId(), // Generate a new customId for invalid documents
                                clientName: 'Error loading client',
                                status: 'error',
                                total: 0,
                                currency: 'USD',
                                createdAt: new Date(),
                                paymentDue: new Date(),
                                items: []
                            };
                        }
                    });
                    
                    dispatch({ type: 'SET_QUOTATIONS', payload: quotationsList });
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: false });
                }
            } catch (error) {
                // Silent error handling
            } finally {
                if (isMounted) {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            }
        };
        
        fetchQuotations();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);
    
    // Save to localStorage as a backup when quotations change
    useEffect(() => {
        if (state.quotations.length > 0) {
            postQuotationsToLocalStorage(state.quotations);
        }
    }, [state.quotations]);

    // HANDLERS
    /**
     * Function to handle user input. Update appropriate state based on type prop given.
     * @param    {object} event    Event (pass false if type === 'date')
     * @param    {string} type    String with state to edit (available: quotation, senderAddress, clientAddress, date or items)
     * @param    {object} date    Date istance. (Pass false if type !== 'date')
     * @param    {number} index    Index of item. (Required only for type 'items')
     */
    const handleQuotationChange = (event, type, date, index) => {
        let name = event ? event.target.name : null;
        let value = event ? event.target.value : null;

        switch (type) {
            case 'quotation':
                setQuotation(prev => ({
                    ...prev,
                    [name]: value
                }));
                break;
            case 'senderAddress':
                setSenderAddress({ ...senderAddress, [name]: value });
                break;
            case 'clientAddress':
                setClientAddress(prev => ({
                    ...prev,
                    [name]: value
                }));
                break;
            case 'date':
                setQuotation({ ...quotation, createdAt: date });
                break;
            case 'fullQuotation':
                // When updating the entire quotation object at once
                setQuotation(event.target.value);
                if (event.target.value.clientAddress) {
                    setClientAddress(event.target.value.clientAddress);
                }
                break;
            case 'items':
                const updatedItems = [...items];
                if (name === 'quantity' || name === 'price') {
                    value = allowOnlyNumbers(value);
                }
                updatedItems[index] = {
                    ...updatedItems[index],
                    [name]: value,
                };
                if (name === 'quantity' || name === 'price') {
                    updatedItems[index].total =
                        updatedItems[index].quantity * updatedItems[index].price;
                }
                setItems(updatedItems);
                break;
            default:
                break;
        }
    };

    /**
     * Add new item to items array.
     */
    const addQuotationItem = () => {
        setItems((oldItems) => [...oldItems, initialItems]);
    };

    /**
     * Remove item from items array.
     * @param    {number} index    Index of item to delete
     */
    const removeQuotationItem = (index) => {
        setItems(items.filter((item, i) => i !== index));
    };

    /**
     * Function to forcefully refresh quotations list from Firestore
     */
    const refreshQuotations = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            // Get data directly from Firestore
            const quotationsCollection = collection(db, 'quotations');
            const quotationsQuery = query(quotationsCollection);
            const querySnapshot = await getDocs(quotationsQuery);
            
            const quotationsList = querySnapshot.docs.map(doc => {
                try {
                    const data = doc.data() || {};
                    
                    // Convert Firestore Timestamp back to Date object safely
                    let createdAt = new Date();
                    let paymentDue = new Date();
                    
                    try {
                        createdAt = data.createdAt?.toDate() || new Date();
                    } catch (dateError) {
                        // Silent error handling
                    }
                    
                    try {
                        paymentDue = data.paymentDue?.toDate() || new Date();
                    } catch (dateError) {
                        // Silent error handling
                    }
                    
                    // Handle items specially to ensure they're always an array
                    const items = Array.isArray(data.items) ? data.items : [];
                    
                    // Special handling for quotation status
                    const status = data.status || 'pending';
                    
                    // Generate a custom ID if none exists
                    const customId = data.customId || generateId();
                    
                    // Explicitly get the currency
                    const currency = data.currency || 'USD';
                    
                    // Create a complete quotation object with all required fields
                    return {
                        ...data,
                        id: doc.id, // Use Firestore doc ID as primary ID
                        customId: customId, // Ensure we always have a customId in our format
                        clientName: data.clientName || 'Unnamed Client',
                        clientEmail: data.clientEmail || '',
                        description: data.description || '',
                        status,
                        items,
                        total: parseFloat(data.total) || 0,
                        currency: currency,
                        createdAt,
                        paymentDue
                    };
                } catch (docError) {
                    // Return a minimal valid document to prevent rendering errors
                    return {
                        id: doc.id,
                        customId: generateId(), // Generate a new customId for invalid documents
                        clientName: 'Error loading client',
                        status: 'error',
                        total: 0,
                        currency: 'USD',
                        createdAt: new Date(),
                        paymentDue: new Date(),
                        items: []
                    };
                }
            });
            
            dispatch({ 
                type: 'SET_QUOTATIONS', 
                payload: quotationsList 
            });
        } catch (error) {
            // Silent error handling
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Form submission handler for creating or updating quotations.
     * @param    {string} type    String type of submitted form. (available: 'new' or 'draft')
     * @return   {Promise}        Promise that resolves when the submission is complete, rejects on errors
     */
    const handleSubmit = async (type) => {
        try {
            // Validate form
            const validationResult = formValidation(quotation, items);
            
            if (validationResult.isError) {
                dispatch(errors(validationResult.err, validationResult.msg));
                return false;
            }

            // Process items for regular submission
            const processedItems = items.map(item => ({
                name: item.name || '',
                description: item.description || '',
                quantity: parseFloat(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
                vat: parseFloat(item.vat) || 0,
                total: parseFloat(item.total) || 0
            }));

            // Calculate total
            const totalAmount = processedItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

            // Check if we're editing an existing quotation
            const isEditing = state.form.isEditing || Boolean(quotation.id || state.modal.id);

            // Create the quotation document
            const quotationDoc = {
                ...quotation,
                items: processedItems,
                total: totalAmount,
                currency: quotation.currency || 'USD',
                termsAndConditions: quotation.termsAndConditions || DEFAULT_TERMS_AND_CONDITIONS
            };

            // Only set these fields for new quotations
            if (!isEditing) {
                quotationDoc.id = generateId();
                quotationDoc.customId = quotationDoc.id;
                quotationDoc.status = type === 'draft' ? 'draft' : 'pending';
                quotationDoc.createdAt = new Date();
                quotationDoc.paymentDue = new Date();
            } else {
                // Preserve the existing ID and customId for editing
                quotationDoc.id = quotation.id || state.modal.id;
                quotationDoc.customId = quotation.customId || quotationDoc.id;
                // Preserve the original status and dates
                quotationDoc.status = quotation.status || 'pending';
                quotationDoc.createdAt = quotation.createdAt || new Date();
                quotationDoc.paymentDue = quotation.paymentDue || new Date();
            }

            try {
                // Create the Firestore document data
                const firestoreDoc = {
                    ...quotationDoc,
                    createdAt: Timestamp.fromDate(quotationDoc.createdAt),
                    paymentDue: Timestamp.fromDate(quotationDoc.paymentDue),
                    // Ensure all required fields are present and properly formatted
                    clientName: quotationDoc.clientName || '',
                    clientEmail: quotationDoc.clientEmail || '',
                    description: quotationDoc.description || '',
                    paymentTerms: quotationDoc.paymentTerms || '30',
                    status: quotationDoc.status || (type === 'draft' ? 'draft' : 'pending'),
                    items: processedItems,
                    total: totalAmount,
                    currency: quotationDoc.currency || 'USD',
                    termsAndConditions: quotationDoc.termsAndConditions || '',
                    clientAddress: quotationDoc.clientAddress || {},
                    senderAddress: quotationDoc.senderAddress || {}
                };

                if (isEditing) {
                    // Update existing document
                    const documentId = quotation.id || state.modal.id;
                    if (!documentId) {
                        throw new Error('No document ID found for editing');
                    }
                    const quotationRef = doc(db, 'quotations', documentId);
                    await updateDoc(quotationRef, firestoreDoc);
                    
                    // Update local state immediately
                    const updatedQuotation = {
                        ...quotationDoc,
                        id: documentId,
                        customId: quotationDoc.customId || documentId,
                        createdAt: quotationDoc.createdAt,
                        paymentDue: quotationDoc.paymentDue
                    };
                    
                    // Update the quotations array in state
                    const updatedQuotations = state.quotations.map(q => 
                        q.id === documentId ? updatedQuotation : q
                    );
                    
                    // Update all relevant state in sequence
                    dispatch({ type: 'SET_QUOTATIONS', payload: updatedQuotations });
                    dispatch(change(updatedQuotation));
                    
                    // Force a refresh of the quotations list
                    await refreshQuotations();
                } else {
                    // Add new document
                    const quotationsRef = collection(db, 'quotations');
                    const docRef = await addDoc(quotationsRef, firestoreDoc);
                    
                    // Update local state for new quotation
                    const newQuotation = {
                        ...quotationDoc,
                        id: docRef.id,
                        customId: quotationDoc.customId || docRef.id
                    };
                    dispatch(add(newQuotation, state, type));
                }
                
                // Reset form and close modal
                resetForm();
                dispatch(discard());
                
                // Final refresh to ensure everything is in sync
                await refreshQuotations();

                return true;
            } catch (firebaseError) {
                throw firebaseError;
            }
            
        } catch (error) {
            dispatch(errors({}, ['Error submitting quotation: ' + error.message]));
            throw error;
        }
    };

    /**
     * Function to handle approving a quotation.
     */
    const handleApprove = async () => {
        try {
            // Find the quotation to approve
            const quotationToApprove = state.quotations.find(
                (q) => q.id === state.modal.id
            );
            
            if (!quotationToApprove) {
                return;
            }
            
            // Update in Firestore
            try {
                const quotationRef = doc(db, 'quotations', quotationToApprove.id);
                await updateDoc(quotationRef, { status: 'approved' });
            } catch (firebaseError) {
                // Will continue with local state update even if Firebase fails
            }
            
            // Update in local state
            dispatch({ type: 'APPROVE_QUOTATION' });
        } catch (error) {
            // Silent error handling
        }
    };

    /**
     * Function to handle deleting a quotation.
     */
    const handleDelete = async () => {
        try {
            // Find the quotation to delete
            const quotationToDelete = state.quotations.find(
                (q) => q.id === state.modal.id
            );
            
            if (!quotationToDelete) {
                return;
            }
            
            // Try to delete from Firestore first
            try {
                const quotationRef = doc(db, 'quotations', quotationToDelete.id);
                await deleteDoc(quotationRef);
            } catch (firebaseError) {
                // Will continue with local state update even if Firebase fails
            }
            
            // Update local state
            dispatch({ type: 'DELETE_QUOTATION' });
        } catch (error) {
            // Silent error handling
        }
    };

    /**
     * Function to edit existing quotation. Get data from quotations state and fill form with it.
     * @param    {string} id    String with quotation ID
     */
    const editQuotation = async (id) => {
        try {
            // Fetch directly from Firestore
            const quotationRef = doc(db, 'quotations', id);
            const docSnap = await getDoc(quotationRef);
            
            if (!docSnap.exists()) {
                return;
            }

            const data = docSnap.data();
            
            // Convert Firestore Timestamp back to Date object safely
            let createdAt = new Date();
            let paymentDue = new Date();
            
            try {
                createdAt = data.createdAt?.toDate() || new Date();
                paymentDue = data.paymentDue?.toDate() || new Date();
            } catch (dateError) {
                // Silent error handling
            }
            
            // Create a complete quotation object
            const quotationToEdit = {
                ...data,
                id: docSnap.id,
                customId: data.customId || docSnap.id,
                createdAt,
                paymentDue,
                items: Array.isArray(data.items) ? data.items : [],
                currency: data.currency || 'USD'
            };
            
            // Set the quotation state
            setQuotation(quotationToEdit);
            
            // Set the items
            if (quotationToEdit.items && quotationToEdit.items.length > 0) {
                setItems(quotationToEdit.items);
            }
            
            // Set addresses
            setSenderAddress(quotationToEdit.senderAddress || initialAddress);
            setClientAddress(quotationToEdit.clientAddress || initialAddress);
            
            // Finally dispatch the edit action
            dispatch({ type: 'EDIT_QUOTATION', payload: { id } });
            
        } catch (error) {
            // Silent error handling
        }
    };

    // Remove the useEffect that updates quotation state since we're handling it directly
    useEffect(() => {
        // Only update quotation state if items change
        if (items.length > 0) {
            setQuotation(prev => ({
                ...prev,
                items: items
            }));
        }
    }, [items]);

    /**
     * Function to reset form back to initial state.
     */
    const resetForm = () => {
        setQuotation(initialQuotation);
        setSenderAddress(initialAddress);
        setClientAddress(initialAddress);
        setItems([]);
    };

    /**
     * Function to discard changes to quotation. Resets form state.
     */
    const discardChanges = () => {
        resetForm();
        dispatch({ type: 'DISCARD_QUOTATION' });
    };

    /**
     * Function to toggle modal.
     * @param    {string} id    String with quotation ID
     * @param    {string} name    String with action name (delete or approve)
     */
    const toggleModal = (id, name) => {
        // If we have an ID and name, we're opening the modal
        // If we don't have an ID or name, we're closing it
        const isOpening = Boolean(id && name);
        dispatch(modal(isOpening ? id : null, isOpening ? name : null));
    };

    /**
     * Function to create a new quotation.
     */
    const createQuotation = () => {
        // Generate a custom ID immediately
        const newCustomId = generateId();
        
        // Make sure we're starting with a proper client address structure
        const properClientAddress = {
            street: '',
            city: '',
            postCode: '',
            country: ''
        };
        
        // Reset form with guaranteed properly structured objects
        setQuotation({
            ...initialQuotation,
            customId: newCustomId,
            clientAddress: properClientAddress
        });
        setSenderAddress({...initialAddress});
        setClientAddress(properClientAddress);
        setItems([]);
        
        // Add first blank item row
        addQuotationItem();
        
        dispatch({ type: 'CREATE_QUOTATION' });
    };

    /**
     * Add new item to items array - direct implementation for component use
     */
    const addNewItem = () => {
        try {
            setItems(oldItems => [...oldItems, initialItems]);
        } catch (error) {
            // Silent error handling
        }
    };

    /**
     * Remove item from items array - direct implementation for component use
     * @param {number} index Index of item to delete
     */
    const removeItemAtIndex = (index) => {
        try {
            setItems(oldItems => oldItems.filter((_, i) => i !== index));
        } catch (error) {
            // Silent error handling
        }
    };

    return {
        state,
        dispatch,
        quotation,
        senderAddress,
        clientAddress,
        items,
        handleQuotationChange,
        handleSubmit,
        addQuotationItem,
        removeQuotationItem,
        refreshQuotations,
        handleApprove,
        handleDelete,
        editQuotation,
        resetForm,
        discardChanges,
        toggleModal,
        createQuotation,
        addNewItem,
        removeItemAtIndex,
        setItems
    };
};

export default useManageQuotations; 