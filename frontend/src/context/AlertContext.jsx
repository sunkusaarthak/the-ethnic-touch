import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PremiumAlertModal from '../components/PremiumAlertModal';

const AlertContext = createContext({
    showAlert: () => {},
    closeAlert: () => {}
});

export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning'
    });

    const showAlert = useCallback((message, title = "Notice", type = "warning") => {
        setAlertState({
            isOpen: true,
            title,
            message,
            type
        });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    }, []);

    useEffect(() => {
        window.customAlert = showAlert;
        return () => {
            if (window.customAlert === showAlert) {
                delete window.customAlert;
            }
        };
    }, [showAlert]);

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            <PremiumAlertModal
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);

export default AlertContext;
