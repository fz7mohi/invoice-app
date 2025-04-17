import * as ACTION_TYPES from '../actions/action_type';

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

export const internalPOReducer = (state = initialState, action) => {
    if (action.type === 'SET_LOADING') {
        return {
            ...state,
            isLoading: action.payload
        };
    }
    
    if (action.type === 'SET_INTERNAL_POS') {
        return {
            ...state,
            internalPOs: action.payload
        };
    }
    
    if (action.type === 'SET_FIREBASE_ERROR') {
        return {
            ...state,
            firebaseError: action.payload
        };
    }

    if (action.type === ACTION_TYPES.ADD_INTERNAL_PO) {
        const newInternalPO = action.payload;
        const total = newInternalPO.items.reduce((sum, item) => {
            return sum + (parseFloat(item.total) || 0);
        }, 0);

        const newList = [
            {
                ...newInternalPO,
                total,
                grandTotal: newInternalPO.grandTotal || total
            },
            ...state.internalPOs,
        ];

        return { ...state, isFormOpen: false, internalPOs: newList };
    }

    if (action.type === ACTION_TYPES.SAVE_CHANGES) {
        const newList = state.internalPOs.map((item) => {
            if (item.id === state.currInternalPOIndex) {
                const total = action.payload.items.reduce((sum, item) => {
                    return sum + (parseFloat(item.total) || 0);
                }, 0);
                return { 
                    ...action.payload, 
                    status: 'pending',
                    total,
                    grandTotal: action.payload.grandTotal || total
                };
            }
            return item;
        });
        return {
            ...state,
            internalPOs: newList,
            isFormOpen: false,
            isInternalPOEdited: false,
        };
    }

    if (action.type === ACTION_TYPES.EDIT) {
        return {
            ...state,
            isFormOpen: true,
            isInternalPOEdited: true,
            currInternalPOIndex: action.payload.id,
        };
    }

    if (action.type === ACTION_TYPES.DELETE) {
        const newList = state.internalPOs.filter(
            (item) => item.id !== state.currInternalPOIndex
        );
        return {
            ...state,
            internalPOs: newList,
            isModalOpen: {
                status: false,
                name: '',
            },
        };
    }

    if (action.type === ACTION_TYPES.PAID) {
        const newList = state.internalPOs.map((item) => {
            if (item.id === state.currInternalPOIndex) {
                item.status = 'paid';
            }
            return item;
        });

        return {
            ...state,
            internalPOs: newList,
            isModalOpen: {
                status: false,
                name: '',
            },
        };
    }

    if (action.type === ACTION_TYPES.CREATE) {
        return { ...state, isFormOpen: true };
    }

    return state;
}; 