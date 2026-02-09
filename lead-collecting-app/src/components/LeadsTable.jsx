import React, { useState } from "react";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MailCheck,
  MapPinned,
  Phone,
  Twitter,
  X,
  Check,
  Edit2,
  Save,
  Edit,
  Eye,
  MousePointer,
} from "lucide-react";
import { ManualEntryModal } from "./ManualEntryModal";

export const LeadsTable = ({
  leads,
  onDeleteLead,
  deletingLeadId,
  selectedLeads,
  onToggleSelect,
  onToggleSelectAll,
  onUpdateNote,
  onUpdateManualEntry,
}) => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [manualEntryLead, setManualEntryLead] = useState(null);

  if (leads.length === 0) return null;

  const allSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const someSelected = selectedLeads.length > 0 && !allSelected;

  const handleStartEdit = (lead) => {
    setEditingNoteId(lead._id || lead.id);
    setNoteText(lead.notes || "");
  };

  const handleSaveNote = async (leadId) => {
    setSavingNoteId(leadId);
    await onUpdateNote(leadId, noteText);
    setSavingNoteId(null);
    setEditingNoteId(null);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setNoteText("");
  };

  const handleOpenManualEntry = (lead) => {
    setManualEntryLead(lead);
  };

  const handleCloseManualEntry = () => {
    setManualEntryLead(null);
  };

  const handleSaveManualEntry = async (formData) => {
    await onUpdateManualEntry(
      manualEntryLead._id || manualEntryLead.id,
      formData,
    );
    setManualEntryLead(null);
  };

  return (
    <>
      <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Collected Leads ({leads.length})
          {selectedLeads.length > 0 && (
            <span className="ml-2 text-sm text-purple-600">
              ({selectedLeads.length} selected)
            </span>
            // checking the git push
          )}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="backdrop-blur-lg bg-white/15 shadow-2xl border border-white/30">
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  Business Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  Contact Info
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  Social Media
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white min-w-[200px]">
                  Notes
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => {
                const leadId = lead._id || lead.id;
                const isSelected = selectedLeads.includes(leadId);
                const isEditing = editingNoteId === leadId;
                const isSaving = savingNoteId === leadId;

                return (
                  <tr
                    key={leadId}
                    className={`${
                      index % 2 === 0
                        ? "backdrop-blur-lg bg-white/70 shadow-2xl"
                        : "backdrop-blur-lg bg-white/60 shadow-2xl"
                    } ${isSelected ? "bg-purple-50" : ""}`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(leadId)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-0 py-0 lg:px-4 lg:py-3 max-w-70">
                      <div className="text-sm lg:font-medium text-gray-900">
                        {lead.businessName}
                      </div>
                      <div className="text-xs text-black">{lead.category}</div>
                    </td>
                    <td className="px-4 py-3 max-w-40 lg:max-w-50">
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
                              <div className="flex items-center gap-1 ml-1">
                                <MailCheck
                                  size={14}
                                  className="text-green-600"
                                  title="Email sent"
                                />
                                {/* Show if email was opened */}
                                {lead.tracking?.opened && (
                                  <Eye
                                    size={14}
                                    className="text-blue-600"
                                    title={`Opened ${lead.tracking.openCount || 1} time(s)`}
                                  />
                                )}
                                {/* Show if link was clicked */}
                                {lead.tracking?.clicked && (
                                  <MousePointer
                                    size={14}
                                    className="text-orange-600"
                                    title={`Clicked ${lead.tracking.clickCount || 1} time(s)`}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone size={14} className="text-purple-600" />
                            <span className="text-black font-bold">
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
                        {!lead.email && !lead.phone && !lead.website && (
                          <button
                            onClick={() => handleOpenManualEntry(lead)}
                            className="text-xs text-purple-600 hover:text-purple-800 underline"
                          >
                            + Add contact info
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center flex-wrap justify-center">
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
                            <button
                              onClick={() => handleOpenManualEntry(lead)}
                              className="text-xs text-red-500 hover:text-purple-800 cursor-pointer"
                            >
                              No social media found
                            </button>
                          )}
                        <button
                          onClick={() => handleOpenManualEntry(lead)}
                          className="text-gray-500 hover:text-purple-600 p-1 rounded hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Edit contact details"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-50">
                      <div className="flex items-start gap-1 text-sm text-black overflow-x-auto">
                        <MapPinned
                          size={14}
                          className="mt-0.5 flex-shrink-0 text-red-500"
                        />
                        <span className="whitespace-nowrap">
                          {lead.address || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-0 py-0 lg:px-4 lg:py-3">
                      <div className="text-center">
                        {lead.rating && (
                          <div className="font-medium text-yellow-600">
                            ⭐ {lead.rating}
                          </div>
                        )}
                        {lead.reviews && (
                          <div className="text-xs text-black">
                            {lead.reviews} reviews
                          </div>
                        )}
                        {!lead.rating && (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-100">
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add your notes..."
                            rows={3}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveNote(leadId)}
                              disabled={isSaving}
                              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs py-1 px-2 rounded flex items-center justify-center gap-1"
                            >
                              {isSaving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Save size={12} />
                              )}
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white text-xs py-1 px-2 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="relative group cursor-pointer"
                          onClick={() => handleStartEdit(lead)}
                        >
                          <div className="max-h-[80px] overflow-y-auto text-sm text-black pr-6">
                            {lead.notes || (
                              <span className="text-black italic">
                                Click to add notes...
                              </span>
                            )}
                          </div>
                          <Edit2
                            size={14}
                            className="absolute top-0 right-0 text-gray-400 group-hover:text-purple-600 transition-colors"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => onDeleteLead(leadId)}
                          disabled={deletingLeadId === leadId}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
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

      {/* Manual Entry Modal */}
      {manualEntryLead && (
        <ManualEntryModal
          lead={manualEntryLead}
          onClose={handleCloseManualEntry}
          onSave={handleSaveManualEntry}
        />
      )}
    </>
  );
};
