import { useNavigate } from "react-router-dom";
import "./TemplateSelection.css";
import temp1 from "./assets/temp1.jpg"; // adjust path if needed
import meeshoLogo from "./assets/m3.png";
export default function TemplateSelection() {
  const navigate = useNavigate();

  return (

    <div className="template-selection-container">
       <img src={meeshoLogo} alt="Meesho Logo" className="meesho-logo" />
      <h1>Select a Template</h1>
      <div className="image-group">
        <img
          src={temp1}
          alt="Template 1"
          className="template-img"
          onClick={() => navigate("/template1")}
        />
        <img
          src={temp1}
          alt="Template 2"
          className="template-img"
          onClick={() => navigate("/template2")}
        />
                <img
          src={temp1}
          alt="Template 3"
          className="template-img"
          onClick={() => navigate("/template2")}
        />
                <img
          src={temp1}
          alt="Template 4"
          className="template-img"
          onClick={() => navigate("/template2")}
        />
      </div>
    </div>
  );
}
