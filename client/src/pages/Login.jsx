import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();

  // Fetch saved designs from backend
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/designs`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        setDesigns(data);
      } catch (err) {
        console.error("Error fetching designs:", err);
      }
    };
    fetchDesigns();
  }, []);

  const openDesign = (id) => {
    navigate(`/editor?id=${id}`); // ✅ pass design ID in URL
  };

  // ✅ Delete Design
  const deleteDesign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/designs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setDesigns((prev) => prev.filter((design) => design._id !== id));
    } catch (err) {
      console.error("Error deleting design:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>📂 My Designs</h1>
      <button className="create-btn" onClick={() => navigate("/editor")}>
        ➕ Create New Design
      </button>

      <div className="designs-grid">
        {designs.map((design) => (
          <div key={design._id} className="design-card">
            {design.thumbnailUrl ? (
              <img src={design.thumbnailUrl} alt={design.title} />
            ) : (
              <div className="placeholder">No Preview</div>
            )}
            <h3>{design.title}</h3>
            <button onClick={() => openDesign(design._id)}>✏️ Open in Editor</button>
            <button className="delete-btn" onClick={() => deleteDesign(design._id)}>
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
