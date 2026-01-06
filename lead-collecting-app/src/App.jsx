import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import LeadCollectionSystem from "./pages/LeadCollection";
import GoogleMapsLeads from "./pages/GoogleMapsLeads";
import MessageFormat from "./pages/MessageFormat";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar appears on ALL routes */}
      <Navbar />

      {/* Routes - switches content without reload */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shopify-directory" element={<LeadCollectionSystem />} />
        <Route path="/google-maps" element={<GoogleMapsLeads />} />
        <Route path="/message-format" element={<MessageFormat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
