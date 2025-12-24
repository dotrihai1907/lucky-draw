import { Toaster } from "react-hot-toast";
import LuckyDrawPage from "./pages/LuckyDrawPage";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <LuckyDrawPage />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(30,30,30,0.85)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            borderRadius: 14,
          },
        }}
      />
    </div>
  );
}
