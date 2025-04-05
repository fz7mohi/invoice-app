// Add process polyfill as a global to fix the canvg "process/browser" error
window.process = require('process/browser');

import ReactDOM from 'react-dom';
import App from './components/App/App';
import { AppProvider } from './components/App/context';

ReactDOM.render(
    <AppProvider>
        <App />
    </AppProvider>,
    document.getElementById('root')
);
