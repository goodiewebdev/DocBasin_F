import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addcontactlist.css";
import { useMessage } from "../messagecontext.jsx";

const AddContactList = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:7000/api/contactlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Failed to create contact list", "error");
        return;
      }

      showMessage("Contact list created successfully", "success");
      setName("");

      setTimeout(() => {
        navigate("/dashboard/mycontactlists");
      }, 100);
    } catch (err) {
      console.error("Error creating contact list:", err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="addContactListForm">
        <h2>Add Contact List</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contact List Name"
          required
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Contact List"}
        </button>
      </form>
    </>
  );
};

export default AddContactList;
