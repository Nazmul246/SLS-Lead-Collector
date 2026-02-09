import React, { useState, useEffect } from "react";
import { Mail, Eye, MousePointer, TrendingUp, Clock } from "lucide-react";

export const EmailTrackingDashboard = ({ apiUrl }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'GoogleMapsLead', 'ShopifyLead'

  useEffect(() => {
    fetchTrackingStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchTrackingStats, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchTrackingStats = async () => {
    try {
      const endpoint =
        filter === "all"
          ? `${apiUrl}/api/tracking/stats/all`
          : `${apiUrl}/api/tracking/stats/${filter}`;

      console.log("🔍 Fetching from:", endpoint); // ADD THIS LINE

      const response = await fetch(endpoint);
      console.log("📡 Response status:", response.status); // ADD THIS LINE
      console.log("📡 Response headers:", response.headers.get("content-type")); // ADD THIS LINE

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        throw new Error(
          `Server returned ${response.status}: ${errorText.substring(0, 100)}`,
        );
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "❌ Received HTML instead of JSON:",
          text.substring(0, 200),
        );
        throw new Error(
          "Server returned HTML instead of JSON - check server logs",
        );
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching tracking stats:", error);
      alert(`Failed to load tracking stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8 text-gray-500">
        No tracking data available yet. Send some emails to see stats!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          📊 Email Tracking Dashboard
        </h2>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Leads</option>
          <option value="GoogleMapsLead">Google Maps Leads</option>
          <option value="ShopifyLead">Shopify Leads</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sent */}
        <div className="backdrop-blur-lg bg-white/80 rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emails Sent</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalEmailsSent}
              </p>
            </div>
            <Mail size={32} className="text-blue-500" />
          </div>
        </div>

        {/* Total Opened */}
        <div className="backdrop-blur-lg bg-white/80 rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Opened</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalOpened}
              </p>
            </div>
            <Eye size={32} className="text-green-500" />
          </div>
        </div>

        {/* Open Rate */}
        <div className="backdrop-blur-lg bg-white/80 rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Rate</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.openRate}%
              </p>
            </div>
            <TrendingUp size={32} className="text-purple-500" />
          </div>
        </div>

        {/* Total Clicked */}
        <div className="backdrop-blur-lg bg-white/80 rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clicked</p>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalClicked}
              </p>
            </div>
            <MousePointer size={32} className="text-orange-500" />
          </div>
        </div>

        {/* Click Rate */}
        <div className="backdrop-blur-lg bg-white/80 rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Click Rate</p>
              <p className="text-3xl font-bold text-pink-600">
                {stats.clickRate}%
              </p>
            </div>
            <MousePointer size={32} className="text-pink-500" />
          </div>
        </div>
      </div>

      {/* Click-Through Rate Info */}
      {stats.clickThroughRate && (
        <div className="backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-300">
          <p className="text-sm text-gray-700">
            <strong>Click-Through Rate (CTR):</strong> {stats.clickThroughRate}%
            of people who opened also clicked a link
          </p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="backdrop-blur-lg bg-white/80 rounded-lg shadow-lg border border-white/30 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} />
          Recent Activity
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                  Recipient
                </th>
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                  Sent
                </th>
                <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">
                  Opened
                </th>
                <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">
                  Clicked
                </th>
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                  Device
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <tr
                    key={activity._id || index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.leadName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.leadEmail}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(activity.sentAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {activity.opened ? (
                        <div className="flex flex-col items-center">
                          <span className="text-green-600 font-semibold">
                            ✓
                          </span>
                          {activity.openCount > 1 && (
                            <span className="text-xs text-gray-500">
                              ({activity.openCount}x)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {activity.clicked ? (
                        <div className="flex flex-col items-center">
                          <span className="text-orange-600 font-semibold">
                            ✓
                          </span>
                          {activity.clickCount > 1 && (
                            <span className="text-xs text-gray-500">
                              ({activity.clickCount}x)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {activity.emailClient || activity.device || "Unknown"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No recent activity
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Tips */}
      <div className="backdrop-blur-lg bg-blue-50/80 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">
          💡 Engagement Tips:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>Good open rate:</strong> 20-30% is average, 30%+ is great
          </li>
          <li>
            • <strong>Good click rate:</strong> 2-5% is average, 5%+ is great
          </li>
          <li>
            • If someone opened but didn't click, consider following up with a
            different message
          </li>
          <li>
            • Multiple opens without clicks might mean they're interested but
            need more convincing
          </li>
        </ul>
      </div>
    </div>
  );
};
