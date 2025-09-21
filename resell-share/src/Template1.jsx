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
const [linkValidity, setLinkValidity] = useState("12"); // default 12 hours
const [reelFile, setReelFile] = useState(null);

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
const handleSendLink = async () => {
  // Map images to gallery format
  const gallery = [
    { url: "./images/1.jpg", alt: "skirt-1" },
    { url: "./images/2.jpg", alt: "skirt-2" },
    { url: "./images/3.jpg", alt: "skirt-3" },
    { url: "./images/4.jpg", alt: "skirt-4" },
    { url: "./images/5.jpg", alt: "skirt-5" },
  ];

  const payload = {
    template_id: "template1",
    data: {
      heading: title || "NEW TESTING",
      price: resellingPrice || "500 Rs",
      contact: contact || "6565657656",
      sizes: ["26", "28", "30", "32", "34", "36", "38", "S", "M", "L"],
      description:
        description ||
        `Women's Fancy Skirt | Women's Trendy Comfortable Skirt
Fabric: Crepe
Pattern: Striped
Net Quantity (N): 1
Country of Origin: India`,
      gallery,
    },
  };

  try {
    const response = await fetch("http://localhost:8080/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to send data");
    }

    const result = await response.json();
    console.log("✅ Response:", result);
        if (result.index) {
      await navigator.clipboard.writeText(result.index);
      alert("Link generated and copied to clipboard successfully!");
    } else {
      alert("Link generated, but no link found in response.");
    }

  } catch (err) {
    console.error("❌ Error:", err);
    alert("Failed to send data. Check console for details.");
  }
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
      border: "15px solid rgb(13, 14, 15)", // thick blue border
      background: "#fff",
         marginLeft: "500px",
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

        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "16px", color: "#007bff" }}>
            Original Price: {originalPrice} Rs
          </div>
          <div>
            <label style={{ marginRight: "8px" }}>Link Validity:</label>
            <select
              value={linkValidity}
              onChange={(e) => setLinkValidity(e.target.value)}
              style={{ padding: "6px", borderRadius: "6px", border: "1px solid #007bff" }}
            >
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
              <option value="72">72 hours</option>
            </select>
          </div>
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
          {/* Upload Reels */}
  <div style={{ marginTop: "10px" }}>
    <label
      htmlFor="reel-upload"
      style={{
        display: "inline-block",
        padding: "12px",
        borderRadius: "8px",
        border: "2px solid #28a745",
        background: "#fff",
        color: "#28a745",
        fontWeight: "bold",
        cursor: "pointer",
        textAlign: "center",
        width: "100%",
      }}
    >
      {reelFile ? "Reel Selected: " + reelFile.name : "Upload Reels"}
    </label>
    <input
      id="reel-upload"
      type="file"
      accept="video/*"
      style={{ display: "none" }}
      onChange={(e) => setReelFile(e.target.files[0])}
    />
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
        // overflowY: "auto", <-- removed
        height: "fit-content", // adjust height automatically
        maxHeight: "90vh",     // keep it within viewport
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
</div> ); }