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
import { PageHeader } from "../components/PageHeader";
import { StatsDashboard } from "../components/StatsDashboard";
import { SearchForm } from "../components/SearchForm";
import { ActionButtonsBar } from "../components/ActionButtonsBar";
import { EmailComposer } from "../components/EmailComposer";
import { LeadsTable } from "../components/LeadsTable";
import { BackendErrorAlert } from "../components/BackendErrorAlert";
import bgVideo from "../assets/bg2.mp4";

const API_URL = "https://united-gwennie-shoplift-studio-ce4f7ede.koyeb.app/api";

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

  const [selectedLeads, setSelectedLeads] = useState([]);

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

  // NEW: Update manual entry for a lead
  const updateManualEntry = async (leadId, formData) => {
    try {
      console.log("Updating manual entry for lead:", leadId);
      console.log("Form data:", formData);

      const response = await fetch(
        `${API_URL}/leads/google-maps/${leadId}/manual-entry`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        await loadExistingLeads();
        await loadStats();
      } else {
        throw new Error(data.error || "Failed to update manual entry");
      }
    } catch (error) {
      alert("Error updating manual entry: " + error.message);
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

  // NEW: Handle lead selection
  const handleToggleSelect = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((l) => l._id || l.id));
    }
  };

  // NEW: Update lead notes
  const updateLeadNote = async (leadId, notes) => {
    try {
      console.log("Updating note for lead:", leadId);
      console.log("Note content:", notes);

      const response = await fetch(
        `${API_URL}/leads/google-maps/${leadId}/notes`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        }
      );

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        await loadExistingLeads();
      } else {
        throw new Error(data.error || "Failed to update note");
      }
    } catch (error) {
      alert("Error updating note: " + error.message);
    }
  };

  // NEW: Send emails to selected leads
  const sendEmailsToSelected = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert("Please enter both subject and message");
      return;
    }

    if (selectedLeads.length === 0) {
      alert("No leads selected");
      return;
    }

    // Filter selected leads that have valid emails
    const selectedLeadsWithEmail = leads.filter(
      (l) =>
        selectedLeads.includes(l._id || l.id) &&
        l.email &&
        l.email.includes("@")
    );

    if (selectedLeadsWithEmail.length === 0) {
      alert("No selected leads with valid email addresses found");
      return;
    }

    if (
      !window.confirm(
        `Send email to ${selectedLeadsWithEmail.length} selected leads?`
      )
    ) {
      return;
    }

    setIsSendingEmails(true);

    try {
      const response = await fetch(`${API_URL}/send-emails-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          message: emailMessage,
          leadIds: selectedLeads,
          leadsType: "google-maps",
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `Emails sent to selected leads!\n✅ Successful: ${data.sent}\n❌ Failed: ${data.failed}`
        );
        setEmailSubject("");
        setEmailMessage("");
        setShowEmailComposer(false);
        setSelectedLeads([]);
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

  // UPDATED: Send emails to all unsent
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

    if (!window.confirm(`Send email to ${leadsToSend.length} unsent leads?`)) {
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

  const selectedLeadsWithEmailCount = leads.filter(
    (l) =>
      selectedLeads.includes(l._id || l.id) && l.email && l.email.includes("@")
  ).length;

  return (
    <div className="min-h-screen p-6">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 pointer-events-none md:object-center object-[30%_30%]"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional: Dark overlay for better readability */}

      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black/60 via-purple-900/40 to-black/50 -z-10"></div>
      <div className="max-w-400 mx-auto">
        <PageHeader
          icon={MapPin}
          title="Google Maps Lead Generation"
          description="Collect business leads with contact info and social media from Google Maps"
          backendStatus={backendStatus}
        />

        <StatsDashboard stats={stats} />

        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          location={location}
          setLocation={setLocation}
          maxLeads={maxLeads}
          setMaxLeads={setMaxLeads}
          isCollecting={isCollecting}
          onStartCollection={startCollection}
          backendStatus={backendStatus}
        />

        <ActionButtonsBar
          leads={leads}
          onExport={exportToExcel}
          onEmailToggle={() => setShowEmailComposer(!showEmailComposer)}
          onClear={clearLeads}
          unsentLeadsCount={unsentLeadsCount}
        />

        <EmailComposer
          show={showEmailComposer}
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
          emailMessage={emailMessage}
          setEmailMessage={setEmailMessage}
          isSendingEmails={isSendingEmails}
          onSendToAll={sendEmails}
          onSendToSelected={sendEmailsToSelected}
          unsentLeadsCount={unsentLeadsCount}
          selectedLeadsCount={selectedLeadsWithEmailCount}
          totalLeads={leads.length}
        />

        <LeadsTable
          leads={leads}
          onDeleteLead={deleteLead}
          deletingLeadId={deletingLeadId}
          selectedLeads={selectedLeads}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onUpdateNote={updateLeadNote}
          onUpdateManualEntry={updateManualEntry}
        />

        <BackendErrorAlert backendStatus={backendStatus} />
      </div>
    </div>
  );
}
