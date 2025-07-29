import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import BotUI from "../bot";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";

const AppLayout = ({ user, isBotOpen, setIsBotOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isReviewManagementOpen } = useContext(GlobalContext);
  const location = useLocation();
  const navigate = useNavigate();
  console.log("applayout");

  useEffect(() => {
    // Redirect to login if not authenticated
    const isValidUser = user && ((user.name === "admin") || (user === "demo"));
    if (!isValidUser) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if(location.pathname === "/doc-review-management-center" || location.pathname === "/create-rfi" || location.pathname === "/rfi-details" || location.pathname === "/upload-templates" || location.pathname === "/report-templates"){
      setCollapsed(isReviewManagementOpen)
    }
    else{
      setCollapsed(false)
    }
  }, [location.pathname, isReviewManagementOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          user={user}
        />
      </div>
      <div
        className={`flex-1 transition-all duration-300 overflow-auto ${
          collapsed ? "ml-16" : "ml-72"
        }`}
      >
        <div className="flex flex-col w-full">
          <DashboardHeader user={user} />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <BotUI isBotOpen={isBotOpen} setIsBotOpen={setIsBotOpen} />
    </div>
  );
};

export default AppLayout;
