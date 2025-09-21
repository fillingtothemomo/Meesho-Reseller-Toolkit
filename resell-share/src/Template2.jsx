import { useState } from "react";

export default function Template2() {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");

  const handleSendLink = () => alert("Link sent!");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
          borderRadius: "16px",
          background: "rgba(255,255,224,0.9)", // semi-transparent yellow
          color: "#856404",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Template 2</h2>

        <img
          src="https://via.placeholder.com/400x200"
          alt="Product"
          style={{ width: "100%", borderRadius: "16px", marginBottom: "20px", border: "2px solid #ffe58f" }}
        />

        <div style={{ marginBottom: "12px" }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", marginTop: "4px", color: "#856404", background: "#fff" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Set Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", marginTop: "4px", color: "#856404", background: "#fff" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Seller Title:</label>
          <input
            type="text"
            placeholder="Your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", marginTop: "4px", color: "#856404", background: "#fff" }}
          />
        </div>

        <button
          onClick={handleSendLink}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#ffc107",
            color: "#856404",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Send Link
        </button>
      </div>
    </div>
  );
}
