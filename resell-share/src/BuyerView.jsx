import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function BuyerView() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [address, setAddress] = useState("");
  const[name,setName]=useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [pincode, setPincode] = useState("");


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encoded = params.get("data");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        setData(decoded);
      } catch (err) {
        console.error(err);
      }
    }
  }, [location.search]);

  if (!data) return <div>Loading...</div>;

  const formattedDescription = data.description.split("\n").map((line, idx) => (
    <p key={idx} style={{ margin: "4px 0", color: "black" }}>{line}</p>
  ));

  const handlePlaceOrderClick = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    setShowPaymentModal(true);
  };

const handleConfirmPayment = () => {
  if (!paymentMethod) {
    alert("Please select a payment method!");
    return;
  }
  if (!address.trim()) {
    alert("Please enter your delivery address!");
    return;
  }
  if (!pincode.trim()) {
    alert("Please enter your pincode!");
    return;
  }
  if (!name.trim()) {
    alert("Please enter your name!");
    return;
  }

  // Build order object
const newOrder = {
  id: Date.now(),
  name,
  address,
  pincode,
  size: selectedSize,
  payment: paymentMethod,
  price: data.resellingPrice,
  title: "Women's Fancy Skirt", // <-- This is crucial
  approved: false,
  link:"https://www.meesho.com/s/p/9x16na?utm_source=s_cc",
};


  // Get existing orders from localStorage
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  // Add new order
  existingOrders.push(newOrder);
  // Save back to localStorage
  localStorage.setItem("orders", JSON.stringify(existingOrders));

  alert(`Order placed!\nSize: ${selectedSize}\nPayment: ${paymentMethod}\nAddress: ${address}\nPincode: ${pincode}`);

  // Reset modal and fields
  setShowPaymentModal(false);
  setAddress("");
  setName("");
  setPaymentMethod("");
  setPincode("");
  setSelectedSize("");
};


  // Extract sizes from description
  const sizeMatch = data.description.match(/Sizes: ([^\n]+)/);
  const availableSizes = sizeMatch ? sizeMatch[1].split(",") : [];

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: "10px",
        marginLeft:"450px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "60%",
          maxHeight: "100vh",
          background: "#fff",
          border: "5px solid black",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "black" }}>
          {data.title || "Seller"}
        </h2>

        {/* Carousel */}
        <Carousel
          showThumbs={true}
          autoPlay
          infiniteLoop
          showStatus={false}
          swipeable
          emulateTouch
          dynamicHeight={false}
        >
          {data.images.map((img, idx) => (
            <div key={idx}>
              <img
                src={img}
                alt={`Image ${idx + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "150px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  backgroundColor: "#f0f0f0"
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* Price and Size */}
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
            Price: {data.resellingPrice} Rs
          </div>
          <div>
            <label style={{ marginRight: "8px", fontWeight: "bold", color: "black" }}>Select Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #ccc" }}
            >
              <option value="">--Select--</option>
              {availableSizes.map((size, idx) => (
                <option key={idx} value={size.trim()}>{size.trim()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "16px", color: "black" }}>
          Contact: {data.contact || "Not Provided"}
        </div>

        {/* Description */}
        <div style={{ marginTop: "15px", lineHeight: "1.5", fontSize: "15px", color: "black" }}>
          {formattedDescription}
        </div>

        {/* Place Order Button */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handlePlaceOrderClick}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              background: "#28a745",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Place Order
          </button>
        </div>

 {/* Payment Modal */}
{showPaymentModal && (
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
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        position: "relative",
        color: "black", // default text color inside modal
      }}
    >
      <button
        onClick={() => setShowPaymentModal(false)}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          border: "none",
          background: "none",
          fontSize: "22px",
          cursor: "pointer",
          color: "black",
        }}
      >
        ✕
      </button>
      <h3 style={{ textAlign: "center", marginBottom: "15px", color: "black" }}>
        Choose Payment & Address
      </h3>
{/* Name */}
<div style={{ marginBottom: "15px" }}>
  <label style={{ fontWeight: "bold", color: "black" }}>Name:</label>
  <textarea
    value={name}
    onChange={(e) => setName(e.target.value)}
    style={{
      width: "100%",
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      color: "black",
      backgroundColor: "white"   // added
    }}
  />
</div>

{/* Address */}
<div style={{ marginBottom: "15px" }}>
  <label style={{ fontWeight: "bold", color: "black" }}>Delivery Address:</label>
  <textarea
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    style={{
      width: "100%",
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      color: "black",
      backgroundColor: "white"   // added
    }}
  />
</div>

{/* Pincode */}
<div style={{ marginBottom: "15px" }}>
  <label style={{ fontWeight: "bold", color: "black" }}>Pincode:</label>
  <input
    type="text"
    value={pincode}
    onChange={(e) => setPincode(e.target.value)}
    style={{
      width: "100%",
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      color: "black",
      backgroundColor: "white"   // added
    }}
    placeholder="Enter your pincode"
  />
</div>


      {/* Payment Method */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold", color: "black" }}>Payment Method:</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <button
            onClick={() => setPaymentMethod("Cash on Delivery")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: paymentMethod === "Cash on Delivery" ? "2px solid #28a745" : "1px solid #ccc",
              background: paymentMethod === "Cash on Delivery" ? "#28a745" : "#fff",
              color: paymentMethod === "Cash on Delivery" ? "#fff" : "black",
              cursor: "pointer",
            }}
          >
            Cash on Delivery
          </button>
          <button
            onClick={() => setPaymentMethod("UPI Payment")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: paymentMethod === "UPI Payment" ? "2px solid #28a745" : "1px solid #ccc",
              background: paymentMethod === "UPI Payment" ? "#28a745" : "#fff",
              color: paymentMethod === "UPI Payment" ? "#fff" : "black",
              cursor: "pointer",
            }}
          >
            UPI Payment
          </button>
        </div>
      </div>

      <button
        onClick={handleConfirmPayment}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "#28a745",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Confirm Order
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
