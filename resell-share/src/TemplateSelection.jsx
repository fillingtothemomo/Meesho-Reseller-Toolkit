import { useNavigate } from "react-router-dom";
import "./TemplateSelection.css";

export default function TemplateSelection() {
  const navigate = useNavigate();

  return (
    <div className="template-selection-container">
      <h1>Select a Template</h1>
      <div className="button-group">
        <button
          className="template-btn"
          onClick={() => navigate("/template1")}
        >
          Template 1
        </button>
        <button
          className="template-btn green"
          onClick={() => navigate("/template2")}
        >
          Template 2
        </button>
      </div>
    </div>
  );
}
