import * as ACTION_TYPES from '../actions/action_type';

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

export const quotationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
            
        case 'SET_FIREBASE_ERROR':
            return {
                ...state,
                firebaseError: action.payload
            };
            
        case 'SET_QUOTATIONS':
            return {
                ...state,
                quotations: Array.isArray(action.payload) ? action.payload : []
            };
            
        case ACTION_TYPES.ADD_QUOTATION:
            return {
                ...state,
                quotations: [...state.quotations, action.payload.quotation],
                form: {
                    isEditing: false,
                    isCreating: false,
                },
                errors: {
                    isError: false,
                    fields: {},
                    messages: [],
                },
            };

        case ACTION_TYPES.SAVE_QUOTATION_CHANGES:
            return {
                ...state,
                quotations: state.quotations.map((quotation) => 
                    quotation.id === action.payload.quotation.id 
                        ? action.payload.quotation 
                        : quotation
                ),
                form: {
                    isEditing: false,
                    isCreating: false,
                },
                errors: {
                    isError: false,
                    fields: {},
                    messages: [],
                },
            };

        case ACTION_TYPES.EDIT_QUOTATION:
            return {
                ...state,
                form: {
                    isEditing: true,
                    isCreating: false,
                    id: action.payload.id,
                },
            };

        case ACTION_TYPES.CREATE_QUOTATION:
            return {
                ...state,
                form: {
                    isEditing: false,
                    isCreating: true,
                },
                errors: {
                    isError: false,
                    fields: {},
                    messages: [],
                },
            };

        case ACTION_TYPES.DISCARD_QUOTATION:
            return {
                ...state,
                form: {
                    isEditing: false,
                    isCreating: false,
                },
                errors: {
                    isError: false,
                    fields: {},
                    messages: [],
                },
            };

        case ACTION_TYPES.SET_QUOTATION_ERRORS:
            return {
                ...state,
                errors: {
                    isError: true,
                    fields: action.payload.err,
                    messages: action.payload.msg,
                },
            };

        case ACTION_TYPES.TOGGLE_QUOTATION_MODAL:
            console.log('Toggling quotation modal in reducer:', action.payload);
            return {
                ...state,
                modal: {
                    isOpen: true,
                    id: action.payload.id,
                    name: action.payload.name,
                },
            };

        case ACTION_TYPES.APPROVE_QUOTATION:
            return {
                ...state,
                quotations: state.quotations.map((quotation) =>
                    quotation.id === state.modal.id
                        ? { ...quotation, status: 'approved' }
                        : quotation
                ),
                modal: {
                    isOpen: false,
                    id: null,
                    name: null,
                },
            };

        case ACTION_TYPES.DELETE_QUOTATION:
            return {
                ...state,
                quotations: state.quotations.filter(
                    (quotation) => quotation.id !== state.modal.id
                ),
                modal: {
                    isOpen: false,
                    id: null,
                    name: null,
                },
            };

        default:
            return state;
    }
}; 