import { CheckCircle, Loader2, XCircle } from "lucide-react";

export const PageHeader = ({
  title,
  description,
  icon: Icon,
  backendStatus,
}) => {
  return (
    <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl p-6 border border-white/30 mb-6">
      <div className="flex justify-between items-start flex-col-reverse gap-2 lg:flex-row lg:gap-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-6 w-6 text-green-300" />
            <h1 className="text-xl lg:text-3xl font-bold text-white">
              {title}
            </h1>
          </div>
          <p className="text-white">{description}</p>
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
            <div className="flex items-center gap-2 text-white bg-gray-50 px-3 py-2 rounded-lg">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm font-medium">Checking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
