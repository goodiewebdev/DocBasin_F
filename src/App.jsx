import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Home from "./home.jsx";
import SignUp from "./signup.jsx";
import Login from "./login.jsx";
import UserDashboard from "./dashboard/dashboard.jsx";
import ProtectedRoute from "./privateroute.jsx";
import ScrollToTop from "./utils/scrolltotop.jsx";
import { ModalProvider } from "./modalcontext.jsx";
import { MessageProvider } from "./messagecontext.jsx";
import NotFound from "./404page.jsx";
import UserEmailVerification from "./useremailverification.jsx";

function App() {
  return (
    <MessageProvider>
      <ModalProvider>
        <Navbar />
        <div className="spaceUp"></div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/verifyuser/:emailVerificationToken" element={<UserEmailVerification />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          {/*
      <Route path="/mycontactlists" element={<MyContactLists />} />
      <Route path="/logout" element={<Logout />} />*/}
        </Routes>
      </ModalProvider>
    </MessageProvider>
  );
}

export default App;
