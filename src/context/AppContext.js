import React, { createContext, useContext, useReducer } from 'react';
import { internalPOReducer } from '../store/reducers/internalPOReducer';
import { useManageInternalPOs } from '../hooks/useManageInternalPOs';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(internalPOReducer, {
        internalPOs: [],
        loading: false,
        error: null
    });

    const { 
        internalPOs,
        loading,
        error,
        handleAddInternalPO,
        handleEditInternalPO,
        handleDeleteInternalPO,
        handleMarkAsPaid
    } = useManageInternalPOs(state, dispatch);

    return (
        <AppContext.Provider value={{
            internalPOs,
            loading,
            error,
            handleAddInternalPO,
            handleEditInternalPO,
            handleDeleteInternalPO,
            handleMarkAsPaid
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
}; 