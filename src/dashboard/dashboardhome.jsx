import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2Icon } from "lucide-react";
import { useModal } from "../modalcontext.jsx";
import { useMessage } from "../messagecontext.jsx";
import  Spinner2 from "../utils/spinner2.jsx";

const ConfirmDelete = ({ title, onConfirm, onCancel }) => (
  <div className="confirm-content">
    <p>
      You are about to delete <strong>{title}</strong> and every contact in it.
      This action cannot be undone.
    </p>
    <div className="confirm-actions">
      <button className="cancel-btn" onClick={onCancel}>
        Cancel
      </button>
      <button className="danger-btn" onClick={onConfirm}>
        Yes, Delete
      </button>
    </div>
  </div>
);

const DashboardHome = () => {
  const [contactListCount, setContactListCount] = useState(0);
  const [latestContactList, setLatestContactList] = useState(null);
  const [loading, setLoading] = useState(true);

  const [listName, setListName] = useState("");
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const { showMessage } = useMessage();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      const countRes = await fetch(
        "https://docbasin.onrender.com/api/contactlist/mycontactlist",
        { headers: { Authorization: token } },
      );
      const countData = await countRes.json();
      if (countRes.ok) setContactListCount(countData.length);

      const latestRes = await fetch(
        "https://docbasin.onrender.com/api/contactlist/latest",
        { headers: { Authorization: token } },
      );
      const latestData = await latestRes.json();
      setLatestContactList(latestRes.ok ? latestData : null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createContactList = async (e) => {
    e.preventDefault();
    if (!listName.trim()) return;

    try {
      setCreating(true);
      const token = localStorage.getItem("token");

      const res = await fetch("https://docbasin.onrender.com/api/contactlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: listName }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to create contact list", "error");
        return;
      }

      showMessage("Contact list created successfully", "success");
      setListName("");
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating contact list:", err);
    } finally {
      setCreating(false);
    }
  };

  const deleteContactList = async (id) => {
    try {
      const res = await fetch(`https://docbasin.onrender.com/api/contactlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (res.ok) {
        closeModal();
        showMessage("Contact list deleted successfully", "success");
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error deleting contact list:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <>
      <div className="dbh-main">
        {/*<header className="topbar">
        <div className="user-info">Overview</div>
      </header>*/}

      <section className="content">
        <div className="cards">
          <div className="card">
            <h3>Total Contact Lists</h3>
            <p>{loading ? "0" : contactListCount}</p>
          </div>

          <div className="card">
            <h3>Total Leads</h3>
            <p>0</p>
          </div>

          <div className="card">
            <h3>API Integrations</h3>
            <p>0</p>
          </div>
        </div>
      </section>

      {/*<header className="topbar space-dbh">
        <div className="user-info">
          <span>Latest Updated Contact List</span>
        </div>
      </header>*/}

      <section className="contactListsMain">
        {loading ? (
          <Spinner2 />
        ) : latestContactList ? (
          <div className="contactListCard">
            <h3>{latestContactList.name}</h3>
            <p>
              Created:{" "}
              {new Date(latestContactList.createdAt).toLocaleDateString()}
            </p>

            <div className="contactListActions">
              <button
                className="viewBtn"
                onClick={() =>
                  navigate(`/dashboard/contactlist/${latestContactList._id}`)
                }
              >
                View
              </button>

              <Link>
                <Trash2Icon
                  size={20}
                  className="contactListActionsIcons trash"
                  onClick={() =>
                    openModal(
                      <ConfirmDelete
                        title={latestContactList.name}
                        onCancel={closeModal}
                        onConfirm={() =>
                          deleteContactList(latestContactList._id)
                        }
                      />,
                    )
                  }
                />
              </Link>
            </div>
          </div>
        ) : (
          <p className="emptyState">No contact lists found.</p>
        )}
      </section>

      <div className="space-dbh"></div>

      {/*<header className="topbar space-dbh">
        <div className="user-info">
          <span>Create Contact List</span>
        </div>
      </header>*/}

      <section className="content">
        <form className="contactListRowForm" onSubmit={createContactList}>
          <input
            type="text"
            placeholder="New contact list name..."
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            disabled={creating}
            required
          />
          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Contact List"}
          </button>
        </form>
      </section>
      </div>
    </>
  );
};

export default DashboardHome;
