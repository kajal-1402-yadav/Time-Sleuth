type Props = {
  score: number;
  reason: string;
};

const SuspicionCard = ({ score, reason }: Props) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-xl">
      <h3 className="text-gray-400 text-sm">Suspicion Score</h3>

      <h1 className="text-3xl font-bold mt-2 text-red-400">
        {score}%
      </h1>

      <p className="text-gray-500 mt-2 text-sm">{reason}</p>

      <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
        <div
          className="bg-red-500 h-3 rounded-full transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default SuspicionCard;