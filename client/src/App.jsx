import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Pencil, Trash2, Users, UserCheck, UserX, X } from "lucide-react";

const emptyForm = {
  visitorName: "",
  mobileNumber: "",
  email: "",
  organization: "",
  personToMeet: "",
  purpose: "",
  visitDateTime: "",
  status: "Checked In"
};

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function App() {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadVisitors = async (query = search) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/visitors?search=${encodeURIComponent(query)}`);
      setVisitors(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load visitors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors("");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadVisitors(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  };

  const openEdit = (visitor) => {
    setEditingId(visitor._id);
    setForm({
      visitorName: visitor.visitorName || "",
      mobileNumber: visitor.mobileNumber || "",
      email: visitor.email || "",
      organization: visitor.organization || "",
      personToMeet: visitor.personToMeet || "",
      purpose: visitor.purpose || "",
      visitDateTime: visitor.visitDateTime
        ? new Date(visitor.visitDateTime).toISOString().slice(0, 16)
        : "",
      status: visitor.status || "Checked In"
    });
    setShowForm(true);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/visitors/${editingId}`, form);
        setMessage("Visitor details updated successfully.");
      } else {
        await axios.post("/api/visitors", form);
        setMessage("Visitor added successfully.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadVisitors();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor?")) return;
    try {
      await axios.delete(`/api/visitors/${id}`);
      setMessage("Visitor deleted successfully.");
      await loadVisitors();
    } catch (error) {
      setMessage("Could not delete visitor.");
    }
  };

  const checkedIn = visitors.filter(v => v.status === "Checked In").length;
  const checkedOut = visitors.filter(v => v.status === "Checked Out").length;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">MERN STACK PROJECT</p>
          <h1>Employee Visitor Management</h1>
          <p className="subtitle">Digitally manage visitor records, check-ins and check-outs.</p>
        </div>
        <button className="primary-btn" onClick={openAdd}>
          <Plus size={19} /> Add Visitor
        </button>
      </header>

      <main className="container">
        {message && <div className="alert">{message}</div>}

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon"><Users size={22} /></div>
            <div><span>Total Visitors</span><strong>{visitors.length}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><UserCheck size={22} /></div>
            <div><span>Checked In</span><strong>{checkedIn}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><UserX size={22} /></div>
            <div><span>Checked Out</span><strong>{checkedOut}</strong></div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Visitor Records</h2>
              <p>Search by visitor name or mobile number.</p>
            </div>
            <div className="search-box">
              <Search size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or mobile..."
              />
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Contact</th>
                  <th>Organization / College</th>
                  <th>Person to Meet</th>
                  <th>Purpose</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="empty">Loading...</td></tr>
                ) : visitors.length === 0 ? (
                  <tr><td colSpan="8" className="empty">No visitor records found.</td></tr>
                ) : visitors.map(visitor => (
                  <tr key={visitor._id}>
                    <td><strong>{visitor.visitorName}</strong></td>
                    <td>
                      <div>{visitor.mobileNumber}</div>
                      <small>{visitor.email || "No email"}</small>
                    </td>
                    <td>{visitor.organization || "-"}</td>
                    <td>{visitor.personToMeet}</td>
                    <td>{visitor.purpose}</td>
                    <td>{formatDate(visitor.visitDateTime)}</td>
                    <td>
                      <span className={`badge ${visitor.status === "Checked In" ? "in" : "out"}`}>
                        {visitor.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="icon-btn edit" onClick={() => openEdit(visitor)} title="Edit">
                          <Pencil size={17} />
                        </button>
                        <button className="icon-btn delete" onClick={() => handleDelete(visitor._id)} title="Delete">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-head">
              <div>
                <h2>{editingId ? "Update Visitor" : "Add New Visitor"}</h2>
                <p>Enter the visitor information below.</p>
              </div>
              <button className="close-btn" onClick={() => setShowForm(false)}><X /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Visitor Name *
                  <input name="visitorName" value={form.visitorName} onChange={handleChange} required />
                </label>
                <label>
                  Mobile Number *
                  <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
                </label>
                <label>
                  Email Address
                  <input type="email" name="email" value={form.email} onChange={handleChange} />
                </label>
                <label>
                  Organization / College Name
                  <input name="organization" value={form.organization} onChange={handleChange} />
                </label>
                <label>
                  Person to Meet *
                  <input name="personToMeet" value={form.personToMeet} onChange={handleChange} required />
                </label>
                <label>
                  Purpose of Visit *
                  <input name="purpose" value={form.purpose} onChange={handleChange} required />
                </label>
                <label>
                  Date & Time *
                  <input type="datetime-local" name="visitDateTime" value={form.visitDateTime} onChange={handleChange} required />
                </label>
                <label>
                  Status
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option>Checked In</option>
                    <option>Checked Out</option>
                  </select>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-btn">{editingId ? "Update Visitor" : "Save Visitor"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;