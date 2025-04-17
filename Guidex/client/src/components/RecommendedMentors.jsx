import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import "./RecommendedMentors.css";

const RecommendedMentors = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Recommended Mentors</Card.Title>
          <p className="text-muted">
            Complete your profile to get personalized mentor recommendations!
          </p>
          <Button variant="primary">Update Profile</Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 recommended-mentors-card">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>AI-Recommended Mentors</span>
          <Button variant="outline-primary" size="sm">
            View All
          </Button>
        </Card.Title>
        <p className="text-muted mb-4">
          These mentors match your skills, interests, and career goals
        </p>

        <Row>
          {recommendations.slice(0, 3).map((recommendation, index) => (
            <Col md={4} key={index}>
              <Card className="mentor-card">
                <div className="match-score">
                  <span>{Math.round(recommendation.matchScore * 100)}%</span>
                  <small>Match</small>
                </div>
                <div className="mentor-card-header">
                  <img
                    src={
                      recommendation.mentor.profilePicture ||
                      "/default-avatar.png"
                    }
                    alt={`${recommendation.mentor.firstName} ${recommendation.mentor.lastName}`}
                    className="mentor-avatar"
                  />
                  <div className="mentor-basic-info">
                    <h5>
                      {recommendation.mentor.firstName}{" "}
                      {recommendation.mentor.lastName}
                    </h5>
                    <p className="mentor-position">
                      {recommendation.mentor.industry}
                    </p>
                    <div className="mentor-experience">
                      <span>
                        {recommendation.mentor.experience}+ years experience
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mentor-skills">
                  {recommendation.mentor.skills
                    .slice(0, 3)
                    .map((skill, idx) => (
                      <Badge
                        key={idx}
                        bg="light"
                        text="dark"
                        className="skill-badge"
                      >
                        {skill}
                      </Badge>
                    ))}
                  {recommendation.mentor.skills.length > 3 && (
                    <Badge bg="light" text="dark" className="skill-badge">
                      +{recommendation.mentor.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="mentor-card-actions">
                  <Button variant="primary" size="sm" className="w-100">
                    Connect
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RecommendedMentors;
