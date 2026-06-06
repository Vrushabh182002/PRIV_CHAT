import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcLock } from "react-icons/fc";
import { CiLock } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const navigatePage = () => {
    navigate("/register");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await axios.post(`${URL}/api/auth/login`, data, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Login successful", {
        position: "bottom-center",
        autoClose: 2000,
        theme: "dark",
      });

      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      console.log("Login Success:", res.data);
    } catch (error) {
      console.log("Login Unsuccessfull : ", error);
      setLoading(false);

      let errorMessage = "Something went wrong";

      if (error.response?.status === 403 && error.response?.data?.unlockKey) {
        sessionStorage.setItem("panicUnlockKey", error.response.data.unlockKey);

        navigate("/system-locked");

        return;
      }

      // Backend responded with error
      if (error.response) {
        errorMessage = error.response.data?.message || "Invalid credentials";
      }

      // No response from server
      else if (error.request) {
        errorMessage = "Server not responding";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "bottom-center",
        autoClose: 2500,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    // Show first error as toast
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, {
        position: "bottom-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  return (
    // Background
    <div className="min-h-screen flex items-center justify-center bg-[#0c0d0f] text-[#e8e9ed]  relative overflow-hidden px-4 sm:px-6">
      {/* //Grid Layout */}
      <div
        className="fixed inset-0 z-0 bg-[linear-gradient(#1e2128_1px,transparent_1px),linear-gradient(90deg,#1e2128_1px,transparent_1px)]
      bg-size-[32px_32px] sm:bg-size-[48px_48px]"
      />
      {/* //Glowing Orb Effect */}
      <div
        className="absolute 
        w-75 h-75 sm:w-125 sm:h-125 lg:w-162.5 lg:h-162.5
        bg-[radial-gradient(circle,#c8a97e10_0%,transparent_70%)]
        blur-3xl -top-20 -left-20 sm:-top-30 sm:-left-30"
      />
      {/* // Form Card */}
      <div
        className="relative z-10 w-full min-w-85 min-h-85 sm:max-w-md bg-[#13151a] border border-[#2a2f3a] 
        rounded-xl sm:rounded-2xl
        px-8 sm:px-10 sm:py-12
        shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg 
            bg-linear-to-br from-[#c8a97e] to-[#a07850] 
            flex items-center justify-center text-sm"
          >
            <FcLock />
          </div>
          <div>
            <span className="font-['DM_Serif_Display',serif] tracking-[-0.3px] text-lg color-[#e8e9ed] font-black sm:text-xl">
              PrivChat
            </span>
          </div>
        </div>
        <h1 className="text-xl font-black sm:text-2xl font-serif mb-2">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
          Sign in to your encrypted workspace
        </p>

        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          theme="dark"
          newestOnTop
          pauseOnHover={false}
          className="z-1000"
        />

        {/* FORM */}
        <form
          className="space-y-4 sm:space-y-5"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          {/* EMAIL */}
          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 block mb-2">
              Email address
            </label>
            <div className="relative">
              <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#0c0d0f] border border-[#2a2f3a] 
              rounded-lg px-10 py-4 sm:py-3 
              text-xs sm:text-sm 
              focus:outline-none focus:border-[#c8a97e]"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email ID",
                  },
                })}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 block mb-2">
              Password
            </label>

            <div className="relative">
              <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type={!showPassword ? "password" : "text"}
                placeholder="Your password"
                className="w-full bg-[#0c0d0f] border border-[#2a2f3a] 
                rounded-lg px-10 py-2.5 sm:py-3 pr-10 
                text-xs sm:text-sm 
                focus:outline-none focus:border-[#c8a97e]"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                text-gray-500 hover:text-white text-sm"
              >
                {!showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            // onClick={() => {
            //   // e.preventDefault();
            //   // setLoading(true);
            //   // setTimeout(() => setLoading(false), 2000);
            // }}
            className="w-full 
            bg-linear-to-br from-[#c8a97e] to-[#a07850] 
            text-[#1a1208] 
            py-2.5 sm:py-3 
            text-sm sm:text-base 
            rounded-lg font-medium 
            mt-2 transition active:scale-[0.98]"
          >
            {loading ? <Loader size={42} /> : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
          Don’t have an account?{" "}
          <span onClick={navigatePage} className="text-[#c8a97e] hover:underline">
            Create one
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;