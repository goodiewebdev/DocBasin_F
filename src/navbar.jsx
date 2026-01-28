import { Link } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import "./navbar.css";
import {
  ClipboardCheck,
  LayoutDashboard,
  MenuIcon,
  PlusIcon,
  LogOut,
  User2Icon,
  UserRound,
} from "lucide-react";
import { useModal } from "./modalcontext.jsx";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();

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
    navigate("/login");
    window.location.reload();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
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
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    fetchUser();
  }, [handleLogout]);

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        {isAuthenticated() ? (
          <Link to="/dashboard/" style={styles.link}>
            ContactBin
          </Link>
        ) : (
          <Link to="/" style={styles.link}>
            ContactBin
          </Link>
        )}
      </div>

      <div style={styles.menu}>
        {!isAuthenticated() ? (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              <button style={styles.signupButton}>Sign Up</button>
            </Link>
          </>
        ) : (
          <>
            <div className="rightMenuItems">
              <Link to="/dashboard">
                <div className="userDetailsRight">
                  <div>
                    <UserRound size={25} className="userDetailsRightIcon" />
                  </div>
                  <div className="userDetailsRightText">
                    <p>{user?.name}</p>
                    <p className="udrt2">{user?.email}</p>
                  </div>
                </div>
              </Link>
              <MenuIcon
                size={22}
                className="mobileMenuMainIcon"
                onClick={() =>
                  openModal(
                    <div className="optionsInModal">
                      <Link
                        to="/dashboard"
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        <button className="exportBtn">
                          {" "}
                          <LayoutDashboard
                            size={20}
                            style={styles.mobileMenuIcon}
                          />
                          Dashboard
                        </button>
                      </Link>

                      <Link to="/dashboard/addcontactlist">
                        <button
                          className="delete-option"
                          onClick={() => {
                            closeModal();
                          }}
                        >
                          {" "}
                          <PlusIcon size={20} style={styles.mobileMenuIcon} />
                          Create Contact List
                        </button>
                      </Link>

                      <Link
                        to="/dashboard/mycontactlists"
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        <button>
                          {" "}
                          <ClipboardCheck
                            size={20}
                            style={styles.mobileMenuIcon}
                          />
                          Contact Lists
                        </button>
                      </Link>
                      <Link
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
                      </Link>
                    </div>,
                  )
                }
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    backgroundColor: "#fff",
    color: "black",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 1000,
  },
  brand: {
    fontWeight: "bold",
    fontSize: "20px",
  },
  menu: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
  link: {
    color: "#111",
    textDecoration: "none",
  },
  user: {
    marginRight: "10px",
  },
  signupButton: {
    backgroundColor: "#7f3ff5",
    padding: "10px 15px",
    border: "none",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  mobileMenuIcon: {
    marginBottom: "-3px",
    marginRight: "10px",
    color: "#7f3ff5",
  },
  userDetailsRightIcon: {
    color: "#fff",
  },
};
export default Navbar;
