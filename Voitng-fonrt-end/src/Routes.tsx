import { Route, Routes } from "react-router-dom";
import CreatePoll from "./pages/CreatePoll";
import PollList from "./pages/PollList";
import PollDetails from "./pages/PollDetails";

export function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<CreatePoll />} />
      <Route path="/create" element={<CreatePoll />} />
      <Route path="/list" element={<PollList />} />
      
      {/* هنا أضفنا كلمة poll ليتطابق مع الرابط المولد */}
      <Route path="/poll/:id" element={<PollDetails />} />
    </Routes>
  );
}