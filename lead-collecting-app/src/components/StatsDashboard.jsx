import { Globe, Mail, Phone, TrendingUp } from "lucide-react";

export const StatsDashboard = ({ stats }) => {
  if (!stats || stats.total === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Total Leads</p>
            <p className="text-2xl font-bold text-blue-300">{stats.total}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-300" />
        </div>
      </div>
      <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">With Email</p>
            <p className="text-2xl font-bold text-red-300">{stats.withEmail}</p>
          </div>
          <Mail className="h-8 w-8 text-red-300" />
        </div>
      </div>
      <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Total Email Sent</p>
            <p className="text-2xl font-bold text-red-300">
              {stats.emailsSent}
            </p>
          </div>
          <Mail className="h-8 w-8 text-red-300" />
        </div>
      </div>
      <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">With Phone</p>
            <p className="text-2xl font-bold text-[#31ff78]">
              {stats.withPhone}
            </p>
          </div>
          <Phone className="h-8 w-8 text-[#31ff78]" />
        </div>
      </div>
      <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">With Website</p>
            <p className="text-2xl font-bold text-[#ff8332]">
              {stats.withWebsite}
            </p>
          </div>
          <Globe className="h-8 w-8 text-[#ff8332]" />
        </div>
      </div>
    </div>
  );
};
