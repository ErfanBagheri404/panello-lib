import { Suspense, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [authState, setAuthState] = useState({
    isInvited: false,
    role: 'user',
    loading: true
  });

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch(`/api/auth/profile?t=${Date.now()}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        
        if (!response.ok) throw new Error('Unauthorized');
        
        const data = await response.json();
        setAuthState({
          isInvited: data.isInvited,
          role: data.role,
          loading: false
        });
      } catch (error) {
        console.error("Authorization check failed:", error);
        setAuthState(prev => ({...prev, loading: false}));
      }
    };
    
    checkAuthorization();
  }, []);

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="animate-pulse text-xl font-medium">Loading...</span>
      </div>
    );
  }

  const shouldShowOutlet = authState.role === 'Owner' || authState.isInvited;

  return (
    <div className="flex lg:flex-row flex-col h-screen lg:p-2.5 p-3 py-1">
      {/* Sidebar */}
      <div className="h-full hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col lg:ml-2.5 h-full">
        {/* Navbar */}
        <div className="hidden lg:block">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto scrollbar-hide">
        {shouldShowOutlet ? (
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center">
                  <span className="animate-pulse text-xl font-medium">
                    Loading...
                  </span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
                <p className="text-gray-600">
                  You haven't been invited to this workspace yet. Please contact
                  your administrator for access.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sidebar */}
        <div className="block lg:hidden mt-2.5">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
