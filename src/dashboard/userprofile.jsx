import { useState } from "react";
import { MailIcon, User, Lock, CreditCard, Edit2, Check, X } from "lucide-react";
import Spinner from "../utils/spinner.jsx";
import "./userprofile.css";

const UserProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name, email: user?.email });

  if (!user) return <Spinner />;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="tabContent">
            <h2>Profile Details</h2>
            {isEditing ? (
              <form className="editForm" onSubmit={(e) => e.preventDefault()}>
                <div className="inputGroup">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="formActions">
                  <button onClick={() => setIsEditing(false)} className="saveBtn"><Check size={18}/> Save Changes</button>
                  <button onClick={() => setIsEditing(false)} className="cancelBtn"><X size={18}/> Cancel</button>
                </div>
              </form>
            ) : (
              <div className="detailsDisplay">
                <p><User size={20} className="userProfileIcons" /> {formData.name}</p>
                <p><MailIcon size={20} className="userProfileIcons" /> {formData.email}</p>
                <button onClick={() => setIsEditing(true)} className="editBtn">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        );
      case "password":
        return (
          <div className="tabContent">
            <h2>Security</h2>
            <form className="editForm">
              <div className="inputGroup">
                <label>New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="inputGroup">
                <label>Confirm New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <button type="button" className="saveBtn">Update Password</button>
            </form>
          </div>
        );
      case "billing":
        return (
          <div className="tabContent">
            <h2>Billing & Subscription</h2>
            <p className="placeholderText">No active invoices found.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pageWrapper">
      <div className="userProfileMainContainer">
        {/* Left Content Area */}
        <div className="userProfileSection">
          {renderContent()}
        </div>

        {/* Right Navigation Stack */}
        <div className="rightNavStack">
          <button 
            className={activeTab === "profile" ? "navBtn active" : "navBtn"} 
            onClick={() => setActiveTab("profile")}
          >
            <User size={20} className="userProfileIcons" /> Profile
          </button>
          <button 
            className={activeTab === "password" ? "navBtn active" : "navBtn"} 
            onClick={() => setActiveTab("password")}
          >
            <Lock size={20} className="userProfileIcons" /> Password
          </button>
          <button 
            className={activeTab === "billing" ? "navBtn active" : "navBtn"} 
            onClick={() => setActiveTab("billing")}
          >
            <CreditCard size={20} className="userProfileIcons" /> Billing
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;