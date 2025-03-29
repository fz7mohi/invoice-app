import { useState, useEffect, useReducer } from 'react';

/**
 * Function to get clients array from localStorage.
 * @return   {object}    Array containing clients
 */
const getClientsFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('clients')) || [];
};

/**
 * Function to post clients array to localStorage.
 * @param   {object} clients Array with clients
 */
const postClientsToLocalStorage = (clients) => {
    localStorage.setItem('clients', JSON.stringify(clients));
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
    clients: getClientsFromLocalStorage(),
    isFormOpen: false,
    isModalOpen: { status: false, name: '' },
    isClientEdited: false,
    currClientIndex: null,
    errors: { err: {}, msg: [] },
};

// Simple client reducer
const clientsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CLIENTS':
            return { ...state, clients: action.payload };
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
 * Custom hook to handle managing clients and forms.
 */
const useManageClients = () => {
    const [state, dispatch] = useReducer(clientsReducer, initialState);
    const [client, setClient] = useState(initialClient);

    // Call postClientsToLocalStorage fn every time clients state has changed
    useEffect(() => {
        postClientsToLocalStorage(state.clients);
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
    const handleSubmit = (event, type) => {
        event.preventDefault();
        
        if (type === 'add' && validateClient(client)) {
            const newClient = {
                ...client,
                id: generateId()
            };
            dispatch({ type: 'ADD_CLIENT', payload: newClient });
            resetForm();
        } else if (type === 'edit' && validateClient(client)) {
            dispatch({ type: 'UPDATE_CLIENT', payload: client });
            resetForm();
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
    const deleteClient = () => {
        dispatch({ type: 'DELETE_CLIENT', payload: state.currClientIndex });
    };

    /**
     * Toggle the client form
     */
    const toggleForm = () => {
        dispatch({ type: 'TOGGLE_FORM' });
        resetForm();
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

    return {
        state,
        client,
        handleClientChange,
        handleSubmit,
        editClient,
        deleteClient,
        toggleForm,
        toggleModal,
        setErrors
    };
};

export default useManageClients; 