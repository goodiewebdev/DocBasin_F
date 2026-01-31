import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./usercontactlists.css";
import { Trash2Icon } from "lucide-react";
import { useModal } from "../modalcontext.jsx";
import { useMessage } from "../messagecontext.jsx";
import Spinner from "../utils/spinner.jsx";

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

const AddListModal = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://docbasin.onrender.com/api/contactlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to create contact list", "error");
        return;
      }

      showMessage("Contact list created successfully", "success");
      onSuccess();
    } catch (err) {
      console.error("Error creating list:", err);
      showMessage("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="addContactListForm">
      <h2>Add Contact List</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Contact List Name e.g Drop Your Email..."
        required
        autoComplete="off"
      />
      <div className="confirm-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

const UserContactLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { openModal, closeModal } = useModal();

  const fetchContactLists = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(
        "https://docbasin.onrender.com/api/contactlist/mycontactlist",
        {
          headers: { Authorization: token },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message || "Failed to fetch lists");
        showMessage("Could not load contact lists", "error");
        return;
      }

      setLists(data);
    } catch (err) {
      console.error("Error fetching contact lists:", err);
      showMessage("Network error while loading lists", "error");
    }
  };

  useEffect(() => {
    fetchContactLists().finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const deleteContactList = async (id) => {
    try {
      const res = await fetch(
        `https://docbasin.onrender.com/api/contactlist/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      if (res.ok) {
        setLists((prev) => prev.filter((list) => list._id !== id));
        closeModal();
        showMessage("Contact list deleted successfully", "success");
      } else {
        const data = await res.json();
        showMessage(data.message || "Failed to delete list", "error");
      }
    } catch (err) {
      console.error("Error deleting list:", err);
      showMessage("Error deleting contact list", "error");
    }
  };

  const handleAddSuccess = async () => {
    closeModal();
    await fetchContactLists();
  };

  if (loading) return <Spinner />;

  return (
    <div className="contactListsPage">
      <div className="contactListsHeader">
        <p className="countTotal">TOTAL CONTACT LIST: {lists.length}</p>
        <button
          onClick={() =>
            openModal(
              <AddListModal onCancel={closeModal} onSuccess={handleAddSuccess} />
            )
          }
        >
         Add List
        </button>
      </div>

      {lists.length === 0 ? (
        <p className="emptyState">No contact lists found.</p>
      ) : (
        <div className="contactListsMain">
          {lists.map((list) => (
            <div key={list._id} className="contactListCard">
              <h3>{list.name}</h3>
              <p>
                Created: {new Date(list.createdAt).toLocaleDateString()}
              </p>
              <div className="contactListActions">
                <button
                  className="viewBtn"
                  onClick={() =>
                    navigate(`/dashboard/contactlist/${list._id}`)
                  }
                >
                  View
                </button>
                <div className="actionIcons">
                  <Link>
                    <Trash2Icon
                      size={20}
                      className="contactListActionsIcons trash"
                      onClick={() =>
                        openModal(
                          <ConfirmDelete
                            title={list.name}
                            onCancel={closeModal}
                            onConfirm={() => deleteContactList(list._id)}
                          />
                        )
                      }
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserContactLists;