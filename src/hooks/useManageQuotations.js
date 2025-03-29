import { useState, useEffect, useReducer } from 'react';
import { quotationsReducer } from '../store/reducers/quotationsReducer';
import * as ACTIONS from '../store/actions/quotationsActions';
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
 * Function to get quotations array from localStorage.
 * @return   {object}    Array containing quotations
 */
const getQuotationsFromLocalStorage = () => {
    try {
        const storedQuotations = localStorage.getItem('quotations');
        return storedQuotations ? JSON.parse(storedQuotations) : [];
    } catch (error) {
        console.error('Error getting quotations from localStorage:', error);
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
        console.error('Error posting quotations to localStorage:', error);
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
    clientAddress: initialAddress,
    items: [],
    total: 0,
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
 * Generate a unique quotation ID
 * @returns {string} A unique ID
 */
const generateId = () => {
    return 'QT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
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

    // Update quotation state everytime dependency array has changed.
    useEffect(() => {
        setQuotation((oldState) => {
            return { ...oldState, senderAddress, clientAddress, items };
        });
    }, [senderAddress, clientAddress, items]);

    // Load quotations from Firestore when the component mounts
    useEffect(() => {
        let isMounted = true;
        
        const fetchQuotations = async () => {
            if (!isMounted) return;
            
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                // First try to get data from Firestore
                try {
                    const quotationsCollection = collection(db, 'quotations');
                    const quotationsQuery = query(quotationsCollection);
                    const querySnapshot = await getDocs(quotationsQuery);
                    
                    if (!isMounted) return;
                    
                    const quotationsList = querySnapshot.docs.map(doc => {
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
                    
                    dispatch({ type: 'SET_QUOTATIONS', payload: quotationsList });
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: false });
                } catch (firebaseError) {
                    console.error('Firebase error, falling back to localStorage:', firebaseError);
                    
                    if (!isMounted) return;
                    
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                    
                    // Fallback to localStorage if Firebase fails
                    const localQuotations = getQuotationsFromLocalStorage();
                    dispatch({ type: 'SET_QUOTATIONS', payload: localQuotations });
                }
            } catch (error) {
                console.error('Error loading quotations:', error);
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
                setQuotation({ ...quotation, [name]: value });
                break;
            case 'senderAddress':
                setSenderAddress({ ...senderAddress, [name]: value });
                break;
            case 'clientAddress':
                setClientAddress({ ...clientAddress, [name]: value });
                break;
            case 'date':
                setQuotation({ ...quotation, createdAt: date });
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
    const addItem = () => {
        setItems((oldItems) => [...oldItems, initialItems]);
    };

    /**
     * Remove item from items array.
     * @param    {number} index    Index of item to delete
     */
    const removeItem = (index) => {
        setItems(items.filter((item, i) => i !== index));
    };

    /**
     * Form submission handler for creating or updating quotations.
     * @param    {string} type    String type of submitted form. (available: 'new' or 'draft')
     */
    const handleSubmit = async (type) => {
        // Generate new ID for new quotations
        if (!quotation.id) {
            quotation.id = generateId();
        }

        // Calculate total
        const totalAmount = items.reduce((acc, item) => acc + item.total, 0);
        quotation.total = totalAmount;

        // Validate form
        const validation = formValidation(quotation, items);

        if (validation.isError) {
            dispatch({ 
                type: 'SET_QUOTATION_ERRORS', 
                payload: { 
                    err: validation.err, 
                    msg: validation.msg 
                } 
            });
            return;
        }

        try {
            // If editing existing quotation
            if (state.form.isEditing) {
                const quotationToUpdate = { ...quotation };
                
                // Update in Firestore
                try {
                    // Convert Date objects to Firestore Timestamps
                    const firestoreQuotation = {
                        ...quotationToUpdate,
                        createdAt: Timestamp.fromDate(quotationToUpdate.createdAt),
                        paymentDue: Timestamp.fromDate(
                            new Date(quotationToUpdate.createdAt.setDate(
                                quotationToUpdate.createdAt.getDate() + 
                                parseInt(quotationToUpdate.paymentTerms)
                            ))
                        )
                    };
                    
                    // Use the document ID from the quotation
                    const quotationRef = doc(db, 'quotations', quotationToUpdate.id);
                    await updateDoc(quotationRef, firestoreQuotation);
                    
                    dispatch({ 
                        type: 'SAVE_QUOTATION_CHANGES', 
                        payload: { quotation: quotationToUpdate } 
                    });
                } catch (firebaseError) {
                    console.error('Firebase update error:', firebaseError);
                    // Fallback to local state update
                    dispatch({ 
                        type: 'SAVE_QUOTATION_CHANGES', 
                        payload: { quotation: quotationToUpdate } 
                    });
                }
            } else {
                // Adding new quotation
                try {
                    // Prepare the quotation with Firestore Timestamps
                    const newQuotation = { ...quotation };
                    const paymentDueDate = new Date(newQuotation.createdAt);
                    paymentDueDate.setDate(
                        paymentDueDate.getDate() + parseInt(newQuotation.paymentTerms)
                    );
                    
                    const firestoreQuotation = {
                        ...newQuotation,
                        status: type === 'new' ? 'pending' : 'draft',
                        createdAt: Timestamp.fromDate(newQuotation.createdAt),
                        paymentDue: Timestamp.fromDate(paymentDueDate)
                    };
                    
                    // Add to Firestore
                    const docRef = await addDoc(collection(db, 'quotations'), firestoreQuotation);
                    
                    // Update local state with the new quotation
                    dispatch({ 
                        type: 'ADD_QUOTATION', 
                        payload: {
                            quotation: {
                                ...newQuotation,
                                id: docRef.id,
                                status: type === 'new' ? 'pending' : 'draft'
                            }
                        }
                    });
                } catch (firebaseError) {
                    console.error('Firebase add error:', firebaseError);
                    // Fallback to local state update
                    dispatch({ 
                        type: 'ADD_QUOTATION', 
                        payload: {
                            quotation: {
                                ...quotation,
                                status: type === 'new' ? 'pending' : 'draft'
                            }
                        }
                    });
                }
            }
            
            // Reset form after successful submission
            resetForm();
        } catch (error) {
            console.error('Error saving quotation:', error);
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
                console.error('Quotation not found');
                return;
            }
            
            // Update in Firestore
            try {
                const quotationRef = doc(db, 'quotations', quotationToApprove.id);
                await updateDoc(quotationRef, { status: 'approved' });
            } catch (firebaseError) {
                console.error('Firebase approve error:', firebaseError);
                // Will continue with local state update even if Firebase fails
            }
            
            // Update in local state
            dispatch({ type: 'APPROVE_QUOTATION' });
        } catch (error) {
            console.error('Error approving quotation:', error);
        }
    };

    /**
     * Function to handle deleting a quotation.
     */
    const handleDelete = async () => {
        try {
            // Try to delete from Firestore first
            try {
                const quotationRef = doc(db, 'quotations', state.modal.id);
                await deleteDoc(quotationRef);
            } catch (firebaseError) {
                console.error('Firebase delete error:', firebaseError);
                // Will continue with local state update even if Firebase fails
            }
            
            // Update local state
            dispatch({ type: 'DELETE_QUOTATION' });
        } catch (error) {
            console.error('Error deleting quotation:', error);
        }
    };

    /**
     * Function to edit existing quotation. Get data from quotations state and fill form with it.
     * @param    {string} id    String with quotation ID
     */
    const editQuotation = (id) => {
        const quotationToEdit = state.quotations.find((q) => q.id === id);
        if (!quotationToEdit) return;
        
        setQuotation(quotationToEdit);
        setSenderAddress(quotationToEdit.senderAddress);
        setClientAddress(quotationToEdit.clientAddress);
        setItems(quotationToEdit.items);
        
        dispatch({ type: 'EDIT_QUOTATION', payload: { id } });
    };

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
        dispatch({ type: 'TOGGLE_QUOTATION_MODAL', payload: { id, name } });
    };

    /**
     * Function to create a new quotation.
     */
    const createQuotation = () => {
        resetForm();
        addItem(); // Add first blank item row
        dispatch({ type: 'CREATE_QUOTATION' });
    };

    return {
        state,
        quotation,
        senderAddress,
        clientAddress,
        items,
        handleQuotationChange,
        addItem,
        removeItem,
        handleSubmit,
        handleApprove,
        handleDelete,
        editQuotation,
        discardChanges,
        toggleModal,
        createQuotation,
    };
};

export default useManageQuotations; 