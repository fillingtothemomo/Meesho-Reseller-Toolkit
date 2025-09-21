import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaUserCircle,
} from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import "./ShareProductModal.css";
import b1 from "./assets/b1.png";
import p1 from "./assets/p1.jpg";

export default function ShareProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [resell, setResell] = useState("NO");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdown = document.getElementById("profile-dropdown");
      if (dropdown && !dropdown.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleYesClick = () => {
    setResell("YES");
    setIsOpen(false);
    navigate("/templates");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  const handleDeleteAccount = () => {
    alert("Account deletion initiated.");
  };

  const handleLogout = () => {
    alert("Logged out.");
    // Implement actual logout logic here
  };

  return (
    <div
      className="page"
      style={{
        backgroundImage: `url(${b1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Profile Icon and Dropdown */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <div style={{ marginRight:"230px" }}>
          <FaUserCircle
            size={32}
            color="#fff"
            style={{ cursor: "pointer" }}
            onClick={() => setShowProfileDropdown((prev) => !prev)}
          />
          {showProfileDropdown && (
            <div
              id="profile-dropdown"
              style={{
                position: "absolute",
                right: 0,
                top: "40px",
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
                zIndex: 1000,
                width: "220px",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #eee",
                }}
              >
                Hello User
                <br />
                <span
                  style={{
                    fontWeight: "normal",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  +91 7732843142
                </span>
              </div>
              <button
                className="dropdown-btn"
                onClick={() => navigate("")}
              >
                My Orders
              </button>
              <button
                className="dropdown-btn"
                onClick={() => navigate("/orders")}
              >
                Reseller Dashboard
              </button>
              <button className="dropdown-btn" onClick={handleDeleteAccount}>
                Delete Account
              </button>
              <button className="dropdown-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Open Modal Button */}
      <button className="open-btn" onClick={() => setIsOpen(true)}>
         Share
      </button>

      {isOpen && (
        <div className="overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>

            <div className="product">
              <img
                src={p1}
                alt="Product"
                className="product-img"
              />
              <h2 className="product-title">
Women's Fancy Skirt|Women's Trendy Comfortable Skirt              </h2>
            </div>

            <div className="resell">
              <p>Are you reselling this product?</p>
              <div className="toggle">
                <button
                  className={
                    resell === "NO" ? "toggle-btn active" : "toggle-btn"
                  }
                  onClick={() => setResell("NO")}
                >
                  NO
                </button>
                <button
                  className={
                    resell === "YES"
                      ? "toggle-btn active-yes"
                      : "toggle-btn"
                  }
                  onClick={handleYesClick}
                >
                  YES
                </button>
              </div>
            </div>

            <div className="share">
              <p>Choose an option to share</p>
              <div className="share-grid">
                <div className="share-item">
                  <FaWhatsapp className="icon whatsapp" />
                  <p>WhatsApp</p>
                </div>
                <div className="share-item">
                  <FaFacebook className="icon facebook" />
                  <p>Facebook</p>
                </div>
                <div className="share-item">
                  <FaInstagram className="icon instagram" />
                  <p>Instagram</p>
                </div>
                <div className="share-item">
                  <FaTelegram className="icon telegram" />
                  <p>Telegram</p>
                </div>
              </div>
            </div>

            <button className="download-btn">
              <MdDownload className="download-icon" />
              Download Photos
            </button>
          </div>
        </div>
      )}

     
        
    
    </div>
  );
}
