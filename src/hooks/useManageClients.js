import { useState, useEffect, useReducer } from 'react';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    doc, 
    orderBy, 
    query 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Function to get clients array from localStorage.
 * @return   {object}    Array containing clients
 */
const getClientsFromLocalStorage = () => {
    try {
        const storedClients = localStorage.getItem('clients');
        return storedClients ? JSON.parse(storedClients) : [];
    } catch (error) {
        console.error('Error getting clients from localStorage:', error);
        return [];
    }
};

/**
 * Function to post clients array to localStorage.
 * @param   {object} clients Array with clients
 */
const postClientsToLocalStorage = (clients) => {
    try {
        localStorage.setItem('clients', JSON.stringify(clients));
    } catch (error) {
        console.error('Error posting clients to localStorage:', error);
    }
};

// Initial state values
const initialClient = {
    id: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    trnNumber: '',
    vatPercentage: '5'
};

const initialState = {
    clients: [],
    isFormOpen: false,
    isModalOpen: { status: false, name: '' },
    isClientEdited: false,
    currClientIndex: null,
    errors: { err: {}, msg: [] },
    isLoading: false,
    firebaseError: false
};

// Simple client reducer
const clientsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CLIENTS':
            return { ...state, clients: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_FIREBASE_ERROR':
            return { ...state, firebaseError: action.payload };
        case 'ADD_CLIENT':
            return { 
                ...state, 
                clients: [...state.clients, action.payload],
                isFormOpen: false
            };
        case 'UPDATE_CLIENT':
            return { 
                ...state, 
                clients: state.clients.map(client => 
                    client.id === action.payload.id ? action.payload : client
                ),
                isFormOpen: false,
                isClientEdited: false
            };
        case 'DELETE_CLIENT':
            return { 
                ...state, 
                clients: state.clients.filter(client => client.id !== action.payload),
                isModalOpen: { status: false, name: '' }
            };
        case 'TOGGLE_FORM':
            return { 
                ...state, 
                isFormOpen: !state.isFormOpen,
                isClientEdited: false,
                currClientIndex: null
            };
        case 'EDIT_CLIENT':
            return { 
                ...state, 
                isFormOpen: true,
                isClientEdited: true,
                currClientIndex: action.payload
            };
        case 'TOGGLE_MODAL':
            return { 
                ...state, 
                isModalOpen: { 
                    status: !state.isModalOpen.status, 
                    name: action.payload 
                },
                currClientIndex: action.payload ? action.payload : state.currClientIndex
            };
        case 'SET_ERRORS':
            return { 
                ...state, 
                errors: {
                    err: action.payload.err,
                    msg: action.payload.msg
                }
            };
        default:
            return state;
    }
};

/**
 * Custom hook to handle managing clients and forms using Firebase.
 */
const useManageClients = () => {
    const [state, dispatch] = useReducer(clientsReducer, initialState);
    const [client, setClient] = useState(initialClient);

    // Load clients from Firestore when the component mounts
    useEffect(() => {
        let isMounted = true;
        
        const fetchClients = async () => {
            if (!isMounted) return;
            
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                // First try to get data from Firestore
                try {
                    const clientsCollection = collection(db, 'clients');
                    const clientsQuery = query(clientsCollection, orderBy('companyName'));
                    const querySnapshot = await getDocs(clientsQuery);
                    
                    if (!isMounted) return;
                    
                    const clientsList = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    
                    dispatch({ type: 'SET_CLIENTS', payload: clientsList });
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: false });
                } catch (firebaseError) {
                    console.error('Firebase error, falling back to localStorage:', firebaseError);
                    
                    if (!isMounted) return;
                    
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                    
                    // Fallback to localStorage if Firebase fails
                    const localClients = getClientsFromLocalStorage();
                    dispatch({ type: 'SET_CLIENTS', payload: localClients });
                }
            } catch (error) {
                console.error('Error loading clients:', error);
            } finally {
                if (isMounted) {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            }
        };
        
        fetchClients();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    // Save to localStorage as a backup when clients change
    useEffect(() => {
        if (state.clients.length > 0) {
            postClientsToLocalStorage(state.clients);
        }
    }, [state.clients]);

    // HANDLERS
    /**
     * Function to handle client form input changes
     * @param {object} event - The input change event
     */
    const handleClientChange = (event) => {
        const { name, value } = event.target;
        setClient({ ...client, [name]: value });
    };

    /**
     * Function to generate a unique ID for new clients
     * @returns {string} A unique ID
     */
    const generateId = () => {
        return 'CL' + Math.random().toString(36).substring(2, 9).toUpperCase();
    };

    /**
     * Validate client form data
     * @param {object} client - The client data to validate
     * @returns {boolean} Whether the client data is valid
     */
    const validateClient = (client) => {
        const errors = {};
        const errorMessages = [];
        
        if (!client.companyName.trim()) {
            errors.companyName = true;
            errorMessages.push('Company name is required');
        }
        
        if (!client.email.trim()) {
            errors.email = true;
            errorMessages.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(client.email)) {
            errors.email = true;
            errorMessages.push('Email is invalid');
        }
        
        if (!client.phone.trim()) {
            errors.phone = true;
            errorMessages.push('Phone number is required');
        }
        
        if (!client.address.trim()) {
            errors.address = true;
            errorMessages.push('Address is required');
        }
        
        if (!client.country) {
            errors.country = true;
            errorMessages.push('Country is required');
        }
        
        // Check UAE-specific fields
        if (client.country === 'United Arab Emirates') {
            if (!client.trnNumber.trim()) {
                errors.trnNumber = true;
                errorMessages.push('TRN Number is required for UAE');
            }
            
            if (!client.vatPercentage.trim()) {
                errors.vatPercentage = true;
                errorMessages.push('VAT Percentage is required for UAE');
            } else if (isNaN(parseFloat(client.vatPercentage))) {
                errors.vatPercentage = true;
                errorMessages.push('VAT Percentage must be a number');
            }
        }
        
        // Set errors if any
        if (Object.keys(errors).length > 0) {
            setErrors(errors, errorMessages);
            return false;
        }
        
        return true;
    };

    /**
     * Function to submit client form
     * @param {object} event - The form submit event
     * @param {string} type - The type of submission ('add' or 'edit')
     */
    const handleSubmit = async (event, type) => {
        event.preventDefault();
        
        if (type === 'add' && validateClient(client)) {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                // Create a new client object
                let newClient = { ...client };
                
                // Try to add to Firebase if not in error state
                if (!state.firebaseError) {
                    try {
                        const { id, ...clientData } = client;
                        const docRef = await addDoc(collection(db, 'clients'), clientData);
                        newClient = {
                            ...clientData,
                            id: docRef.id
                        };
                    } catch (firebaseError) {
                        console.error('Firebase add error, using local ID:', firebaseError);
                        dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                        newClient = {
                            ...client,
                            id: generateId()
                        };
                    }
                } else {
                    // If Firebase is in error state, use local ID
                    newClient = {
                        ...client,
                        id: generateId()
                    };
                }
                
                dispatch({ type: 'ADD_CLIENT', payload: newClient });
                resetForm();
            } catch (error) {
                console.error('Error adding client:', error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } else if (type === 'edit' && validateClient(client)) {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                // Try to update in Firebase if not in error state
                if (!state.firebaseError) {
                    try {
                        const { id, ...clientData } = client;
                        const clientRef = doc(db, 'clients', id);
                        await updateDoc(clientRef, clientData);
                    } catch (firebaseError) {
                        console.error('Firebase update error:', firebaseError);
                        dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                    }
                }
                
                dispatch({ type: 'UPDATE_CLIENT', payload: client });
                resetForm();
            } catch (error) {
                console.error('Error updating client:', error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
    };

    /**
     * Reset the client form
     */
    const resetForm = () => {
        setClient(initialClient);
        setErrors({}, []);
    };

    /**
     * Set the current client for editing
     * @param {string} id - The ID of the client to edit
     */
    const editClient = (id) => {
        dispatch({ type: 'EDIT_CLIENT', payload: id });
        const clientToEdit = state.clients.find(client => client.id === id);
        if (clientToEdit) {
            setClient(clientToEdit);
        }
    };

    /**
     * Delete a client
     */
    const deleteClient = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const clientId = state.currClientIndex;
            
            // Try to delete from Firebase if not in error state
            if (!state.firebaseError) {
                try {
                    const clientRef = doc(db, 'clients', clientId);
                    await deleteDoc(clientRef);
                } catch (firebaseError) {
                    console.error('Firebase delete error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch({ type: 'DELETE_CLIENT', payload: clientId });
        } catch (error) {
            console.error('Error deleting client:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Toggle the client form
     */
    const toggleForm = () => {
        console.log('toggleForm called');
        console.log('Previous state:', state);
        dispatch({ type: 'TOGGLE_FORM' });
        resetForm();
        console.log('New state:', state);
    };

    /**
     * Toggle the confirmation modal
     * @param {string} id - The ID of the client (optional)
     */
    const toggleModal = (id = null) => {
        dispatch({ type: 'TOGGLE_MODAL', payload: id });
    };

    /**
     * Set form validation errors
     * @param {object} err - The error object
     * @param {array} msg - Array of error messages
     */
    const setErrors = (err, msg) => {
        dispatch({ 
            type: 'SET_ERRORS', 
            payload: { err, msg } 
        });
    };

    /**
     * Function to add multiple clients at once (for import functionality)
     * @param {Array} newClients - Array of client objects to add
     */
    const addClients = async (newClients) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            // Process each client
            for (const newClient of newClients) {
                // Skip if required fields are missing
                if (!newClient.companyName || !newClient.email) {
                    console.warn('Skipping client due to missing required fields:', newClient);
                    continue;
                }

                // Clean and prepare client data
                const cleanedClient = {
                    companyName: newClient.companyName || '',
                    email: newClient.email || '',
                    phone: newClient.phone || '',
                    address: newClient.address || '',
                    country: newClient.country || '',
                    trnNumber: newClient.trnNumber || '',
                    vatPercentage: newClient.vatPercentage || '5',
                    createdAt: new Date()
                };
                
                // Generate a unique ID for each client
                const clientWithId = {
                    ...cleanedClient,
                    id: generateId()
                };
                
                // Add to Firestore
                try {
                    const docRef = await addDoc(collection(db, 'clients'), cleanedClient);
                    clientWithId.id = docRef.id; // Update with Firestore ID
                } catch (firebaseError) {
                    console.error('Firebase error adding client:', firebaseError);
                    // Continue with local ID if Firestore fails
                }
                
                // Add to local state
                dispatch({ type: 'ADD_CLIENT', payload: clientWithId });
            }
            
            dispatch({ type: 'SET_FIREBASE_ERROR', payload: false });
        } catch (error) {
            console.error('Error adding clients:', error);
            dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return {
        state,
        client,
        handleClientChange,
        handleSubmit,
        editClient,
        handleClientDelete: deleteClient,
        toggleForm,
        toggleClientModal: toggleModal,
        setErrors,
        addClients
    };
};

export default useManageClients; 