import { CheckCircle, Loader2, XCircle } from "lucide-react";

export const PageHeader = ({
  title,
  description,
  icon: Icon,
  backendStatus,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          </div>
          <p className="text-gray-600">{description}</p>
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
              <span className="text-sm font-medium">Backend Disconnected</span>
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
  );
};
