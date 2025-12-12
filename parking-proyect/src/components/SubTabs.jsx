import { LayoutDashboard, MessageCircle, Eye, LineChart } from "lucide-react";
import { getUserFromToken } from "../utils/auth";

export default function SubTabs({ activeTab, setActiveTab }) {
  const user = getUserFromToken();
  const tabs = [
    { id: "parking", icon: <LayoutDashboard /> },
    { id: "special", icon: <MessageCircle /> },
    { id: "view", icon: <Eye /> },
  ];

  if (user?.role === "ADMIN") {
    tabs.push({ id: "graphic", icon: <LineChart /> });
  }

  return (
    <div className="flex justify-around bg-gray-200 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`p-2 rounded-full ${activeTab === tab.id
            ? "bg-black text-white"
            : "bg-white text-gray-500"
            }`}
        >
          {tab.icon}
        </button>
      ))}
    </div>
  );
}
