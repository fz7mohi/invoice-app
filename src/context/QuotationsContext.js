import React, { useReducer, useEffect, createContext } from 'react';
import { useManageQuotations } from '../hooks/useManageQuotations';
import { quotationsReducer, initialState } from '../store/reducers/quotationsReducer';

// Create the context
export const QuotationsContext = createContext();

export const QuotationsProvider = ({ children }) => {
  const {
    state,
    dispatch,
    quotation,
    senderAddress,
    clientAddress,
    items,
    handleQuotationChange,
    handleSubmit,
    addQuotationItem,
    removeQuotationItem,
    refreshQuotations,
    handleApprove,
    handleDelete,
    editQuotation,
    resetForm,
    discardChanges,
    toggleModal,
    createQuotation,
    addNewItem,
    removeItemAtIndex,
    setItems
  } = useManageQuotations();

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
    quotation,
    senderAddress,
    clientAddress,
    items,
    handleQuotationChange,
    handleQuotationSubmit: handleSubmit,
    addQuotationItem,
    removeQuotationItem,
    refreshQuotations,
    handleApprove,
    handleDelete,
    editQuotation,
    resetForm,
    discardQuotationChanges: discardChanges,
    toggleQuotationModal: toggleModal,
    createQuotation,
    addNewItem,
    removeItemAtIndex,
    setItems,
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