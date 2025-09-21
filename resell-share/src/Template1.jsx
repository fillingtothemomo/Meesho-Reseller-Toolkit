import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";

import p1 from "./assets/p1.jpg";
import p2 from "./assets/p2.jpg";
import p3 from "./assets/p3.jpg";
import p4 from "./assets/p4.jpg";

export default function Template1() {
  const defaultDescription =
    "Women's Fancy Skirt | Women's Trendy Comfortable Skirt\nFabric: Crepe\nPattern: Striped\nNet Quantity (N): 1\nSizes: 26,28,30,32,34,36,38, S, M, L, XL, XXL\nCountry of Origin: India";

  const originalPrice = 300; // Original price

  const [resellingPrice, setResellingPrice] = useState("");
  const [description, setDescription] = useState(defaultDescription);
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Calculate margin dynamically
  const numericResellingPrice = Number(resellingPrice);
  const margin = numericResellingPrice ? numericResellingPrice - originalPrice : 0;

  const handlePreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  // Format description nicely for buyer view (split by newline)
  const formattedDescription = description.split("\n").map((line, idx) => (
    <p key={idx} style={{ margin: "4px 0" }}>{line}</p>
  ));
  // Open Buyer View in new window

const navigate = useNavigate();

const handleSendLink = () => {
  const data = {
    title,
    contact,
    resellingPrice,
    description,
    images: [p1, p2, p3, p4],
  };
  const encoded = btoa(JSON.stringify(data));
  // Open buyer view in a new tab
  window.open(`/buyer?data=${encoded}`, "_blank");
};


  return (
<div
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center", // horizontal center
    alignItems: "center",     // vertical center
    padding: "20px",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "600px",
      padding: "20px",
      borderRadius: "46px",
      border: "15px solid #007bff", // thick blue border
      background: "#fff",
         marginLeft: "400px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      overflowY: "auto", // keep scroll if content is large
      // height: "100vh", <-- remove this
    }}
  >

        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#000" }}>
          Template 1
        </h2>

        {/* Carousel */}
        <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false}>
          {[p1, p2, p3, p4].map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Image ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* Original Price */}
        <div style={{ marginBottom: "12px", fontWeight: "bold", fontSize: "16px", color: "#007bff" }}>
          Original Price: {originalPrice} Rs
        </div>

        {/* Reselling Price + Live Margin */}
        <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: "#000", fontWeight: "bold" }}>Reselling Price:</label>
            <input
              type="number"
              value={resellingPrice}
              onChange={(e) => setResellingPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                color: "#000",
                background: "#fff",
                border: "2px solid #007bff",
              }}
            />
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px", minWidth: "80px", textAlign: "right", color: "#28a745" }}>
            Margin: {margin >= 0 ? margin : 0} Rs
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ color: "#000", fontWeight: "bold" }}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginTop: "4px",
              color: "#000",
              background: "#fff",
              border: "2px solid #007bff",
            }}
          />
        </div>

        {/* Seller Title */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ color: "#000", fontWeight: "bold" }}>Seller Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginTop: "4px",
              color: "#000",
              background: "#fff",
              border: "2px solid #007bff",
            }}
          />
        </div>

        {/* Contact */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ color: "#000", fontWeight: "bold" }}>Contact:</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginTop: "4px",
              color: "#000",
              background: "#fff",
              border: "2px solid #007bff",
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handlePreview}
            style={{
              flex: 1,
              padding: "12px",
              border: "2px solid #007bff",
              borderRadius: "8px",
              background: "#fff",
              color: "#007bff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Show Preview
          </button>
          <button
            onClick={handleSendLink}
            style={{
              flex: 1,
              padding: "12px",
              border: "2px solid #007bff",
              borderRadius: "8px",
              background: "#007bff",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Send Link
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "10px",
            marginLeft:"-90px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#fff",
              borderRadius: "16px",
              border: "2px solid #007bff",
              boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              overflowY: "auto",
              maxHeight: "90vh",
              position: "relative",
              fontFamily: "Arial, sans-serif",
              color: "#000",
              padding: "20px",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "22px",
                cursor: "pointer",
                color: "#000",
              }}
            >
              ✕
            </button>

            {/* Seller Info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
                fontWeight: "bold",
              }}
            >
              <span>{title || "Sharma Apparels"}</span>
              <span>{contact || "7487238472"}</span>
            </div>

            {/* Image Carousel */}
            <Carousel showThumbs={false} dynamicHeight={false} showStatus={false} infiniteLoop autoPlay>
              {[p1, p2, p3, p4].map((img, index) => (
                <div key={index}>
                  <img
                    src={img}
                    alt={`Image ${index + 1}`}
                    style={{
                      width: "100%",
                      maxHeight: "180px",
                      objectFit: "contain",
                      borderRadius: "12px",
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                </div>
              ))}
            </Carousel>

            {/* Buyer-friendly price */}
            <div style={{ marginTop: "15px", fontWeight: "bold", fontSize: "18px", color: "#007bff" }}>
              Price: {resellingPrice || "-"} Rs
            </div>

            {/* Formatted description */}
            <div style={{ marginTop: "15px", lineHeight: "1.5", fontSize: "15px" }}>
              {formattedDescription}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
