import { Check, Loader2, Mail } from "lucide-react";

export const EmailComposer = ({
  show,
  emailSubject,
  setEmailSubject,
  emailMessage,
  setEmailMessage,
  isSendingEmails,
  onSendToAll,
  onSendToSelected,
  unsentLeadsCount,
  selectedLeadsCount,
  totalLeads,
}) => {
  if (!show) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Email Composer</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-semibold mb-1">
              📧 Send to All Unsent
            </p>
            <p className="text-xs text-blue-600">
              Unsent leads with valid emails: {unsentLeadsCount} / {totalLeads}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ✓ Only unsent leads will receive emails
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800 font-semibold mb-1">
              ✅ Send to Selected
            </p>
            <p className="text-xs text-purple-600">
              Selected leads: {selectedLeadsCount}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              ✓ Only selected leads with valid emails
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onSendToAll}
            disabled={isSendingEmails || unsentLeadsCount === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isSendingEmails ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending...
              </>
            ) : (
              <>
                <Mail size={20} />
                Send to All Unsent ({unsentLeadsCount})
              </>
            )}
          </button>

          <button
            onClick={onSendToSelected}
            disabled={isSendingEmails || selectedLeadsCount === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isSendingEmails ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending...
              </>
            ) : (
              <>
                <Check size={20} />
                Send to Selected ({selectedLeadsCount})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
