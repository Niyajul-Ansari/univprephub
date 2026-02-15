import { Routes, Route } from "react-router-dom";
import WebLayout from "./Dashboard/WebLayout";
import Admin from "./Dashboard/Admin";
import UserDashboard from "./Component/User/UserDashboard";
import ProtectedUser from "./Component/User/ProtectedUser";

function App() {
  return (
    <Routes>
      {/* Public homepage */}
      <Route path="/" element={<WebLayout />} />

      {/* When admin logs in */}
      <Route path="/admin/*" element={<Admin />} />

      {/* Normal user */}
      <Route
        path="/user-dashboard/*"
        element={
          <ProtectedUser>
            <UserDashboard />
          </ProtectedUser>
        }
      />
    </Routes>
  );
}

export default App;
