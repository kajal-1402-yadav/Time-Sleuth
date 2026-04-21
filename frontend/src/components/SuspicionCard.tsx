const SuspicionCard = () => {
  const score = 0; // later this will come from backend

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-xl hover:shadow-blue-500/10">
      
      <h3 className="text-gray-400 text-sm">Suspicion Score</h3>

      <h1 className="text-4xl font-bold text-red-500 mt-2">
        {score}%
      </h1>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-2 rounded-full mt-4">
        <div
          className="bg-red-500 h-2 rounded-full"
          style={{ width: `${score}%` }}
        ></div>
      </div>

      <p className="text-gray-500 mt-3 text-sm">
        No suspicious activity detected
      </p>

    </div>
  );
};

export default SuspicionCard;