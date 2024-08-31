import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Web3ModalProvider } from "./web3.tsx";
import { Provider } from 'react-redux';
import store from './store';
import { AelfWeb3Provider } from "./web3aelf.tsx";
import Login from "./Login.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <Web3ModalProvider>
        <App />
      </Web3ModalProvider>
    </Provider>
  //  </React.StrictMode>
);
