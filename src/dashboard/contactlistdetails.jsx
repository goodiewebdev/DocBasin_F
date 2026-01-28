import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Spinner from "../utils/spinner.jsx";
import "./contactlistdetails.css";
import {
  ArrowLeft,
  Link2Icon,
  MoreHorizontal,
  Trash2Icon,
  Eye,
  Database,
  DownloadIcon,
  Edit2Icon,
  DeleteIcon,
} from "lucide-react";
import { useModal } from "../modalcontext.jsx";
import { useMessage } from "../messagecontext.jsx";

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

const ContactListDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const { showMessage } = useMessage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://docbasin.onrender.com/api/contactlist/${id}`, {
        headers: { Authorization: token },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch details");
      setData(result);
      setNameInput(result.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data?.contacts || data.contacts.length === 0) {
      showMessage("No contacts to export", "error");
      closeModal();
      return;
    }
    const headers = ["Name", "Email"];
    const rows = data.contacts.map((c) => [`"${c.name}"`, `"${c.email}"`]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${data.name.replace(/\s+/g, "_")}_contacts.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeModal();
    showMessage("Contacts exported as CSV", "success");
  };

  const updateListName = async () => {
    try {
      const res = await fetch(`https://docbasin.onrender.com/api/contactlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ name: nameInput }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setData((prev) => ({ ...prev, name: nameInput }));
      setIsEditingName(false);
      showMessage("Contact list updated successfully", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const deleteContact = async (contactId) => {
    try {
      const res = await fetch(
        `https://docbasin.onrender.com/api/contact/${contactId}`,
        {
          method: "DELETE",
          headers: { Authorization: localStorage.getItem("token") },
        },
      );
      if (res.ok) closeModal();
    } catch (err) {
      console.error("Error deleting contact:", err);
    } finally {
      showMessage("Contact deleted successfully", "success");
      fetchDetails();
    }
  };

  const deleteContactList = async (listId) => {
    try {
      const res = await fetch(
        `https://docbasin.onrender.com/api/contactlist/${listId}`,
        {
          method: "DELETE",
          headers: { Authorization: localStorage.getItem("token") },
        },
      );
      if (res.ok) {
        closeModal();
        showMessage("Contact list deleted successfully", "success");
        navigate("/dashboard/mycontactlists");
      }
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div className="error">No data found.</div>;

  return (
    <div className="detailsContainer">

      {isEditingName ? (
        <div className="editNameForm">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
          />
          <button onClick={updateListName}>Save</button>
        </div>
      ) : (
        <p className="cldHeading">{data.name}</p>
      )}

      <code className="apiLink">
        <Link2Icon size={18} className="cldLIcon" /> POST:
        https://docbasin.onrender.com/api/contact/{data._id}
      </code>

      <div className="countTotal">
        <p>
          TOTAL CONTACTS:{" "}
          <span className="tc">{data.contacts?.length || 0}</span>
        </p>
        <MoreHorizontal
          size={24}
          className="cldOptions"
          style={{ cursor: "pointer" }}
          onClick={() =>
            openModal(
              <div className="optionsInModal">
                <button onClick={exportToCSV} className="exportBtn">
                  <DownloadIcon size={20} className="optionsInModalI"/><Link>Export CSV</Link>
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(true);
                    closeModal();
                  }}
                >
                  <Edit2Icon size={20} className="optionsInModalI"/> <Link> Update</Link>
                </button>
                <button
                  className="delete-option"
                  onClick={() =>
                    openModal(
                      <ConfirmDelete
                        title={data.name}
                        onCancel={closeModal}
                        onConfirm={() => deleteContactList(data._id)}
                      />,
                    )
                  }
                >
                  <DeleteIcon size={20} className="optionsInModalI"/><Link> Delete</Link>
                </button>
              </div>,
            )
          }
        />
      </div>

      <div className="desktopView">
        <table className="contactsTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.contacts && data.contacts.length > 0 ? (
              data.contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </td>
                  <td className="tableActions">
                    <button
                      className="viewBtn2"
                      onClick={() =>
                        navigate(`/dashboard/contact/${contact._id}`)
                      }
                    >
                      View
                    </button>
                    <Trash2Icon
                      className="trashIcon"
                      onClick={() =>
                        openModal(
                          <ConfirmDelete
                            title={contact.name}
                            onCancel={closeModal}
                            onConfirm={() => {
                              deleteContact(contact._id);
                              closeModal();
                            }}
                          />,
                        )
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mobileView">
        {data.contacts && data.contacts.length > 0 ? (
          data.contacts.map((contact) => (
            <div key={contact._id} className="contactCard">
              <div className="cardMain">
                <p className="cardName">{contact.name}</p>
                <p className="cardEmail">{contact.email}</p>
              </div>
              <div className="cardActions">
                <button
                  className="mobileViewBtn"
                  onClick={() => navigate(`/dashboard/contact/${contact._id}`)}
                >
                  <Eye size={18} />
                </button>
                <button
                  className="mobileTrashBtn"
                  onClick={() =>
                    openModal(
                      <ConfirmDelete
                        title={contact.name}
                        onCancel={closeModal}
                        onConfirm={() => {
                          deleteContact(contact._id);
                          closeModal();
                        }}
                      />,
                    )
                  }
                >
                  <Trash2Icon size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="noDataMsg">No contacts found in this list.</p>
        )}
      </div>
    </div>
  );
};

export default ContactListDetails;
