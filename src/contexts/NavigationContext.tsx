import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
    isNavigating: boolean;
    setIsNavigating: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isNavigating, setIsNavigating] = useState(false);
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState(location.pathname);

    useEffect(() => {
        // Detect route changes
        if (location.pathname !== prevLocation) {
            setIsNavigating(true);
            setPrevLocation(location.pathname);
            
            // Hide preloader after a short delay (allows page to start loading)
            const timer = setTimeout(() => {
                setIsNavigating(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [location.pathname, prevLocation]);

    return (
        <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
