import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import Invoices from './components/Invoices/Invoices';
import InvoiceDetails from './components/InvoiceDetails/InvoiceDetails';
import GoBack from './components/shared/GoBack/GoBack';
import InvoiceFormController from './components/InvoiceFormController/InvoiceFormController';
import ClientFormController from './components/ClientFormController/ClientFormController';
import Clients from './components/Clients/Clients';
import Quotations from './components/Quotations/Quotations';
import Settings from './components/Settings/Settings';
import { useContext } from 'react';
import { AppContext } from './components/App/context';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './utilities/themes';
import GlobalStyle from './utilities/GlobalStyle';
import { Switch, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

function App() {
    const {
        theme,
        invoiceState,
        clientState,
        quotationState,
    } = useContext(AppContext);

    const { isFormOpen: isInvoiceFormOpen } = invoiceState;
    const { isFormOpen: isClientFormOpen } = clientState;
    const { form: quotationForm } = quotationState;
    const isQuotationFormOpen = quotationForm.isEditing || quotationForm.isCreating;

    return (
        <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
            <GlobalStyle />
            <Sidebar />
            <AnimatePresence>
                {isInvoiceFormOpen && <InvoiceFormController key="invoice-form" />}
                {isClientFormOpen && <ClientFormController key="client-form" />}
                {isQuotationFormOpen && <div key="quotation-form">Quotation Form Controller</div>}
            </AnimatePresence>
            
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/invoices">
                    <Invoices />
                </Route>
                <Route exact path="/invoices/:id">
                    <GoBack />
                    <InvoiceDetails />
                </Route>
                <Route exact path="/clients">
                    <Clients />
                </Route>
                <Route exact path="/quotations">
                    <Quotations />
                </Route>
                <Route exact path="/quotations/:id">
                    <GoBack />
                    <div>Quotation Details</div>
                </Route>
                <Route exact path="/settings">
                    <Settings />
                </Route>
            </Switch>
        </ThemeProvider>
    );
}

export default App; 