export const BackendErrorAlert = ({ backendStatus }) => {
  if (backendStatus !== "disconnected") return null;

  return (
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
          <code className="bg-red-100 px-2 py-1 rounded">node server.js</code>
        </li>
        <li>Refresh this page</li>
      </ol>
    </div>
  );
};
