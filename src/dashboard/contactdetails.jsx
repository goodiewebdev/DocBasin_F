import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2Icon, Edit3, Save, X } from "lucide-react";
import { useModal } from "../modalcontext.jsx";
import { useMessage } from "../messagecontext.jsx";
import "./contactdetails.css";

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { openModal, closeModal } = useModal();
  const { showMessage } = useMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const fetchContact = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://docbasin.onrender.com/api/contact/${id}`, {
        headers: { Authorization: token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch contact");

      setContact(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://docbasin.onrender.com/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        showMessage("Failed to update contact", "error");
        return;
      }

      showMessage("Contact updated successfully", "success");
      closeModal();
      setIsEditing(false);
      fetchContact();
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const deleteContact = async () => {
    try {
      const res = await fetch(`https://docbasin.onrender.com/api/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to delete contact", "error");
        return;
      }

      showMessage("Contact deleted successfully", "success");
      closeModal();

      setTimeout(() => {
        navigate(-1);
      }, 300);
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  useEffect(() => {
    fetchContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const ConfirmDelete = ({ title, onConfirm, onCancel }) => (
    <div className="confirm-content">
      <p>
        You are about to delete <strong>{title}</strong>. This action cannot be
        undone.
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

  const ConfirmUpdate = ({ onConfirm, onCancel }) => (
    <div className="confirm-content">
      <p>Save changes to this contact?</p>
      <div className="confirm-actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="danger-btn" onClick={onConfirm}>
          Yes, Save
        </button>
      </div>
    </div>
  );

  if (loading) return <p className="loading">Loading contact...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="detailsContainer33">
      <div className="headerActions33">
        <button onClick={() => navigate(-1)} className="dcButn">
          <ArrowLeft size={20} className="cldArrow" /> Back
        </button>

        {!isEditing ? (
          <div className="actionb">
            <Link>
              <button className="editBtn33" onClick={() => setIsEditing(true)}>
                <Edit3 size={18} /> Edit
              </button>
            </Link>

            <Link>
              <Trash2Icon
                size={22}
                className="trashIcon33"
                onClick={() =>
                  openModal(
                    <ConfirmDelete
                      title={contact.name}
                      onCancel={closeModal}
                      onConfirm={deleteContact}
                    />,
                  )
                }
              />
            </Link>
          </div>
        ) : (
          <div className="editControls33">
            <button className="cancelBtn33" onClick={() => setIsEditing(false)}>
              <X size={18} /> Cancel
            </button>
            <button
              className="saveBtn33"
              onClick={() =>
                openModal(
                  <ConfirmUpdate
                    onCancel={closeModal}
                    onConfirm={handleUpdate}
                  />,
                )
              }
            >
              <Save size={18} /> Save
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="editForm33">
          <label>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
          />

          <label>Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
          />

          <label>Phone Number</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      ) : (
        <div className="contactInfo33">
          <p>
            <strong>Name:</strong>{" "}
            <span className="contactInfo33Name">{contact.name}</span>
          </p>
          <p>
            <strong>Email:</strong> <span>{contact.email}</span>
          </p>
          <p>
            <strong>Phone:</strong> <span>{contact.phone}</span>
          </p>
          <p>
            <strong>Created:</strong>{" "}
            <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;
