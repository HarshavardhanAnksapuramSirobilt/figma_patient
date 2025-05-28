import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "./Input";
import { FormField } from "./FormField";

interface Facility {
  hospitalId: string;
  facilityName: string;
}

interface Props {
  name: string;
  label?: string;
  value: string | null;
  onChange: (e: { target: { name: string; value: string } }) => void;
  className?: string;
  error?: string;
}

const FacilitySelector: React.FC<Props> = ({
  name,
  label = "Select Facility",
  value,
  onChange,
  className,
  error,
}) => {
  const [search, setSearch] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFacilities = async (name: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ name, page: "0", size: "10" });
      const response = await axios.get(`http://localhost:8080/facilities/suggest?${params}`);
      setFacilities(response.data.results || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Facility fetch error:", err);
      setFacilities([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.length >= 1) {
      const timer = setTimeout(() => fetchFacilities(search), 300);
      return () => clearTimeout(timer);
    } else {
      setFacilities([]);
      setShowDropdown(false);
    }
  }, [search]);

  useEffect(() => {
    if (!value) {
      setSearch("");
      return;
    }

    const fetchLabel = async () => {
      try {
        const params = new URLSearchParams({ name: "", page: "0", size: "50" });
        const res = await axios.get(`http://localhost:8080/facilities/suggest?${params}`);
        const found = res.data.results.find((f: Facility) => f.hospitalId === value);
        if (found) setSearch(found.facilityName);
      } catch (err) {
        console.error("Label fetch error:", err);
      }
    };

    fetchLabel();
  }, [value]);

  return (
    <FormField label={label} error={error}>
      <div className={`relative w-full ${className ?? ""}`}>
        <Input
          type="text"
          name={name}
          value={search}
          placeholder="Search facility..."
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            if (facilities.length > 0) setShowDropdown(true);
          }}
        />

        {loading && <span className="text-xs mt-1 text-gray-500">Loading...</span>}

        {showDropdown && facilities.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-white border rounded max-h-48 overflow-auto shadow">
            {facilities.map((fac) => (
              <li
                key={fac.hospitalId}
                onClick={() => {
                  onChange({ target: { name, value: fac.hospitalId } });
                  setSearch(fac.facilityName);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              >
                {fac.facilityName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
};

export default FacilitySelector;
