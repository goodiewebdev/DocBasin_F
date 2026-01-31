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
  }, [navigate, showMessage, closeModal]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          handleLogout();
          return;
        }

        const res = await fetch("https://docbasin.onrender.com/api/users/me", {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          handleLogout();
          return;
        }

        const data = await res.json();

        if (data && data.isAccountVerified === false) {
          showMessage("Please verify your email to access the dashboard.", "error");
          navigate("/verifyemail");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    fetchUser();
  }, [handleLogout, navigate, showMessage]);

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-menu">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <LayoutDashboard size={18} className="dashboardSidebarIcon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/dashboard/addcontactlist"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <PlusIcon size={18} className="dashboardSidebarIcon" />
            <span>Add Contact List</span>
          </NavLink>

          <NavLink
            to="/dashboard/mycontactlists"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <ClipboardCheck size={18} className="dashboardSidebarIcon" />
            <span>My Contact Lists</span>
          </NavLink>

          <NavLink
            to="/dashboard/userprofile"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <User size={18} className="dashboardSidebarIcon" />
            <span>Profile</span>
          </NavLink>

          <div
            className="menu-item logout"
            onClick={() =>
              openModal(
                <ConfirmLogout
                  onCancel={closeModal}
                  onConfirm={() => handleLogout()}
                />
              )
            }
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

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