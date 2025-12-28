import React, { useState, useEffect } from "react";
import {
  Download,
  Mail,
  Trash2,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const API_URL = "https://united-gwennie-shoplift-studio-ce4f7ede.koyeb.app/";

export default function LeadCollectionSystem() {
  const [url, setUrl] = useState("");
  const [maxLeads, setMaxLeads] = useState(50);
  const [isCollecting, setIsCollecting] = useState(false);
  const [leads, setLeads] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  // Check if backend is running
  useEffect(() => {
    checkBackendHealth();
    loadExistingLeads();
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
      const response = await fetch(`${API_URL}/leads`);
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error("Failed to load leads:", error);
    }
  };

  const startCollection = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    if (backendStatus !== "connected") {
      alert(
        "Backend is not connected. Please make sure your Node.js server is running on port 5000"
      );
      return;
    }

    setIsCollecting(true);
    setProgress({ current: 0, total: maxLeads });

    try {
      const response = await fetch(`${API_URL}/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, maxLeads }),
      });

      const data = await response.json();

      if (data.success) {
        setLeads((prev) => [...prev, ...data.leads]);
        setProgress({ current: data.leadsCollected, total: maxLeads });
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
      const response = await fetch(`${API_URL}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
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
      const response = await fetch(`${API_URL}/leads`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setLeads([]);
        setProgress({ current: 0, total: 0 });
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

    const leadsWithEmail = leads.filter(
      (l) => l.email && l.email.includes("@")
    );

    if (leadsWithEmail.length === 0) {
      alert("No leads with valid email addresses found");
      return;
    }

    if (!window.confirm(`Send email to ${leadsWithEmail.length} leads?`)) {
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
      } else {
        throw new Error(data.error || "Failed to send emails");
      }
    } catch (error) {
      alert("Error sending emails: " + error.message);
    } finally {
      setIsSendingEmails(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Lead Collection System
              </h1>
              <p className="text-gray-600">
                Collect business leads from various platforms for outreach
                purposes
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

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.shopify.com/partners/directory/locations/united-states"
                disabled={isCollecting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Supported: Shopify Partners Directory, or any website URL
              </p>
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
                max="1000"
                disabled={isCollecting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={startCollection}
              disabled={isCollecting || backendStatus !== "connected"}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isCollecting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Collecting Leads...
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

        {/* Action Buttons */}
        {leads.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={exportToExcel}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={20} />
                Export to Excel ({leads.length} leads)
              </button>

              <button
                onClick={() => setShowEmailComposer(!showEmailComposer)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Mail size={20} />
                Send Emails
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

        {/* Email Composer */}
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
                  placeholder="Your email subject... (use {{companyName}} for personalization)"
                  disabled={isSendingEmails}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="8"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Hi {{contactName}},

I came across {{companyName}} and wanted to reach out...

Available variables: {{companyName}}, {{contactName}}, {{email}}, {{phone}}, {{website}}, {{location}}"
                  disabled={isSendingEmails}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📧 Leads with valid emails:{" "}
                  {leads.filter((l) => l.email && l.email.includes("@")).length}{" "}
                  / {leads.length}
                </p>
              </div>
              <button
                onClick={sendEmails}
                disabled={isSendingEmails}
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
                    Send Bulk Emails
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Leads Table */}
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
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Website
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {lead.companyName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {lead.contactName}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        {lead.email || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {lead.phone || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Visit
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {lead.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
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
