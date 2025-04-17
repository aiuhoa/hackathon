import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import RecommendedMentors from "./RecommendedMentors";
import UpcomingMeetings from "./UpcomingMeetings";
import InsightsWidget from "./InsightsWidget";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const profileResponse = await api.get("/users/profile");
        setUserProfile(profileResponse.data);

        if (profileResponse.data.role === "student") {
          const recommendationsResponse = await api.get(
            "/matching/recommendations"
          );
          setRecommendations(recommendationsResponse.data);
        }

        const meetingsResponse = await api.get("/meetings/upcoming");
        setMeetings(meetingsResponse.data);

        const insightsResponse = await api.get("/users/insights");
        setInsights(insightsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading your personalized dashboard...</p>
      </div>
    );
  }

  if (!userProfile) {
    return <div>Error loading profile. Please try again later.</div>;
  }

  return (
    <Container fluid className="dashboard-container">
      <Row className="dashboard-header">
        <Col>
          <h1>Welcome back, {userProfile.firstName}!</h1>
          <p className="text-muted">{new Date().toLocaleDateString()}</p>
        </Col>
      </Row>

      <Row className="dashboard-summary">
        <Col md={6}>
          <Card className="summary-card">
            <Card.Body>
              <Card.Title>Your Profile Completion</Card.Title>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${userProfile.profileCompletionPercentage || 0}%`,
                  }}
                >
                  {userProfile.profileCompletionPercentage || 0}%
                </div>
              </div>
              {userProfile.profileCompletionPercentage < 100 && (
                <Button variant="outline-primary" size="sm" className="mt-2">
                  Complete Your Profile
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="summary-card">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="quick-actions">
                <Button variant="primary">Find Mentors</Button>
                <Button variant="outline-primary">Schedule Meeting</Button>
                <Button variant="outline-primary">Message Center</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="dashboard-content">
        <Col lg={8}>
          {userProfile.role === "student" && (
            <RecommendedMentors recommendations={recommendations} />
          )}
          <UpcomingMeetings meetings={meetings} />
        </Col>
        <Col lg={4}>
          <InsightsWidget insights={insights} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
