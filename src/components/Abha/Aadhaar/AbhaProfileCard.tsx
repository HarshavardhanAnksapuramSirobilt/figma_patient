import { FaUser, FaBirthdayCake, FaPhoneAlt, FaMapMarkerAlt, FaIdBadge } from "react-icons/fa";

interface Props {
  profile: any;
  isNew: boolean;
  message: string;
}

export default function AbhaProfileCard({ profile, isNew, message }: Props) {
  return (
    <div className="p-6 bg-green-50 border border-green-300 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-green-700 mb-2">
        {isNew ? "🎉 ABHA ID Created Successfully" : "✅ Existing ABHA Account"}
      </h2>
      <p className="text-sm text-gray-600 mb-4">{message}</p>

      <div className="flex gap-4 items-start">
        {/* Profile Picture */}
        <img
          src={`data:image/jpeg;base64,${profile.photo}`}
          alt="Profile"
          className="w-24 h-24 rounded-full border shadow-md object-cover"
        />

        {/* Details */}
        <div className="flex-1 space-y-2 text-sm text-gray-800">
          <div className="flex items-center gap-2">
            <FaUser className="text-green-500" />
            <span className="font-medium">
              {profile.firstName} {profile.middleName} {profile.lastName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaBirthdayCake className="text-pink-400" />
            <span>DOB: {profile.dob}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-blue-500" />
            <span>{profile.mobile}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-yellow-600" />
            <span>
              {profile.address}, {profile.districtName}, {profile.stateName} - {profile.pinCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaIdBadge className="text-purple-600" />
            <span className="font-semibold">ABHA: {profile.ABHANumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">PHR Address:</span>
            <code className="bg-white px-2 py-1 rounded border">{profile.phrAddress?.[0]}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
