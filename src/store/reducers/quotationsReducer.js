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
};

export const quotationsReducer = (state = initialState, action) => {
    switch (action.type) {
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
                quotations: [
                    ...state.quotations.map((quotation) => {
                        if (quotation.id === action.payload.quotation.id) {
                            return action.payload.quotation;
                        }
                        return quotation;
                    }),
                ],
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

        case ACTION_TYPES.DELETE_QUOTATION:
            return {
                ...state,
                quotations: [
                    ...state.quotations.filter(
                        (quotation) => quotation.id !== state.modal.id
                    ),
                ],
                modal: {
                    isOpen: false,
                    action: null,
                    id: null,
                    name: null,
                },
            };

        case ACTION_TYPES.APPROVE_QUOTATION:
            return {
                ...state,
                quotations: [
                    ...state.quotations.map((quotation) => {
                        if (quotation.id === state.modal.id) {
                            return {
                                ...quotation,
                                status: 'approved',
                            };
                        }
                        return quotation;
                    }),
                ],
                modal: {
                    isOpen: false,
                    action: null,
                    id: null,
                    name: null,
                },
            };

        case ACTION_TYPES.CREATE_QUOTATION:
            return {
                ...state,
                form: {
                    isEditing: false,
                    isCreating: true,
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

        case ACTION_TYPES.TOGGLE_QUOTATION_MODAL:
            return {
                ...state,
                modal: {
                    isOpen: !state.modal.isOpen,
                    action:
                        action.payload.name === 'delete'
                            ? ACTION_TYPES.DELETE_QUOTATION
                            : ACTION_TYPES.APPROVE_QUOTATION,
                    id: action.payload.id,
                    name: action.payload.name,
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

        default:
            return state;
    }
}; 