import StatsCards from "../components/Dashboard/StatsCards";
import RecentApplications from "../components/Dashboard/RecentApplications";
import OTSRecommendations from "../components/Dashboard/OTSRecommendations";
import LLMAssistant from "../components/Dashboard/LLMAssistant";
import SystemStatus from "../components/Dashboard/SystemStatus";
import RecentActivity from "../components/Dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="h-full overflow-auto">
      {/* Stats Cards Section */}
      <div className="p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCards />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2 space-y-4 lg:space-y-6">
          <RecentApplications />
          <OTSRecommendations />
        </div>

        <div className="space-y-4 lg:space-y-6">
          <LLMAssistant />
          <SystemStatus />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
