import { createContext, useState } from "react";
export const GlobalContext = createContext();

const GlobalContextProvider = ({children}) =>{
    const [isReviewManagementOpen, setIsReviewManagementOpen] = useState(false);
    return (
        <GlobalContext.Provider value={{ isReviewManagementOpen, setIsReviewManagementOpen }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;