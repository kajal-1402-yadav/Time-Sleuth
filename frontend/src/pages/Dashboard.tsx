import SuspicionCard from "../components/SuspicionCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Time Sleuth</h1>
          <p className="text-gray-400 text-sm">AI Productivity Monitor</p>
        </div>
        <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm">Today
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SuspicionCard />

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-xl hover:shadow-blue-500/10">
          <h3 className="text-gray-400 text-sm">Active Time</h3>
          <h1 className="text-3xl font-bold mt-2 text-green-400">5h 20m</h1>
          <p className="text-gray-500 mt-2 text-sm">Today</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-xl hover:shadow-blue-500/10">
          <h3 className="text-gray-400 text-sm">Idle Time</h3>
          <h1 className="text-3xl font-bold mt-2 text-yellow-400">1h 10m</h1>
          <p className="text-gray-500 mt-2 text-sm">Today</p>
        </div>
      </div>

      {/* Activity */}
      <div className="mt-10 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>

        <div className="h-40 flex items-center justify-center text-gray-500 border border-dashed border-gray-600 rounded-xl">
          Chart coming next 🚀
        </div>
      </div>

    </div>
  );
};

export default Dashboard;