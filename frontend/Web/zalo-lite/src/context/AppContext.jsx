import {createContext} from 'react';

export const AppContext = createContext({});

export default AppProvider = ({children}) => {
    return (
        <AppContext.Provider>
            {children}
        </AppContext.Provider>
    )
}