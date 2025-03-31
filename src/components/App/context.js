import React, { useState, useEffect, useContext } from 'react';
import Provider from '../shared/Provider/Provider';
import useThemeToggle from '../../hooks/useThemeToggle';
import useManageInvoices from '../../hooks/useManageInvoices';
import useManageClients from '../../hooks/useManageClients';
import useManageQuotations from '../../hooks/useManageQuotations';
import useFilter from '../../hooks/useFilter';

// Fortune Gifts brand colors
export const fortuneGiftsTheme = {
    primary: '#004359',
    secondary: '#000000',
    accent: '#FF4806',
    primaryLight: '#005E7C',
    accentLight: '#FF6D3C'
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const { theme, toggleTheme } = useThemeToggle();
    const {
        state: invoiceState,
        invoice,
        senderAddress,
        clientAddress,
        items,
        handleInvoiceChange,
        addItem,
        removeItem,
        handleSubmit,
        handleMarkAsPaid,
        handleDelete,
        editInvoice,
        discardChanges,
        toggleModal,
        createInvoice,
    } = useManageInvoices();

    const {
        state: quotationState,
        quotation,
        handleQuotationChange,
        handleSubmit: handleQuotationSubmit,
        handleApprove,
        handleDelete: handleQuotationDelete,
        editQuotation,
        discardChanges: discardQuotationChanges,
        toggleModal: toggleQuotationModal,
        createQuotation,
        addQuotationItem,
        removeQuotationItem,
        setItems,
        addNewItem,
        removeItemAtIndex,
        refreshQuotations
    } = useManageQuotations();

    const {
        state: clientState,
        client,
        handleClientChange,
        handleSubmit: handleClientSubmit,
        editClient,
        discardClientChanges,
        toggleClientModal,
        createClient,
        handleClientDelete,
        toggleForm,
    } = useManageClients();

    const { filteredInvoices, filterType, changeFilterType } = useFilter(invoiceState);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    /**
     * Listen for window resize and call handleResize function
     */
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    /**
     * Assign window width value to a windowWidth state.
     */
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        if (typeof refreshQuotations === 'function') {
            refreshQuotations();
        }
    }, []);

    return (
        <AppContext.Provider
            value={{
                theme,
                toggleTheme,
                windowWidth,
                setWindowWidth,
                invoiceState,
                invoice,
                senderAddress,
                clientAddress,
                items,
                handleInvoiceChange,
                addItem,
                removeItem,
                handleSubmit,
                handleMarkAsPaid,
                handleDelete,
                editInvoice,
                discardChanges,
                toggleModal,
                createInvoice,
                quotationState,
                quotation,
                handleQuotationChange,
                handleQuotationSubmit,
                handleApprove,
                handleQuotationDelete,
                editQuotation,
                discardQuotationChanges,
                toggleQuotationModal,
                createQuotation,
                addQuotationItem,
                removeQuotationItem,
                setItems,
                addNewItem,
                removeItemAtIndex,
                clientState,
                client,
                handleClientChange,
                handleClientSubmit,
                editClient,
                discardClientChanges,
                toggleClientModal,
                createClient,
                handleClientDelete,
                toggleForm,
                filteredInvoices,
                filterType,
                changeFilterType,
                refreshQuotations,
                fortuneGiftsTheme
            }}
        >
            <Provider themeColor={theme}>{children}</Provider>
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppProvider };
