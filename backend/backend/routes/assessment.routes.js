const express = require('express');
const router = express.Router();
const { users } = require('../data/store');
const questions = require('../data/questions');
const { calculateScores } = require('../services/scoring.service');
const { matchCareers, recommendStream, generateRoadmap } = require('../services/recommendation.service');

// Get assessment questions
router.get('/questions', (req, res) => {
  // In a real app we might randomize or paginated
  res.json({ questions });
});

// Submit assessment answers
router.post('/submit', (req, res) => {
  const { email, answers } = req.body;

  if (!email || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Email and valid answers array are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Execute Architecture Flow explicit engines:

  // Step 4: Scoring & Weightage Algorithm
  const profile = calculateScores(answers);

  // Step 5: Career Matching Engine
  const { topMatch, alternateCareers } = matchCareers(profile);

  // Step 6: Stream & Subject Recommendation Engine
  const streamData = recommendStream(topMatch);

  // Step 7: Roadmap Generator
  const roadmap = generateRoadmap(topMatch);

  console.log(`\n\n--- NEW ASSESSMENT RECEIVED FOR ${email} ---`);
  console.log("Calculated Profile (Raw Scores): ", profile);
  console.log("Top Match: ", topMatch.role + ' at ' + topMatch.currentFit + '%');
  console.log("Alternate Matches: ", alternateCareers.map(c => c.role + ': ' + c.currentFit + '%'));
  console.log("Recommended Stream: ", streamData.subjectStream);
  console.log("Roadmap Steps Generated: ", roadmap.length);

  // Re-combine all engine outputs for full frontend access
  const results = {
    topMatch,
    alternateCareers,
    profile,
    streamData,
    roadmap
  };

  // Save to user profile
  user.hasCompletedAssessment = true;
  user.results = results;

  return res.json({
    message: 'Assessment processed successfully',
    results: user.results
  });
});

module.exports = router;

