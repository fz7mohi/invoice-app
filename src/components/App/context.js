import React, { useState, useEffect, useContext } from 'react';
import Provider from '../shared/Provider/Provider';
import useThemeToggle from '../../hooks/useThemeToggle';
import useManageInvoices from '../../hooks/useManageInvoices';
import useManageClients from '../../hooks/useManageClients';
import useManageQuotations from '../../hooks/useManageQuotations';
import useManageDeliveryOrders from '../../hooks/useManageDeliveryOrders';
import useManageInternalPOs from '../../hooks/useManageInternalPOs';
import useFilter from '../../hooks/useFilter';
import { useHistory } from 'react-router-dom';

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
        state: internalPOState,
        internalPO,
        handleInternalPOChange,
        handleSubmit: handleInternalPOSubmit,
        handleMarkAsPaid: handleInternalPOMarkAsPaid,
        handleDelete: handleInternalPODelete,
        editInternalPO,
        discardChanges: discardInternalPOChanges,
        toggleModal: toggleInternalPOModal,
        createInternalPO,
        addInternalPOItem,
        removeInternalPOItem,
        handleItemsAdd,
        handleItemsRemove,
        createFromInvoice
    } = useManageInternalPOs();

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
        state: deliveryOrderState,
        refreshDeliveryOrders,
        createDeliveryOrder,
        updateDeliveryOrder
    } = useManageDeliveryOrders();

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
        addClients
    } = useManageClients();

    const { filteredInvoices, filterType, changeFilterType } = useFilter(invoiceState);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const history = useHistory();

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

    // Add effect to track quotationState changes
    useEffect(() => {
        // If isCreating is true, ensure the modal is open
        if (quotationState?.form?.isCreating === true) {
            // Handle creating state silently
        }
    }, [quotationState]);

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
                internalPOState,
                internalPO,
                handleInternalPOChange,
                handleInternalPOSubmit,
                handleInternalPOMarkAsPaid,
                handleInternalPODelete,
                editInternalPO,
                discardInternalPOChanges,
                toggleInternalPOModal,
                createInternalPO,
                addInternalPOItem,
                removeInternalPOItem,
                handleItemsAdd,
                handleItemsRemove,
                createFromInvoice,
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
                addClients,
                filteredInvoices,
                filterType,
                changeFilterType,
                refreshQuotations,
                deliveryOrderState,
                refreshDeliveryOrders,
                createDeliveryOrder,
                updateDeliveryOrder,
                fortuneGiftsTheme,
                createFromInvoice
            }}
        >
            <Provider themeColor={theme}>{children}</Provider>
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within an AppProvider');
    }
    return context;
};

export { AppProvider };
