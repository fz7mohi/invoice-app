import { Route, Switch, useLocation } from 'react-router-dom';
import Wrapper from '../Wrapper/Wrapper';
import Header from '../Header/Header';
import Invoices from '../Invoices/Invoices';
import Clients from '../Clients/Clients';
import FormController from '../FormController/FormController';
import ClientFormController from '../ClientFormController/ClientFormController';
import InvoiceView from '../InvoiceView/InvoiceView';
import Modal from '../Modal/Modal';
import RouteError from '../RouteError/RouteError';
import { useGlobalContext } from './context';
import { AnimatePresence } from 'framer-motion';

const App = () => {
    const { state, clientState } = useGlobalContext();
    const isModalOpen = state.isModalOpen.status;
    const isFormOpen = state.isFormOpen;
    const isClientFormOpen = clientState.isFormOpen;
    const location = useLocation();

    return (
        <Wrapper>
            <Header />
            <AnimatePresence>
                {isFormOpen && <FormController />}
                {isClientFormOpen && <ClientFormController />}
                {isModalOpen && <Modal />}
            </AnimatePresence>
            <AnimatePresence exitBeforeEnter>
                <Switch location={location} key={location.key}>
                    <Route exact path="/">
                        <Invoices />
                    </Route>
                    <Route path="/invoice/:id" children={<InvoiceView />} />
                    <Route path="/clients">
                        <Clients />
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
