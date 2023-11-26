import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as ReactDOMClient from "react-dom/client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.scss"; // You can import other stylesheets here if needed

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

const container = document.getElementById("root") as Element | DocumentFragment;
const root = ReactDOMClient.createRoot(container);
root.render(<App />);

reportWebVitals();
