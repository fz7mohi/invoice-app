import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalContextProvider } from './context/GlobalContext';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Invoices from './components/Invoices/Invoices';
import InvoiceView from './components/InvoiceView/InvoiceView';
import NewInvoice from './components/Invoices/NewInvoice/NewInvoice';
import Quotations from './components/Quotations/Quotations';
import QuotationView from './components/QuotationView/QuotationView';
import NewQuotation from './components/Quotations/NewQuotation/NewQuotation';
import DeliveryOrders from './components/DeliveryOrders/DeliveryOrders';
import DeliveryOrderView from './components/DeliveryOrders/DeliveryOrderView/DeliveryOrderView';
import NewDeliveryOrder from './components/DeliveryOrders/NewDeliveryOrder/NewDeliveryOrder';
import Clients from './components/Clients/Clients';
import ClientView from './components/Clients/ClientView/ClientView';
import NewClient from './components/Clients/NewClient/NewClient';
import ClientStatementView from './components/ClientStatement/ClientStatementView';
import Settings from './components/Settings/Settings';
import NotFound from './components/NotFound/NotFound';
import ApiKeyTest from './components/shared/ApiKeyTest';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <GlobalContextProvider>
          <Layout>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/invoices" component={Invoices} />
              <Route exact path="/invoices/new" component={NewInvoice} />
              <Route exact path="/invoices/:id" component={InvoiceView} />
              <Route exact path="/quotations" component={Quotations} />
              <Route exact path="/quotations/new" component={NewQuotation} />
              <Route exact path="/quotations/:id" component={QuotationView} />
              <Route exact path="/delivery-orders" component={DeliveryOrders} />
              <Route exact path="/delivery-orders/new" component={NewDeliveryOrder} />
              <Route exact path="/delivery-orders/:id" component={DeliveryOrderView} />
              <Route exact path="/clients" component={Clients} />
              <Route exact path="/clients/new" component={NewClient} />
              <Route exact path="/clients/:id" component={ClientView} />
              <Route exact path="/client-statement/:id" component={ClientStatementView} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/api-test" component={ApiKeyTest} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Layout>
          <InstallPrompt />
        </GlobalContextProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App; 