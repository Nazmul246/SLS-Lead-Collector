import { Download, Mail, Trash2 } from "lucide-react";

export const ActionButtonsBar = ({
  leads,
  onExport,
  onEmailToggle,
  onClear,
  unsentLeadsCount,
}) => {
  if (leads.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={onExport}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={20} />
          Export to CSV ({leads.length} leads)
        </button>

        <button
          onClick={onEmailToggle}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Mail size={20} />
          Send Emails {unsentLeadsCount > 0 && `(${unsentLeadsCount} unsent)`}
        </button>

        <button
          onClick={onClear}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 size={20} />
          Clear All
        </button>
      </div>
    </div>
  );
};
