const User = require("../models/User");

class MatchingAlgorithm {
  async findMatchesForStudent(studentId, preferences = {}) {
    try {
      const student = await User.findById(studentId);
      if (!student || student.role !== "student") {
        throw new Error("Valid student profile not found");
      }

      const mentors = await User.find({
        role: "mentor",
        ...(preferences.availability && {
          "availability.day": preferences.availability,
        }),
      });

      if (!mentors.length) {
        return [];
      }

      const scoredMentors = mentors.map((mentor) => {
        const skillSimilarity = this.calculateSimilarity(
          student.skills,
          mentor.skills
        );
        const interestSimilarity = this.calculateSimilarity(
          student.interests,
          mentor.interests
        );
        const industryMatch = student.interests.includes(mentor.industry)
          ? 1
          : 0;

        const matchScore =
          skillSimilarity * 0.4 +
          interestSimilarity * 0.3 +
          industryMatch * 0.3;

        return {
          mentor: {
            _id: mentor._id,
            firstName: mentor.firstName,
            lastName: mentor.lastName,
            profilePicture: mentor.profilePicture,
            bio: mentor.bio,
            skills: mentor.skills,
            industry: mentor.industry,
            experience: mentor.experience,
          },
          matchScore,
          skillSimilarity,
          interestSimilarity,
          industryMatch,
        };
      });

      scoredMentors.sort((a, b) => b.matchScore - a.matchScore);
      return scoredMentors.slice(0, preferences.limit || 10);
    } catch (error) {
      console.error("Error in mentor matching algorithm:", error);
      throw error;
    }
  }

  calculateSimilarity(array1, array2) {
    if (!array1.length && !array2.length) return 0;

    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const intersection = new Set([...set1].filter((item) => set2.has(item)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  async retrainModel() {
    return true;
  }
}

module.exports = new MatchingAlgorithm();
