import React from "react";

const StatCard = ({ icon, title, value, status, color }) => {
  const statusColor =
    color === "red"
      ? "text-red-400"
      : color === "gold"
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1f2937] bg-[#070d1a] p-8 min-h-55">
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${
          color === "red"
            ? "bg-red-500"
            : color === "gold"
              ? "bg-yellow-500"
              : "bg-green-500"
        }`}
      />

      <div className="w-12 h-12 rounded-2xl bg-[#141c2d] flex items-center justify-center mb-8">
        {icon}
      </div>

      <h3 className="text-6xl font-serif font-bold">{value}</h3>

      <p className="mt-3 text-slate-400">{title}</p>

      <p className={`mt-2 text-sm ${statusColor}`}>{status}</p>
    </div>
  );
};

export default StatCard;