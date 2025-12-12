import Header from "../components/Header";
import SubTabs from "../components/SubTabs";
import { useState } from "react";
import ParkingTicket from "./ParkingTicket";
import TableTicket from "./TableTicket";
import QRScannerPage from "./QRScanner";
import Graphic from "./Graphic";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("parking");

  return (
    <div className="flex flex-col h-screen">
       <Header />
      {/* Sub pestañas */}
      <SubTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenido dinámico */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
        {activeTab === "parking" && <ParkingTicket />}
        {activeTab === "special" && <TableTicket />}
        {activeTab === "view" && <QRScannerPage />}
        {activeTab === "graphic" && <Graphic />}
      </div>
    </div>
  );
}
