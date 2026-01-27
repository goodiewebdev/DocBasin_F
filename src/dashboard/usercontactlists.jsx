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

const UserContactLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { openModal, closeModal } = useModal();

  const deleteContactList = async (id) => {
    try {
      const res = await fetch(`https://docbasin.onrender.com/api/contactlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (res.ok) {
        setLists((prev) => prev.filter((list) => list._id !== id));
        closeModal();
        showMessage("Contact list deleted successfully", "success");
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  useEffect(() => {
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
            headers: {
              Authorization: token,
            },
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to fetch contact lists");
          return;
        }

        setLists(data);
      } catch (err) {
        console.error("Error fetching contact lists:", err);
        setMessage("Server error, please try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchContactLists();
  }, [navigate]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="contactListsPage">
      <div className="contactListsHeader">
        <p className="countTotal">TOTAL CONTACT LIST: {lists.length}</p>
        <button onClick={() => navigate("/dashboard/addcontactlist")}>
          + Add List
        </button>
      </div>

      {message && <p className="formMessageTwo error">{message}</p>}

      {lists.length === 0 ? (
        <p className="emptyState">No contact lists found.</p>
      ) : (
        <div className="contactListsMain">
          {lists.map((list) => (
            <div key={list._id} className="contactListCard">
              <h3>{list.name}</h3>
              <p>Created: {new Date(list.createdAt).toLocaleDateString()}</p>

              <div className="contactListActions">
                <button
                  className="viewBtn"
                  onClick={() => navigate(`/dashboard/contactlist/${list._id}`)}
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
                          />,
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
