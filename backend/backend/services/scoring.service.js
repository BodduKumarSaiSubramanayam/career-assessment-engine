const questions = require('../data/questions');

function calculateScores(answers) {
  // answers = array of { questionId, answerValue (0-10 or option text) }

  let profile = {
    STEM: 0,
    Arts: 0,
    Commerce: 0,
    Management: 0
  };

  answers.forEach(ans => {
    const q = questions.find(question => question.id === ans.questionId);
    if (!q) return;

    if (q.type === 'scale') {
      const val = parseInt(ans.answerValue) || 3;
      // Soft mapping for Interest points based on question context
      if (q.id === 'i1') profile.STEM += val * 5;
      if (q.id === 'i2') profile.Arts += val * 5;
      if (q.id === 'i3') profile.STEM += val * 5;
      if (q.id === 'i4') profile.Management += val * 5;
      if (q.id === 'i5') profile.Commerce += val * 5;

    } else if (q.type === 'mcq') {
      // Aptitude: correct answer gives points to the specified domain
      const selectedOption = q.options.find(opt => opt.text === ans.answerValue);
      if (selectedOption && selectedOption.score > 0) {
        profile[q.domain] += 15;
      }

    } else if (q.type === 'likert_text') {
      // Personality: Strongly Agree (5) to Strongly Disagree (1)
      const map = { 'Strongly Agree': 5, 'Agree': 4, 'Neutral': 3, 'Disagree': 2, 'Strongly Disagree': 1 };
      const val = map[ans.answerValue] || 3;
      profile[q.domain] += val * 4;

    } else if (q.type === 'boolean') {
      // Values: 'Yes' goes to domainYes, 'No' goes to domainNo
      if (ans.answerValue === 'Yes' && q.domainYes) {
        profile[q.domainYes] += 10;
      } else if (ans.answerValue === 'No' && q.domainNo) {
        profile[q.domainNo] += 10;
      }

    } else if (q.type === 'frequency') {
      // Work Style: Always (5) to Never (1)
      const map = { 'Always': 5, 'Often': 4, 'Sometimes': 3, 'Rarely': 2, 'Never': 1 };
      const val = map[ans.answerValue] || 3;
      profile[q.domain] += val * 4;

    } else if (q.type === 'select' || q.type === 'scenario') {
      // Academic & Future Goals: mapped via categoryFit
      const selectedOption = q.options?.find(opt => opt.text === ans.answerValue);
      if (selectedOption && profile[selectedOption.categoryFit] !== undefined) {
        profile[selectedOption.categoryFit] += 15;
      }
    }
  });

  // Normalize to 100 max for each for chart visualization
  // Increased thresholds: requires picking 'Strongly Agree' or 'Always' on almost every relevant question to hit 100.
  const MAX_STEM = 350;
  const MAX_ARTS = 320;
  const MAX_COM = 310;
  const MAX_MGT = 320;

  // Absolute scaling
  profile.STEM = Math.min(Math.round((profile.STEM / MAX_STEM) * 100), 100);
  profile.Arts = Math.min(Math.round((profile.Arts / MAX_ARTS) * 100), 100);
  profile.Commerce = Math.min(Math.round((profile.Commerce / MAX_COM) * 100), 100);
  profile.Management = Math.min(Math.round((profile.Management / MAX_MGT) * 100), 100);

  return profile;
}

module.exports = {
  calculateScores
};
