import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ParkingTicket from "./pages/ParkingTicket";
import TableTicket from "./pages/TableTicket";
import Abonados from "./pages/Abonados";
import Profile from "./pages/Profile";
import ProfileAbonados from "./pages/ProfileAbonados";
import ProfileTicket from "./pages/ProfileTicket";
function App() {

  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/abonados" element={<Abonados />} />
        <Route path="/ticket" element={<ParkingTicket />} />
        <Route path="/special" element={<TableTicket />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ticket/:id" element={<ProfileTicket />} />
        <Route path="/profileAbon" element={<ProfileAbonados />} />
      </Routes>
    </Router>
  )
}

export default App
