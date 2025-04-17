const express = require("express");
const router = express.Router();
const matchingAlgorithm = require("../services/matchingAlgorithm");
const auth = require("../middleware/auth");

router.get("/recommendations", auth, async (req, res) => {
  try {
    if (req.userRole !== "student") {
      return res.status(403).json({
        message: "Only students can access mentor recommendations",
      });
    }

    const preferences = {
      availability: req.query.availability,
      limit: parseInt(req.query.limit) || 10,
    };

    const mentorMatches = await matchingAlgorithm.findMatchesForStudent(
      req.userId,
      preferences
    );

    res.json(mentorMatches);
  } catch (error) {
    res.status(500).json({
      message: "Error finding mentor matches",
      error: error.message,
    });
  }
});

router.post("/feedback", auth, async (req, res) => {
  try {
    const { mentorId, rating, feedback } = req.body;

    if (!mentorId || !rating) {
      return res.status(400).json({
        message: "Mentor ID and rating are required",
      });
    }

    // In a real app, save the feedback to DB and use it to improve matching

    const retrained = await matchingAlgorithm.retrainModel();

    res.json({
      message: "Feedback received successfully",
      modelRetrained: retrained,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing feedback",
      error: error.message,
    });
  }
});

module.exports = router;
