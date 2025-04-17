import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import ProfileForm from "./components/ProfileForm";
import MentorSearch from "./pages/MentorSearch";
import MentorProfile from "./pages/MentorProfile";
import Meetings from "./pages/Meetings";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        {user && <Navigation user={user} />}
        <Container fluid className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentors"
              element={
                <ProtectedRoute>
                  <MentorSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentors/:id"
              element={
                <ProtectedRoute>
                  <MentorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <ProtectedRoute>
                  <Meetings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
