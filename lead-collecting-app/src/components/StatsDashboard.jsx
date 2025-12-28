import { Globe, Mail, Phone, TrendingUp } from "lucide-react";

export const StatsDashboard = ({ stats }) => {
  if (!stats || stats.total === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Leads</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">With Email</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.withEmail}
            </p>
          </div>
          <Mail className="h-8 w-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Email Sent</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.emailsSent}
            </p>
          </div>
          <Mail className="h-8 w-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">With Phone</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.withPhone}
            </p>
          </div>
          <Phone className="h-8 w-8 text-purple-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">With Website</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.withWebsite}
            </p>
          </div>
          <Globe className="h-8 w-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};
