import { useEffect, useState } from "react";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const defaultOrders = [
      {
        id: 1,
        name: "Priya Sharma",
        address: "123 MG Road, Delhi",
        pincode: "110001",
        link:"https://www.meesho.com/s/p/791ft9?utm_source=s_cc",
        title: "Trendy Kurti",
        price: 799,
        payment: "Cash on Delivery",
        size: "M",
        approved: true,
        shipped: false,
      },
      {
        id: 2,
        name: "Amit Verma",
        address: "45 Park Street, Kolkata",
        pincode: "700016",
        link:"https://www.meesho.com/s/p/32q6je?utm_source=s_cc",
        title: "Casual Shirt",
        price: 599,
        payment: "Online Payment",
        size: "L",
        approved: true,
        shipped: true,
      },
    ];

    setOrders([...defaultOrders, ...storedOrders]);
  }, []);

  const handleApprove = (id) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, approved: true, shipped: false } : o
    );
    setOrders(updated);
    const nonDefaults = updated.filter((o) => o.id > 2);
    localStorage.setItem("orders", JSON.stringify(nonDefaults));
  };

  const renderTable = (title, data, showApprove) => (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={headingStyle}>{title}</h2>
      {data.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No {title.toLowerCase()}.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Pincode</th>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, idx) => (
              <tr
                key={order.id}
                style={{
                  textAlign: "center",
                  background: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                }}
              >
                <td style={tdStyle}>{order.name}</td>
                <td style={tdStyle}>{order.address}</td>
                <td style={tdStyle}>{order.pincode}</td>
                <td style={tdStyle}>
                  <a
                    href={order.link||"https://www.meesho.com/s/p/9x16na?utm_source=s_cc"}
                    style={{ color: "#007bff", textDecoration: "underline" }}
                  >
                    {order.title}
                  </a>
                </td>
                <td style={tdStyle}>{order.size}</td>
                <td style={tdStyle}>₹{order.price}</td>
                <td style={tdStyle}>{order.payment}</td>
                <td style={tdStyle}>
                  {order.approved ? (
                    <span style={{ color: "#28a745", fontWeight: "bold" }}>Approved</span>
                  ) : (
                    <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>Pending</span>
                  )}
                </td>
                <td style={tdStyle}>
                  {!order.approved && showApprove ? (
                    <button
                      onClick={() => handleApprove(order.id)}
                      style={approveButtonStyle}
                    >
                      Approve
                    </button>
                  ) : order.approved && !order.shipped ? (
                    "Not Shipped"
                  ) : order.approved && order.shipped ? (
                    "Delivered"
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const newOrders = orders.filter((o) => !o.approved);
  const approvedOrders = orders.filter((o) => o.approved);

  return (
    <div style={{ padding: "20px", background: "#fff", minHeight: "100vh", marginLeft: "250px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#000" }}>
        Orders Dashboard
      </h1>

      {renderTable("New Orders", newOrders, true)}
      {renderTable("Approved Orders", approvedOrders, false)}
    </div>
  );
}

// Styles
const headingStyle = {
  textAlign: "center",
  margin: "20px 0",
  color: "#000",
  fontWeight: "bold",
  fontSize: "1.5rem",
  borderBottom: "2px solid #28a745",
  paddingBottom: "6px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  color: "#000",
};

const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  color: "#000",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  color: "#000",
};

const approveButtonStyle = {
  padding: "6px 12px",
  background: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
