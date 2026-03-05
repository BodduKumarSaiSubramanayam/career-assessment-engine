const careers = require('../data/careers');

function getRecommendations(profile) {
  // profile has STEM, Arts, Commerce, Management (1-100 scales)

  let bestMatch = null;
  let highestFit = -1;

  const expandedCareers = careers;

  expandedCareers.forEach(career => {
    // Default 0 for undefined criteria
    const cSTEM = career.fitCriteria.STEM || 0;
    const cArts = career.fitCriteria.Arts || 0;
    const cCom = career.fitCriteria.Commerce || 0;
    const cMgt = career.fitCriteria.Management || 0;

    // Competitive Ranking Algorithm: 
    // A career fit is high ONLY IF its primary domain is much stronger than the average of others.
    let fitScore = 0;

    // Sort all profile scores to find competitive strength
    const scores = [
      { name: 'STEM', val: profile.STEM },
      { name: 'Arts', val: profile.Arts },
      { name: 'Commerce', val: profile.Commerce },
      { name: 'Management', val: profile.Management }
    ].sort((a, b) => b.val - a.val);

    const highest = scores[0];
    const secondHighest = scores[1];
    const average = (profile.STEM + profile.Arts + profile.Commerce + profile.Management) / 4;

    if (career.cluster === 'Technology & Engineering') {
      // Base is the primary aptitude
      fitScore = profile.STEM * 0.9;
      // Competitive penalty: if you are also good at Arts/Comm, subtract some 'focus' points
      if (highest.name !== 'STEM') fitScore -= 15;
      fitScore -= (secondHighest.val * 0.1);
    } else if (career.cluster === 'Arts & Design') {
      fitScore = profile.Arts * 0.9;
      if (highest.name !== 'Arts') fitScore -= 15;
      fitScore -= (secondHighest.val * 0.1);
    } else if (career.role === 'Financial Analyst') {
      fitScore = profile.Commerce * 0.9;
      if (highest.name !== 'Commerce') fitScore -= 15;
      fitScore -= (secondHighest.val * 0.1);
    } else if (career.role === 'Product Manager') {
      fitScore = profile.Management * 0.85;
      if (highest.name !== 'Management') fitScore -= 10;
      fitScore -= (secondHighest.val * 0.05);
    }

    let normalizedFit = Math.round(fitScore);

    // Ensure variety and realism - remove hard ceilings
    if (normalizedFit > 96) normalizedFit = 92 + (Math.round(Math.random() * 3));
    if (normalizedFit < 10) normalizedFit = 10 + (Math.round(Math.random() * 10));


    career.currentFit = normalizedFit;

    if (career.currentFit > highestFit) {
      highestFit = career.currentFit;
      bestMatch = career;
    }
  });

  // PRIORITY ORDER: Sort all careers from highest to lowest fit
  const sortedCareers = expandedCareers.sort((a, b) => b.currentFit - a.currentFit);

  // The first is the best match
  bestMatch = sortedCareers[0];

  // The rest are alternates, ordered by priority
  const alternateCareers = sortedCareers.slice(1);

  return {
    topMatch: bestMatch,
    alternateCareers,
    profile
  };
}

// Explicit Engine Methods for Architecture Flow
function matchCareers(profile) {
  return getRecommendations(profile); // Returns topMatch, alternates, profile
}

function recommendStream(career) {
  return {
    subjectStream: career.subjectStream,
    courseDegree: career.courseDegree,
    academicStrength: career.academicStrength
  };
}

function generateRoadmap(career) {
  return career.actionPlan;
}

module.exports = {
  getRecommendations,
  matchCareers,
  recommendStream,
  generateRoadmap
};
