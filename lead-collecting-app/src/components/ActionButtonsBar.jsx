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
    <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-6 mb-6">
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={onExport}
          className="flex-1 flex-col lg:flex-row bg-green-600 hover:bg-green-700 text-white cursor-pointer font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={20} />
          Export to CSV ({leads.length} leads)
        </button>

        <button
          onClick={onEmailToggle}
          className="flex-1 flex-col lg:flex-row bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 cursor-pointer rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Mail size={20} />
          Send Emails {unsentLeadsCount > 0 && `(${unsentLeadsCount} unsent)`}
        </button>

        <button
          onClick={onClear}
          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 size={20} />
          Clear All
        </button>
      </div>
    </div>
  );
};
