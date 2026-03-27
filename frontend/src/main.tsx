import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from 'react-helmet-async';


const root = document.getElementById('root')!
createRoot(root).render(
    <StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Toaster position="bottom-center" toastOptions={
                        {
                            success: {
                                style: {
                                    background: "green",
                                    color: "white"
                                }
                            },
                            duration: 3000,
                            error: {
                                style: {
                                    background: "red",
                                    color: "white"
                                }
                            }
                        }
                    } />
                    <App />
                </PersistGate>
            </Provider>
        </HelmetProvider>
    </StrictMode>
)
