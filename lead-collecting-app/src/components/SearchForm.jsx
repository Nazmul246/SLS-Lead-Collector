import { Loader2, MapPin, Play, Search } from "lucide-react";

export const SearchForm = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  maxLeads,
  setMaxLeads,
  isCollecting,
  onStartCollection,
  backendStatus,
}) => {
  return (
    <div className="backdrop-blur-lg bg-white/15 rounded-lg shadow-2xl border border-white/30 p-6 mb-6 search-form-wrapper">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              Search Query
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., toy store, restaurants, dental clinic"
              disabled={isCollecting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
            />
            <p className="mt-1 text-sm text-white">
              What type of business are you looking for?
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Canada, New York, Tokyo"
              disabled={isCollecting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
            />
            <p className="mt-1 text-sm text-white">City, state, or country</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Max Leads to Collect
          </label>
          <input
            type="number"
            value={maxLeads}
            onChange={(e) => setMaxLeads(parseInt(e.target.value) || 50)}
            min="1"
            max="500"
            disabled={isCollecting}
            className="text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={onStartCollection}
          disabled={isCollecting || backendStatus !== "connected"}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {isCollecting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Collecting Leads from Google Maps...
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
  );
};
