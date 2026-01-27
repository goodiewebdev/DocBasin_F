import { useEffect, useCallback, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  User,
  ClipboardCheck,
  PlusIcon,
} from "lucide-react";
import DashboardHome from "./dashboardhome.jsx";
import UserProfile from "./userprofile.jsx";
import AddContactList from "./addcontactlist.jsx";
import UserContactLists from "./usercontactlists.jsx";
import ContactListDetails from "./contactlistdetails.jsx";
import ContactDetails from "./contactdetails.jsx";
import { useModal } from "../modalcontext.jsx";
import { useMessage } from "../messagecontext.jsx";
import "./dashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const { openModal, closeModal } = useModal();
  const { showMessage } = useMessage();

  const ConfirmLogout = ({ onConfirm, onCancel }) => (
    <div className="confirm-content">
      <p>You are about to Logout. Are you sure?</p>
      <div className="confirm-actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="danger-btn" onClick={onConfirm}>
          Yes, Logout
        </button>
      </div>
    </div>
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    closeModal();
    navigate("/login");
    showMessage("Logged out successfully", "success");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, showMessage]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          handleLogout();
          return;
        }

        const res = await fetch("http://localhost:7000/api/users/me", {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          handleLogout();
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    fetchUser();
  }, [handleLogout]);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-menu">
          <NavLink to="/dashboard" end className="menu-item">
            <div className="active">
              <LayoutDashboard size={18} className="dashboardSidebarIcon" />
              <span>Dashboard</span>
            </div>
          </NavLink>

          <NavLink to="/dashboard/addcontactlist" className="menu-item">
            <div>
              <PlusIcon size={18} className="dashboardSidebarIcon" />
              <span>Add Contact List</span>
            </div>
          </NavLink>

          <NavLink to="/dashboard/mycontactlists" className="menu-item">
            <div>
              <ClipboardCheck size={18} className="dashboardSidebarIcon" />
              <span>My Contact Lists</span>
            </div>
          </NavLink>

          <NavLink to="/dashboard/userprofile" className="menu-item">
            <div>
              <User size={18} className="dashboardSidebarIcon" />
              <span>Profile</span>
            </div>
          </NavLink>

          <div
            className="menu-item logout"
            onClick={() =>
              openModal(
                <ConfirmLogout
                  onCancel={closeModal}
                  onConfirm={() => handleLogout()}
                />,
              )
            }
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main">
        <Routes>
          <Route path="/" element={<DashboardHome user={user} />} />
          <Route path="userprofile" element={<UserProfile user={user} />} />
          <Route
            path="addcontactlist"
            element={<AddContactList user={user} />}
          />
          <Route
            path="mycontactlists"
            element={<UserContactLists user={user} />}
          />
          <Route
            path="/contactlist/:id"
            element={<ContactListDetails user={user} />}
          />
          <Route path="/contact/:id" element={<ContactDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboard;
