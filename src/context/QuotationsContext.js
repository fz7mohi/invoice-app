import React, { useReducer, useEffect, createContext } from 'react';
import { useManageQuotations } from '../hooks/useManageQuotations';
import { quotationsReducer, initialState } from '../store/reducers/quotationsReducer';

// Create the context
export const QuotationsContext = createContext();

export const QuotationsProvider = ({ children }) => {
  const { state, dispatch } = useReducer(quotationsReducer, initialState);
  const {
    addQuotation,
    editQuotation,
    deleteQuotation,
    markQuotationAs,
    refreshQuotations,
  } = useManageQuotations(state, dispatch);

  // Create a function to ensure quotations are loaded
  const ensureQuotationsLoaded = async () => {
    if (!state.quotations || state.quotations.length === 0) {
      console.log("No quotations found in state, refreshing from Firestore");
      await refreshQuotations();
    } else {
      console.log(`${state.quotations.length} quotations already loaded in state`);
    }
  };

  const contextValue = {
    quotationState: state,
    dispatch,
    addQuotation,
    editQuotation,
    deleteQuotation,
    markQuotationAs,
    refreshQuotations,
    ensureQuotationsLoaded,
  };

  // Initial load of quotations
  useEffect(() => {
    console.log('QuotationsProvider: Initial load - calling refreshQuotations');
    refreshQuotations();
  }, []);

  return (
    <QuotationsContext.Provider value={contextValue}>
      {children}
    </QuotationsContext.Provider>
  );
}; 