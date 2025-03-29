import { quotationsReducer } from './quotationsReducer';

const rootReducer = combineReducers({
    invoices: invoicesReducer,
    quotations: quotationsReducer,
    clients: clientsReducer,
}); 