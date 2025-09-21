import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShareProductModal from "./ShareProductModal";
import TemplateSelection from "./TemplateSelection";
import Template1 from "./Template1";
import Template2 from "./Template2";
import BuyerView from "./BuyerView";
import ViewOrders from "./ViewOrders.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShareProductModal />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/template1" element={<Template1 />} />
        <Route path="/template2" element={<Template2 />} />
             <Route path="/buyer" element={<BuyerView />} />
                     <Route path="/orders" element={<ViewOrders />} />


      </Routes>
    </Router>
  );
}

export default App;
