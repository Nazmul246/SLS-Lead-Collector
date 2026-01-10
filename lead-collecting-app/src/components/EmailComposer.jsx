import { Check, Loader2, Mail } from "lucide-react";
import { useRef, useEffect } from "react";

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
  const editorRef = useRef(null);

  useEffect(() => {
    if (show && editorRef.current) {
      editorRef.current.innerHTML = emailMessage;
    }
  }, [show]);

  const handleInput = () => {
    if (editorRef.current) {
      setEmailMessage(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

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

          {/* Rich Text Editor Toolbar */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => execCommand("bold")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 font-bold"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => execCommand("italic")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 italic"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => execCommand("underline")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 underline"
              title="Underline"
            >
              U
            </button>
            <button
              type="button"
              onClick={() => execCommand("strikeThrough")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 line-through"
              title="Strikethrough"
            >
              S
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => execCommand("formatBlock", "<h1>")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => execCommand("formatBlock", "<h2>")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => execCommand("formatBlock", "<p>")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
              title="Paragraph"
            >
              P
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => execCommand("insertUnorderedList")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => execCommand("insertOrderedList")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Numbered List"
            >
              1. List
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => execCommand("justifyLeft")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Align Left"
            >
              ⬅
            </button>
            <button
              type="button"
              onClick={() => execCommand("justifyCenter")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Align Center"
            >
              ↔
            </button>
            <button
              type="button"
              onClick={() => execCommand("justifyRight")}
              disabled={isSendingEmails}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Align Right"
            >
              ➡
            </button>
          </div>

          {/* Rich Text Editor Content Area */}
          <div
            ref={editorRef}
            contentEditable={!isSendingEmails}
            onInput={handleInput}
            className="w-full min-h-[200px] px-4 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              lineHeight: "1.6",
            }}
            data-placeholder="Hi {{businessName}},

I found your business on Google Maps...

Available variables: {{businessName}}, {{email}}, {{phone}}, {{website}}, {{address}}, {{rating}}"
          />
          <style>{`
            [contentEditable="true"]:empty:before {
              content: attr(data-placeholder);
              color: #9CA3AF;
              pointer-events: none;
              white-space: pre-wrap;
            }
          `}</style>
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
