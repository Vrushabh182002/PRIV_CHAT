import {
  Users,
  MessageCircle,
  Lock,
  ClipboardList,
  Home,
  UserCog,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import StatCard from "../components/StatCard";

const AdminDashboard = () => {
  return (
    <div className="h-screen bg-[#070b14] text-white flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-68 border-r border-[#1a2233] flex flex-col justify-between">
        <div>
          {/* LOGO */}
          <div className="p-6 border-b border-[#1a2233]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#d3a977] to-[#9e7345] flex items-center justify-center">
                🔒
              </div>

              <h1 className="text-3xl font-serif font-bold">PrivChat</h1>
            </div>

            <span className="inline-block mt-3 px-3 py-1 text-xs rounded-md border border-[#3f3324] bg-[#1a1713] text-[#d3a977]">
              ADMIN
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className="p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1d1c20] border border-[#38333a] text-[#d3a977]">
              <Home size={18} />
              Dashboard
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#111827] text-slate-400">
              <UserCog size={18} />
              Users
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#111827] text-slate-400">
              <FileText size={18} />
              Audit Logs
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#111827] text-slate-400">
              <MessageCircle size={18} />
              Go to Chat
            </button>
          </nav>
        </div>

        {/* FOOTER */}
        <div className="border-t border-[#1a2233] p-5">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-[#c8a97e] text-black flex items-center justify-center font-bold">
                A
              </div>

              <div>
                <p className="font-semibold">Admin</p>
                <p className="text-sm text-slate-400">Administrator</p>
              </div>
            </div>

            <button className="w-11 h-11 rounded-xl border border-[#273044] flex items-center justify-center">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <div className="h-20 border-b border-[#1a2233] flex justify-between items-center px-8">
          <h1 className="text-5xl font-serif font-bold">Dashboard</h1>

          <button className="w-12 h-12 rounded-xl border border-[#273044] flex items-center justify-center">
            ↻
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={<Users size={20} />}
              title="Total Users"
              value="5"
              status="● Active"
              color="green"
            />

            <StatCard
              icon={<MessageCircle size={20} />}
              title="Messages Today"
              value="142"
              status="↑ Real-time"
              color="green"
            />

            <StatCard
              icon={<Lock size={20} />}
              title="Locked Accounts"
              value="2"
              status="Requires attention"
              color="red"
            />

            <StatCard
              icon={<ClipboardList size={20} />}
              title="Audit Events"
              value="28"
              status="Last 24h"
              color="gold"
            />
          </div>

          {/* SYSTEM STATUS */}
          <div className="mt-10 rounded-3xl border border-green-900 bg-linear-to-r from-green-950/50 to-[#0a1617] p-8 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-950 flex items-center justify-center">
                <ShieldCheck className="text-green-400" />
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-green-400">
                  System Operational
                </h2>

                <p className="text-slate-400">
                  All users can log in. No emergency lock active.
                </p>
              </div>
            </div>

            <button className="px-8 py-3 border border-[#284537] rounded-2xl text-slate-300">
              System OK
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;