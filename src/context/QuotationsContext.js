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

  const contextValue = {
    quotationState: state,
    dispatch,
    addQuotation,
    editQuotation,
    deleteQuotation,
    markQuotationAs,
    refreshQuotations,
  };

  // Only fetch quotations once on mount
  useEffect(() => {
    refreshQuotations();
  }, []);

  return (
    <QuotationsContext.Provider value={contextValue}>
      {children}
    </QuotationsContext.Provider>
  );
}; 