import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import { fetchFacilities, fetchFacilityLabel } from "../services/facilityApi";

interface Facility {
  hospitalId: string;
  facilityName: string;
}

interface Props {
  name: string;
  value: string | null;
  onChange: (e: { target: { name: string; value: string } }) => void;
  className?: string;
  error?: string;
}

const FacilitySelector: React.FC<Props> = ({
  name,
  value,
  onChange,
  className,
}) => {
  const [search, setSearch] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFetchFacilities = async (name: string) => {
    setLoading(true);
    try {
      const data = await fetchFacilities(name);
      setFacilities(data);
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
      const timer = setTimeout(() => handleFetchFacilities(search), 300);
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
        const label = await fetchFacilityLabel(value);
        setSearch(label);
      } catch (err) {
        console.error("Label fetch error:", err);
      }
    };

    fetchLabel();
  }, [value]);

  return (
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
  );
};

export default FacilitySelector;
