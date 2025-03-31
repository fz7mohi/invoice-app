import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import Wrapper from '../Wrapper/Wrapper';
import Header from '../Header/Header';
import Invoices from '../Invoices/Invoices';
import Clients from '../Clients/Clients';
import Quotations from '../Quotations/Quotations';
import FormController from '../FormController/FormController';
import ClientFormController from '../ClientFormController/ClientFormController';
import QuotationFormController from '../QuotationFormController/QuotationFormController';
import InvoiceView from '../InvoiceView/InvoiceView';
import Modal from '../Modal/Modal';
import RouteError from '../RouteError/RouteError';
import { useGlobalContext } from './context';
import { AnimatePresence } from 'framer-motion';
import QuotationView from '../QuotationView/QuotationView';

// Create spinner animation keyframes
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(spinnerStyle);

const App = () => {
    const { invoiceState, clientState, quotationState } = useGlobalContext();
    
    // Safely access isModalOpen - handle both old and new state structures
    const isModalOpen = invoiceState.isModalOpen?.status || invoiceState.modal?.isOpen || false;
    const isFormOpen = invoiceState.isFormOpen || false;
    const isClientFormOpen = clientState.isFormOpen || false;
    
    // For quotations
    const isQuotationFormOpen = quotationState?.form?.isCreating || quotationState?.form?.isEditing || false;
    
    const location = useLocation();

    return (
        <Wrapper>
            <Header />
            <AnimatePresence>
                {isFormOpen && <FormController />}
                {isClientFormOpen && <ClientFormController />}
                {isModalOpen && <Modal />}
                {isQuotationFormOpen && <QuotationFormController />}
            </AnimatePresence>
            <AnimatePresence exitBeforeEnter>
                <Switch location={location} key={location.key}>
                    <Route exact path="/">
                        <Redirect to="/invoices" />
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
                    <Route path="*">
                        <RouteError />
                    </Route>
                </Switch>
            </AnimatePresence>
        </Wrapper>
    );
};

export default App;
