import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import Wrapper from '../Wrapper/Wrapper';
import Header from '../Header/Header';
import Invoices from '../Invoices/Invoices';
import Clients from '../Clients/Clients';
import Quotations from '../Quotations/Quotations';
import Receipts from '../Receipts/Receipts';
import DeliveryOrders from '../DeliveryOrders/DeliveryOrders';
import NewDeliveryOrder from '../DeliveryOrders/NewDeliveryOrder/NewDeliveryOrder';
import DeliveryOrderView from '../DeliveryOrders/DeliveryOrderView/DeliveryOrderView';
import FormController from '../FormController/FormController';
import ClientFormController from '../ClientFormController/ClientFormController';
import QuotationFormController from '../QuotationFormController/QuotationFormController';
import InvoiceView from '../InvoiceView/InvoiceView';
import ReceiptView from '../ReceiptView/ReceiptView';
import Modal from '../Modal/Modal';
import RouteError from '../RouteError/RouteError';
import { useGlobalContext } from './context';
import { AnimatePresence } from 'framer-motion';
import QuotationView from '../QuotationView/QuotationView';
import Settings from '../Settings/Settings';
import Dashboard from '../Dashboard/Dashboard';
import ClientStatementView from '../ClientStatement/ClientStatementView';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../../utilities/themes';
import MobileTabBar from '../Navigation/MobileTabBar';
import InstallPrompt from '../InstallPrompt';
import PurchaseOrders from '../PurchaseOrders/PurchaseOrders';
import PurchaseOrderView from '../PurchaseOrderView/PurchaseOrderView';

// Create spinner animation keyframes
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(spinnerStyle);

// Add a global CSS rule for dark theme
const darkModeStyle = document.createElement('style');
darkModeStyle.innerHTML = `
[data-theme='dark'] {
  background-color: #141625;
  color: #ffffff;
}
[data-theme='light'] {
  background-color: #f8f8fb;
  color: #0c0e16;
}
`;
document.head.appendChild(darkModeStyle);

const App = () => {
    const { invoiceState, clientState, quotationState, theme } = useGlobalContext();
    
    // Safely access isModalOpen - handle both old and new state structures
    const isModalOpen = invoiceState.isModalOpen?.status || invoiceState.modal?.isOpen || false;
    const isFormOpen = invoiceState.isFormOpen || false;
    const isClientFormOpen = clientState.isFormOpen || false;
    
    // For quotations
    const isQuotationFormOpen = quotationState?.form?.isCreating || quotationState?.form?.isEditing || false;
    
    const location = useLocation();

    // Use the appropriate theme based on user preference
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

    // Apply the current theme to document body when the theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeProvider theme={currentTheme}>
            <Wrapper>
                <Header />
                <AnimatePresence>
                    {isFormOpen && <FormController key="invoice-form" />}
                    {isClientFormOpen && <ClientFormController key="client-form" />}
                    {isModalOpen && <Modal key="modal" />}
                    {isQuotationFormOpen && <QuotationFormController key="quotation-form" />}
                </AnimatePresence>
                <AnimatePresence exitBeforeEnter>
                    <Switch location={location} key={location.key}>
                        <Route exact path="/">
                            <Redirect to="/dashboard" />
                        </Route>
                        <Route exact path="/dashboard">
                            <Dashboard />
                        </Route>
                        <Route exact path="/invoices">
                            <Invoices />
                        </Route>
                        <Route path="/invoice/:id" children={<InvoiceView />} />
                        <Route path="/clients">
                            <Clients />
                        </Route>
                        <Route path="/quotations">
                            <Quotations />
                        </Route>
                        <Route path="/quotation/:id">
                            <QuotationView />
                        </Route>
                        <Route path="/receipts">
                            <Receipts />
                        </Route>
                        <Route path="/receipt/:id">
                            <ReceiptView />
                        </Route>
                        <Route exact path="/delivery-orders">
                            <DeliveryOrders />
                        </Route>
                        <Route path="/delivery-orders/new">
                            <NewDeliveryOrder />
                        </Route>
                        <Route path="/delivery-orders/:id">
                            <DeliveryOrderView />
                        </Route>
                        <Route path="/client-statement/:id">
                            <ClientStatementView />
                        </Route>
                        <Route path="/settings">
                            <Settings />
                        </Route>
                        <Route path="/purchase-orders">
                            <PurchaseOrders />
                        </Route>
                        <Route path="/purchase-orders/:id">
                            <PurchaseOrderView />
                        </Route>
                        <Route path="*">
                            <RouteError />
                        </Route>
                    </Switch>
                </AnimatePresence>
                <MobileTabBar />
                <InstallPrompt />
            </Wrapper>
        </ThemeProvider>
    );
};

export default App;
