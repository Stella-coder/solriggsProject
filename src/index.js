import 'process/browser';
import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthState } from "./utilities/AuthState";
import { Provider } from "react-redux";
import store from "./utilities/store";
import { Buffer } from 'buffer';
import { configureStore } from '@reduxjs/toolkit';

// Polyfills
import 'crypto-browserify';
import 'stream-browserify';
import 'assert';
import 'stream-http';
import 'https-browserify';
import 'os-browserify';
import 'url';

window.Buffer = window.Buffer || Buffer;
window.process = window.process || require('process/browser');



// Ensure global is defined for libraries that expect it
if (typeof global === 'undefined') {
  window.global = window;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthState>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthState>
  </React.StrictMode>
);

reportWebVitals();