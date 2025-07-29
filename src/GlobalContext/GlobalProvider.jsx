import { tableAllData } from "@/pages/dashboard/request-for-information/mock-data/constant";
import { createContext, useState } from "react";
export const GlobalContext = createContext();

const GlobalContextProvider = ({children}) =>{
    const [isReviewManagementOpen, setIsReviewManagementOpen] = useState(false);
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [tableData, setTableData] = useState(tableAllData);
    return (
        <GlobalContext.Provider value={{ isReviewManagementOpen, setIsReviewManagementOpen, isBotOpen, setIsBotOpen, tableData, setTableData }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;