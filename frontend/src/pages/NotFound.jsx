import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-[#e8e9ed] flex items-center justify-center px-6 overflow-hidden relative">
      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0
        bg-[linear-gradient(#1e2128_1px,transparent_1px),linear-gradient(90deg,#1e2128_1px,transparent_1px)]
        bg-size-[40px_40px]"
      />

      {/* Glow Effect */}
      <div
        className="absolute w-162.5 h-162.5
        bg-[radial-gradient(circle,#c8a97e12_0%,transparent_70%)]
        blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mt-3 mb-3">
          <div
            className="w-16 h-16 rounded-2xl
            bg-linear-to-br from-[#c8a97e] to-[#a07850]
            flex items-center justify-center text-black text-2xl shadow-lg"
          >
            <FaLock />
          </div>
        </div>

        {/* 404 */}
        <h1
          className="text-5xl md:text-6xl font-black
          bg-linear-to-r from-[#c8a97e] to-[#f5d2a3]
          bg-clip-text text-transparent"
        >
          404
        </h1>

        {/* Error Icon */}
        <div className="flex justify-center mt-4 mb-3">
          <MdOutlineErrorOutline className="text-[#c8a97e] text-4xl" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Secure Route Not Found
        </h2>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          The encrypted destination you're trying to access doesn't exist, has
          been moved, or requires a valid route.
        </p>

        {/* Fake Terminal */}
        <div
          className="mt-5 bg-[#13151a]
          border border-[#2a2f3a]
          rounded-xl p-5 text-left
          font-mono text-sm"
        >
          <div className="text-[#c8a97e] mb-2">PRIVCHAT_SECURE_GATEWAY</div>

          <div className="text-red-400">ERROR_CODE: 404_ROUTE_NOT_FOUND</div>

          <div className="text-gray-400 mt-2">
            Requested endpoint could not be located.
          </div>

          <div className="text-gray-500 mt-1">
            Returning to a safe destination is recommended.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="
              bg-linear-to-br
              from-[#c8a97e]
              to-[#a07850]
              text-[#1a1208]
              px-6 py-3
              rounded-lg
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Return Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              border border-[#2a2f3a]
              bg-[#13151a]
              px-6 py-3
              rounded-lg
              hover:border-[#c8a97e]
              transition
            "
          >
            Go Back
          </button>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-gray-600 tracking-wider uppercase">
          PrivChat • End-to-End Secure Messaging
        </p>
      </div>
    </div>
  );
};

export default NotFound;