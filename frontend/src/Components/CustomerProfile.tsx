import React, { useState } from "react";
import { LuCheck, LuPencilLine, LuX, LuUser } from "react-icons/lu";

const CustomerProfile: React.FC = () => {
  // Editable fields' states (for demo purposes)
  const [name, setName] = useState("Enter customer name");
  const [email, setEmail] = useState("Enter customer email");
  const [password, setPassword] = useState("Enter password");
  const [phone, setPhone] = useState("Enter phone number");
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Render editable fields
  const renderEditableField = (label: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>>, id: string) => {
    const isCurrentlyEditing = isEditing === id;
    
    const handleEdit = () => {
      setIsEditing(id);
    };
    
    const handleCancel = () => {
      setIsEditing(null);
    };
    
    const handleSubmit = (newValue: string) => {
      setValue(newValue);
      setIsEditing(null);
    };

    return (
      <div className="p-5 mb-6 border border-gray-200 rounded-lg shadow-sm transition-all hover:shadow-md bg-white">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-600">{label}</h3>
          <span className="text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded-full">Editable</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {isCurrentlyEditing ? (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full py-1 px-2 text-md font-semibold border-b-2 border-teal-500 focus:outline-none focus:border-teal-700"
              autoFocus
            />
          ) : (
            <div className="w-full py-1 text-md font-semibold">{value}</div>
          )}
          
          <div className="flex space-x-1">
            {isCurrentlyEditing ? (
              <>
                <button
                  onClick={() => handleCancel()}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                  aria-label="Cancel"
                >
                  <LuX className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSubmit(value)}
                  className="p-1 text-green-500 hover:bg-green-50 rounded-full"
                  aria-label="Save"
                >
                  <LuCheck className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="p-1 text-teal-500 hover:bg-teal-50 rounded-full"
                aria-label="Edit"
              >
                <LuPencilLine className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="w-24 h-24 bg-teal-500 text-white rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
            <LuUser className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Customer Profile</h2>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-teal-600">Personal Information</h3>
          <div className="h-px bg-gray-200 mb-4"></div>
          
          {/* Editable Fields */}
          {renderEditableField("Name", name, setName, "name")}
          {renderEditableField("Email", email, setEmail, "email")}
          {renderEditableField("Password", password, setPassword, "password")}
          {renderEditableField("Phone Number", phone, setPhone, "phone")}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
