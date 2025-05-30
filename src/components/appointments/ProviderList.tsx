import React, { useState, useEffect } from "react";
// Import from mock service
import { getProviders } from "../../services/mockService";

const ProviderList = ({ onSelectProvider, selectedProvider }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    const { success, data } = await getProviders();
    if (success) {
      setProviders(data);
    }
    setLoading(false);
  };

  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered input-sm w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredProviders.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No providers found</div>
          ) : (
            filteredProviders.map(provider => (
              <div
                key={provider.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedProvider?.id === provider.id
                    ? "bg-blue-100 border border-blue-300"
                    : "hover:bg-gray-100 border border-transparent"
                }`}
                onClick={() => onSelectProvider(provider)}
              >
                <div className="font-medium text-gray-800">{provider.name}</div>
                <div className="text-sm text-gray-600">{provider.specialty}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {provider.availability ? "Available" : "Unavailable"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderList;
