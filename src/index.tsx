import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as ReactDOMClient from 'react-dom/client';

const container = document.getElementById('root') as Element | DocumentFragment;
const root = ReactDOMClient.createRoot(container);
root.render(<App />);

reportWebVitals();

