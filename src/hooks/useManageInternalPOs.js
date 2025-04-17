import { useState, useEffect, useReducer } from 'react';
import { internalPOReducer } from '../store/reducers/internalPOReducer';
import * as ACTIONS from '../store/actions/internalPOActions';
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
 * Function to get internal POs array from localStorage.
 * @return   {object}    Array containing internal POs
 */
const getInternalPOsFromLocalStorage = () => {
    try {
        const storedInternalPOs = localStorage.getItem('internalPOs');
        return storedInternalPOs ? JSON.parse(storedInternalPOs) : [];
    } catch (error) {
        console.error('Error getting internal POs from localStorage:', error);
        return [];
    }
};

/**
 * Function to post internal POs array to localStorage.
 * @param   {object} internalPOs Array with internal POs
 */
const postInternalPOsToLocalStorage = (internalPOs) => {
    try {
        localStorage.setItem('internalPOs', JSON.stringify(internalPOs));
    } catch (error) {
        console.error('Error posting internal POs to localStorage:', error);
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

const initialInternalPO = {
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
    internalPOs: [],
    isFormOpen: false,
    isModalOpen: { status: false, name: '' },
    isInternalPOEdited: false,
    currInternalPOIndex: null,
    errors: { err: {}, msg: [] },
    isLoading: false,
    firebaseError: false
};

/**
 * Generate a unique internal PO ID
 * @returns {string} A unique ID
 */
const generateId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Custom hook to handle managing internal POs and forms using Firebase.
 */
const useManageInternalPOs = () => {
    const [state, dispatch] = useReducer(internalPOReducer, initialState);
    const [internalPO, setInternalPO] = useState(initialInternalPO);
    const [senderAddress, setSenderAddress] = useState(initialAddress);
    const [clientAddress, setClientAddress] = useState(initialAddress);
    const [items, setItems] = useState([]);

    // Update internal PO state everytime dependency array has changed.
    useEffect(() => {
        setInternalPO((oldState) => {
            return { ...oldState, senderAddress, clientAddress, items };
        });
    }, [senderAddress, clientAddress, items]);

    // Load internal POs from Firestore when the component mounts
    useEffect(() => {
        let isMounted = true;
        
        const fetchInternalPOs = async () => {
            if (!isMounted) return;
            
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                // First try to get data from Firestore
                try {
                    const internalPOsCollection = collection(db, 'internalPOs');
                    const internalPOsQuery = query(
                        internalPOsCollection,
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(internalPOsQuery);
                    
                    if (!isMounted) return;
                    
                    const internalPOsList = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        const createdAt = data.createdAt?.toDate() || new Date();
                        const paymentDue = data.paymentDue?.toDate() || new Date();
                        
                        return {
                            id: doc.id,
                            ...data,
                            createdAt,
                            paymentDue
                        };
                    });
                    
                    dispatch({ type: 'SET_INTERNAL_POS', payload: internalPOsList });
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: false });
                } catch (firebaseError) {
                    console.error('Firebase error, falling back to localStorage:', firebaseError);
                    
                    if (!isMounted) return;
                    
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                    
                    // Fallback to localStorage if Firebase fails
                    const localInternalPOs = getInternalPOsFromLocalStorage();
                    dispatch({ type: 'SET_INTERNAL_POS', payload: localInternalPOs });
                }
            } catch (error) {
                console.error('Error loading internal POs:', error);
            } finally {
                if (isMounted) {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            }
        };
        
        fetchInternalPOs();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);
    
    // Save to localStorage as a backup when internal POs change
    useEffect(() => {
        if (state.internalPOs.length > 0) {
            postInternalPOsToLocalStorage(state.internalPOs);
        }
    }, [state.internalPOs]);

    // HANDLERS
    const handleInternalPOChange = (event, type, date, index) => {
        let name = event ? event.target.name : null;
        let value = event ? event.target.value : null;

        switch (type) {
            case 'internalPO':
                setInternalPO({ ...internalPO, [name]: value });
                break;
            case 'senderAddress':
                setSenderAddress({ ...senderAddress, [name]: value });
                break;
            case 'clientAddress':
                setClientAddress({ ...clientAddress, [name]: value });
                break;
            case 'date':
                setInternalPO((oldState) => {
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
                const itemPrice = parseFloat(newItems[index].price) || 0;
                const itemQuantity = parseFloat(newItems[index].quantity) || 0;
                const itemSubtotal = itemPrice * itemQuantity;
                newItems[index]['total'] = itemSubtotal;
                setItems(newItems);
                break;
            default:
                throw new Error('no matching type');
        }
    };

    const handleItemsAdd = () => {
        setItems([...items, { ...initialItems }]);
    };

    const handleItemsRemove = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const setErrors = (err, msg) => {
        dispatch(ACTIONS.errors(err, msg));
    };

    const restoreToInitial = () => {
        setInternalPO(initialInternalPO);
        setClientAddress(initialAddress);
        setSenderAddress(initialAddress);
        setItems([]);
        setErrors({}, []);
    };

    const addInternalPO = async (internalPO, state, type) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            let newInternalPO = { 
                ...internalPO,
                status: type === 'new' ? 'pending' : 'draft',
                id: generateId()
            };
            
            if (!state.firebaseError) {
                try {
                    const { id, ...internalPOData } = internalPO;
                    
                    const firestoreInternalPO = {
                        ...internalPOData,
                        createdAt: Timestamp.fromDate(internalPO.createdAt || new Date()),
                        paymentDue: internalPO.paymentDue ? Timestamp.fromDate(new Date(internalPO.paymentDue)) : null,
                        status: type === 'new' ? 'pending' : 'draft'
                    };
                    
                    const docRef = await addDoc(collection(db, 'internalPOs'), firestoreInternalPO);
                    
                    newInternalPO = {
                        ...internalPO,
                        id: docRef.id,
                        status: type === 'new' ? 'pending' : 'draft'
                    };
                } catch (firebaseError) {
                    console.error('Firebase add error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch(ACTIONS.add(newInternalPO, state, type));
        } catch (error) {
            console.error('Error adding internal PO:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const changeInternalPO = async (internalPO) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            if (!state.firebaseError) {
                try {
                    const { id, ...internalPOData } = internalPO;
                    
                    const firestoreInternalPO = {
                        ...internalPOData,
                        createdAt: Timestamp.fromDate(internalPO.createdAt || new Date()),
                        paymentDue: internalPO.paymentDue ? Timestamp.fromDate(new Date(internalPO.paymentDue)) : null
                    };
                    
                    const internalPORef = doc(db, 'internalPOs', id);
                    await updateDoc(internalPORef, firestoreInternalPO);
                } catch (firebaseError) {
                    console.error('Firebase update error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch(ACTIONS.change(internalPO));
        } catch (error) {
            console.error('Error updating internal PO:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleSubmit = async (event, type) => {
        event.preventDefault();

        if (type === 'add' && formValidation(internalPO, setErrors)) {
            await addInternalPO(internalPO, state, 'new');
            restoreToInitial();
        } else if (type === 'save') {
            await addInternalPO(internalPO, state, 'draft');
            restoreToInitial();
        } else if (type === 'change' && formValidation(internalPO, setErrors)) {
            await changeInternalPO(internalPO);
            restoreToInitial();
        }
    };

    // HELPERS
    const setEditedInternalPO = (index) => {
        const internalPO = state.internalPOs.find((item) => item.id === index);
        if (internalPO) {
            setInternalPO(internalPO);
            setClientAddress(internalPO.clientAddress || initialAddress);
            setSenderAddress(internalPO.senderAddress || initialAddress);
            setItems(internalPO.items || []);
        }
    };

    const editInternalPO = (index) => {
        dispatch(ACTIONS.edit(index));
        setEditedInternalPO(index);
    };

    const deleteInternalPO = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const internalPOId = state.currInternalPOIndex;
            
            if (!state.firebaseError) {
                try {
                    const internalPORef = doc(db, 'internalPOs', internalPOId);
                    await deleteDoc(internalPORef);
                } catch (firebaseError) {
                    console.error('Firebase delete error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch(ACTIONS.remove());
        } catch (error) {
            console.error('Error deleting internal PO:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const markInternalPOAsPaid = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const internalPOId = state.currInternalPOIndex;
            
            if (!state.firebaseError) {
                try {
                    const internalPORef = doc(db, 'internalPOs', internalPOId);
                    await updateDoc(internalPORef, { status: 'paid' });
                } catch (firebaseError) {
                    console.error('Firebase mark as paid error:', firebaseError);
                    dispatch({ type: 'SET_FIREBASE_ERROR', payload: true });
                }
            }
            
            dispatch(ACTIONS.paid());
        } catch (error) {
            console.error('Error marking internal PO as paid:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const createInternalPO = () => {
        dispatch(ACTIONS.create());
    };

    const discardChanges = () => {
        dispatch(ACTIONS.discard());
        restoreToInitial();
    };

    const toggleModal = (index = null, name = '') => {
        dispatch(ACTIONS.modal(index, name));
    };

    return {
        state,
        internalPO,
        senderAddress,
        clientAddress,
        items,
        handleInternalPOChange,
        handleItemsAdd,
        handleItemsRemove,
        handleSubmit,
        editInternalPO,
        deleteInternalPO,
        markInternalPOAsPaid,
        createInternalPO,
        discardChanges,
        toggleModal,
    };
};

export default useManageInternalPOs; 