import React, { useState, useEffect } from "react";
import {
  Download,
  Mail,
  Trash2,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  Search,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  TrendingUp,
  Phone,
  Globe,
  MapPinned,
  MailCheck,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function GoogleMapsLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [maxLeads, setMaxLeads] = useState(50);
  const [isCollecting, setIsCollecting] = useState(false);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [deletingLeadId, setDeletingLeadId] = useState(null);

  useEffect(() => {
    checkBackendHealth();
    loadExistingLeads();
    loadStats();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setBackendStatus("connected");
      } else {
        setBackendStatus("error");
      }
    } catch (error) {
      setBackendStatus("disconnected");
    }
  };

  const loadExistingLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/leads/google-maps`);
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error("Failed to load leads:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats/google-maps`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    setDeletingLeadId(leadId);

    try {
      const response = await fetch(`${API_URL}/leads/google-maps/${leadId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await loadExistingLeads();
        await loadStats();
      } else {
        throw new Error(data.error || "Failed to delete lead");
      }
    } catch (error) {
      alert("Error deleting lead: " + error.message);
    } finally {
      setDeletingLeadId(null);
    }
  };

  const startCollection = async () => {
    if (!searchQuery.trim() || !location.trim()) {
      alert("Please enter both search query and location");
      return;
    }

    if (backendStatus !== "connected") {
      alert(
        "Backend is not connected. Please make sure your Node.js server is running on port 5000"
      );
      return;
    }

    setIsCollecting(true);

    try {
      const response = await fetch(`${API_URL}/scrape-google-maps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchQuery, location, maxLeads }),
      });

      const data = await response.json();

      if (data.success) {
        await loadExistingLeads();
        await loadStats();
        alert(`Successfully collected ${data.leadsCollected} leads!`);
      } else {
        throw new Error(data.error || "Scraping failed");
      }
    } catch (error) {
      alert("Error collecting leads: " + error.message);
      console.error("Scraping error:", error);
    } finally {
      setIsCollecting(false);
    }
  };

  const exportToExcel = async () => {
    if (leads.length === 0) {
      alert("No leads to export");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/export-google-maps`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `google_maps_leads_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error exporting leads: " + error.message);
    }
  };

  const clearLeads = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all leads? This cannot be undone!"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/leads/google-maps`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setLeads([]);
        setStats(null);
        alert("All leads cleared successfully");
      }
    } catch (error) {
      alert("Error clearing leads: " + error.message);
    }
  };

  const sendEmails = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert("Please enter both subject and message");
      return;
    }

    const leadsToSend = leads.filter(
      (l) => l.email && l.email.includes("@") && !l.emailSent
    );

    if (leadsToSend.length === 0) {
      alert("No unsent leads with valid email addresses found");
      return;
    }

    if (!window.confirm(`Send email to ${leadsToSend.length} leads?`)) {
      return;
    }

    setIsSendingEmails(true);

    try {
      const response = await fetch(`${API_URL}/send-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          message: emailMessage,
          leads: leadsToSend,
          leadsType: "google-maps",
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `Emails sent!\n✅ Successful: ${data.sent}\n❌ Failed: ${data.failed}`
        );
        setEmailSubject("");
        setEmailMessage("");
        setShowEmailComposer(false);
        await loadExistingLeads();
        await loadStats();
      } else {
        throw new Error(data.error || "Failed to send emails");
      }
    } catch (error) {
      alert("Error sending emails: " + error.message);
    } finally {
      setIsSendingEmails(false);
    }
  };

  const unsentLeadsCount = leads.filter(
    (l) => l.email && l.email.includes("@") && !l.emailSent
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-800">
                  Google Maps Lead Generation
                </h1>
              </div>
              <p className="text-gray-600">
                Collect business leads with contact info and social media from
                Google Maps
              </p>
            </div>
            <div className="flex items-center gap-2">
              {backendStatus === "connected" && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle size={20} />
                  <span className="text-sm font-medium">Backend Connected</span>
                </div>
              )}
              {backendStatus === "disconnected" && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <XCircle size={20} />
                  <span className="text-sm font-medium">
                    Backend Disconnected
                  </span>
                </div>
              )}
              {backendStatus === "checking" && (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm font-medium">Checking...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {stats && stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.total}
                  </p>
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
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="inline h-4 w-4 mr-1" />
                  Search Query
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., toy store, restaurants, dental clinic"
                  disabled={isCollecting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  What type of business are you looking for?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Canada, New York, Tokyo"
                  disabled={isCollecting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  City, state, or country
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Leads to Collect
              </label>
              <input
                type="number"
                value={maxLeads}
                onChange={(e) => setMaxLeads(parseInt(e.target.value) || 50)}
                min="1"
                max="500"
                disabled={isCollecting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={startCollection}
              disabled={isCollecting || backendStatus !== "connected"}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isCollecting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Collecting Leads from Google Maps...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start Collection
                </>
              )}
            </button>
          </div>
        </div>

        {leads.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={exportToExcel}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={20} />
                Export to CSV ({leads.length} leads)
              </button>

              <button
                onClick={() => setShowEmailComposer(!showEmailComposer)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Mail size={20} />
                Send Emails{" "}
                {unsentLeadsCount > 0 && `(${unsentLeadsCount} unsent)`}
              </button>

              <button
                onClick={clearLeads}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            </div>
          </div>
        )}

        {showEmailComposer && leads.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Email Composer
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Your email subject... (use {{businessName}} for personalization)"
                  disabled={isSendingEmails}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={8}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Hi {{businessName}},&#10;&#10;I found your business on Google Maps...&#10;&#10;Available variables: {{businessName}}, {{email}}, {{phone}}, {{website}}, {{address}}, {{rating}}"
                  disabled={isSendingEmails}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📧 Unsent leads with valid emails: {unsentLeadsCount} /{" "}
                  {leads.length}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ✓ Only unsent leads will receive emails (leads with ✅ will be
                  skipped)
                </p>
              </div>
              <button
                onClick={sendEmails}
                disabled={isSendingEmails || unsentLeadsCount === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {isSendingEmails ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send Bulk Emails to {unsentLeadsCount} Leads
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {leads.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Collected Leads ({leads.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Business Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Contact Info
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Social Media
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => {
                    const leadId = lead._id || lead.id;
                    return (
                      <tr
                        key={leadId}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {lead.businessName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lead.category}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {lead.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail size={14} className="text-green-600" />
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {lead.email}
                                </a>
                                {lead.emailSent && (
                                  <MailCheck
                                    size={14}
                                    className="text-green-600 ml-1"
                                    title="Email sent"
                                  />
                                )}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone size={14} className="text-purple-600" />
                                <span className="text-gray-700">
                                  {lead.phone}
                                </span>
                              </div>
                            )}
                            {lead.website && (
                              <div className="flex items-center gap-1 text-sm">
                                <Globe size={14} className="text-orange-600" />
                                <a
                                  href={lead.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {lead.facebook && (
                              <a
                                href={lead.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                                title="Facebook"
                              >
                                <Facebook size={18} />
                              </a>
                            )}
                            {lead.instagram && (
                              <a
                                href={lead.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-800"
                                title="Instagram"
                              >
                                <Instagram size={18} />
                              </a>
                            )}
                            {lead.twitter && (
                              <a
                                href={lead.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-600"
                                title="Twitter"
                              >
                                <Twitter size={18} />
                              </a>
                            )}
                            {lead.linkedin && (
                              <a
                                href={lead.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:text-blue-900"
                                title="LinkedIn"
                              >
                                <Linkedin size={18} />
                              </a>
                            )}
                            {!lead.facebook &&
                              !lead.instagram &&
                              !lead.twitter &&
                              !lead.linkedin && (
                                <span className="text-xs text-gray-400">
                                  None found
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-1 text-sm text-gray-700">
                            <MapPinned
                              size={14}
                              className="mt-0.5 flex-shrink-0 text-red-500"
                            />
                            <span className="line-clamp-2">
                              {lead.address || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-center">
                            {lead.rating && (
                              <div className="font-medium text-yellow-600">
                                ⭐ {lead.rating}
                              </div>
                            )}
                            {lead.reviews && (
                              <div className="text-xs text-gray-500">
                                {lead.reviews} reviews
                              </div>
                            )}
                            {!lead.rating && (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              onClick={() => deleteLead(leadId)}
                              disabled={deletingLeadId === leadId}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete lead"
                            >
                              {deletingLeadId === leadId ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <X size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {backendStatus === "disconnected" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">
              ⚠️ Backend Not Connected
            </h3>
            <p className="text-sm text-red-800 mb-3">
              The backend server is not running. To start it:
            </p>
            <ol className="list-decimal list-inside text-sm text-red-800 space-y-1">
              <li>Open terminal in your backend folder</li>
              <li>
                Run:{" "}
                <code className="bg-red-100 px-2 py-1 rounded">
                  node server.js
                </code>
              </li>
              <li>Refresh this page</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
