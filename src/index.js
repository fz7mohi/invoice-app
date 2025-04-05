// Add process polyfill as a global to fix the canvg "process/browser" error
window.process = require('process/browser');

import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AppProvider } from './components/App/context';

ReactDOM.render(
    <Router>
        <AppProvider>
            <App />
        </AppProvider>
    </Router>,
    document.getElementById('root')
);
