const questions = [
  // ---------------- MODULE 1: INTERESTS [Type: scale (1-5)] ----------------
  { id: 'i1', section: 'Interests', category: 'Interest', text: 'I enjoy solving complex mathematical equations and logical puzzles.', type: 'scale' },
  { id: 'i2', section: 'Interests', category: 'Interest', text: 'I love designing graphic art, user interfaces, or painting.', type: 'scale' },
  { id: 'i3', section: 'Interests', category: 'Interest', text: 'I find researching scientific phenomena and conducting experiments fascinating.', type: 'scale' },
  { id: 'i4', section: 'Interests', category: 'Interest', text: 'I enjoy leading teams, organizing events, and managing projects.', type: 'scale' },
  { id: 'i5', section: 'Interests', category: 'Interest', text: 'I am interested in analyzing market trends and trading stocks.', type: 'scale' },

  // ---------------- MODULE 2: APTITUDE [Type: mcq (Multiple Choice)] ----------------
  { id: 'a1', section: 'Aptitude', category: 'Aptitude', text: 'If 3x + 4 = 19, what is the value of x squared?', options: [{ text: '25', score: 1 }, { text: '16', score: 0 }, { text: '36', score: 0 }], type: 'mcq', domain: 'STEM' },
  { id: 'a2', section: 'Aptitude', category: 'Aptitude', text: 'Which word does not belong?', options: [{ text: 'Apple', score: 0 }, { text: 'Banana', score: 0 }, { text: 'Carrot', score: 1 }, { text: 'Mango', score: 0 }], type: 'mcq', domain: 'Arts' },
  { id: 'a3', section: 'Aptitude', category: 'Aptitude', text: 'Complete the series: 2, 6, 12, 20, ...', options: [{ text: '30', score: 1 }, { text: '28', score: 0 }, { text: '24', score: 0 }, { text: '32', score: 0 }], type: 'mcq', domain: 'STEM' },
  { id: 'a4', section: 'Aptitude', category: 'Aptitude', text: 'A store increases the price of an item by 20% and then offers a 10% discount. What is the net percentage change?', options: [{ text: '10% Increase', score: 0 }, { text: '8% Increase', score: 1 }, { text: 'No change', score: 0 }], type: 'mcq', domain: 'Commerce' },
  { id: 'a5', section: 'Aptitude', category: 'Aptitude', text: 'If all bloops are razzies and all razzies are lazzies, are all bloops lazzies?', options: [{ text: 'Yes', score: 1 }, { text: 'No', score: 0 }, { text: 'Cannot be determined', score: 0 }], type: 'mcq', domain: 'Management' },

  // ---------------- MODULE 3: PERSONALITY [Type: likert_text] ----------------
  { id: 'p1', section: 'Personality', category: 'Personality', text: 'I prefer working independently and taking deep dives into technical problems rather than working in large social groups.', type: 'likert_text', domain: 'STEM' },
  { id: 'p2', section: 'Personality', category: 'Personality', text: 'I handle stressful, high-paced working environments calmly and thrive under pressure.', type: 'likert_text', domain: 'Management' },
  { id: 'p3', section: 'Personality', category: 'Personality', text: 'I am highly empathetic and easily understand the emotions and needs of others.', type: 'likert_text', domain: 'Arts' },
  { id: 'p4', section: 'Personality', category: 'Personality', text: 'I am very detail-oriented and notice small discrepancies that others miss.', type: 'likert_text', domain: 'Commerce' },
  { id: 'p5', section: 'Personality', category: 'Personality', text: 'I constantly seek new, unconventional ways to express my ideas.', type: 'likert_text', domain: 'Arts' },

  // ---------------- MODULE 4: VALUES [Type: boolean (Yes/No)] ----------------
  { id: 'v1', section: 'Values', category: 'Values', text: 'Is making a massive social impact more important to you than achieving high personal wealth?', type: 'boolean', domainYes: 'Arts', domainNo: 'Commerce' },
  { id: 'v2', section: 'Values', category: 'Values', text: 'Would you prefer a highly structured corporate ladder over a chaotic, fast-paced startup environment?', type: 'boolean', domainYes: 'Commerce', domainNo: 'Management' },
  { id: 'v3', section: 'Values', category: 'Values', text: 'Do you value creative freedom over job security?', type: 'boolean', domainYes: 'Arts', domainNo: 'STEM' },
  { id: 'v4', section: 'Values', category: 'Values', text: 'Is it important for you to be seen as a recognized leader or authority figure?', type: 'boolean', domainYes: 'Management', domainNo: 'STEM' },
  { id: 'v5', section: 'Values', category: 'Values', text: 'Are you willing to sacrifice work-life balance in your 20s to accelerate your career trajectory?', type: 'boolean', domainYes: 'Management', domainNo: 'Arts' },

  // ---------------- MODULE 5: WORK STYLE [Type: frequency] ----------------
  { id: 'ws1', section: 'Work Style', category: 'Work Preferences', text: 'How often do you take charge when a group project lacks direction?', type: 'frequency', domain: 'Management' },
  { id: 'ws2', section: 'Work Style', category: 'Work Preferences', text: 'How often do you rely on data and spreadsheets to make personal decisions?', type: 'frequency', domain: 'Commerce' },
  { id: 'ws3', section: 'Work Style', category: 'Work Preferences', text: 'How often do you sketch, doodle, or wireframe your ideas before explaining them?', type: 'frequency', domain: 'Arts' },
  { id: 'ws4', section: 'Work Style', category: 'Work Preferences', text: 'How often do you read documentation or manuals completely before starting a task?', type: 'frequency', domain: 'STEM' },
  { id: 'ws5', section: 'Work Style', category: 'Work Preferences', text: 'How often do you successfully persuade others to change their minds during a debate?', type: 'frequency', domain: 'Management' },

  // ---------------- MODULE 6: ACADEMIC TRACK [Type: select] ----------------
  {
    id: 'at1', section: 'Academic Track', category: 'Academics', text: 'In which cluster of subjects do you consistently achieve the highest grades?', options: [
      { text: 'Mathematics & Pure Sciences', categoryFit: 'STEM' },
      { text: 'Humanities, History & Languages', categoryFit: 'Arts' },
      { text: 'Accountancy, Economics & Business Studies', categoryFit: 'Commerce' },
      { text: 'Physical Education / Electives', categoryFit: 'Management' }
    ], type: 'select'
  },
  {
    id: 'at2', section: 'Academic Track', category: 'Academics', text: 'What is your preferred method of learning and examination?', options: [
      { text: 'Solving numerical problems and derivations', categoryFit: 'STEM' },
      { text: 'Writing long essays and debating theories', categoryFit: 'Arts' },
      { text: 'Case studies, mock markets, and financial tallying', categoryFit: 'Commerce' },
      { text: 'Giving presentations and leading group projects', categoryFit: 'Management' }
    ], type: 'select'
  },
  {
    id: 'at3', section: 'Academic Track', category: 'Academics', text: 'Which type of extracurricular activity did/do you prefer?', options: [
      { text: 'Robotics, Coding, or Science Club', categoryFit: 'STEM' },
      { text: 'Drama, Music, or Art Club', categoryFit: 'Arts' },
      { text: 'Math Olympiad or Finance Club', categoryFit: 'Commerce' },
      { text: 'Student Council or Debate Team', categoryFit: 'Management' }
    ], type: 'select'
  },
  {
    id: 'at4', section: 'Academic Track', category: 'Academics', text: 'How do you prefer to handle large assignments?', options: [
      { text: 'Breaking it down into algorithmic, logical steps', categoryFit: 'STEM' },
      { text: 'Brainstorming non-linear, creative approaches', categoryFit: 'Arts' },
      { text: 'Creating a strict timeline and budget constraint', categoryFit: 'Commerce' },
      { text: 'Delegating parts of it to a team', categoryFit: 'Management' }
    ], type: 'select'
  },
  {
    id: 'at5', section: 'Academic Track', category: 'Academics', text: 'If you had to read a 500-page book for class, which topic would you choose?', options: [
      { text: 'The History of Space Exploration and Physics', categoryFit: 'STEM' },
      { text: 'A profound fictional novel or poetry anthology', categoryFit: 'Arts' },
      { text: 'The Rise and Fall of the Global Economy', categoryFit: 'Commerce' },
      { text: 'Biographies of famous CEOs and Leaders', categoryFit: 'Management' }
    ], type: 'select'
  },

  // ---------------- MODULE 7: SCENARIOS [Type: scenario] ----------------
  {
    id: 'sc1', section: 'Future Goals', category: 'Scenarios', text: 'You are given $100,000. What do you do with it?', options: [
      { text: 'Invest it in a diversified stock portfolio', categoryFit: 'Commerce' },
      { text: 'Fund your own tech startup or laboratory', categoryFit: 'STEM' },
      { text: 'Produce an independent film or art exhibition', categoryFit: 'Arts' },
      { text: 'Start a business and hire a team to rapidly scale it', categoryFit: 'Management' }
    ], type: 'scenario'
  },
  {
    id: 'sc2', section: 'Future Goals', category: 'Scenarios', text: 'The world is ending in a week. How do you spend your time?', options: [
      { text: 'Trying to engineer a solution or escape pod', categoryFit: 'STEM' },
      { text: 'Creating art or music to capture the final moments', categoryFit: 'Arts' },
      { text: 'Organizing resources to help as many people as possible', categoryFit: 'Management' },
      { text: 'Liquidating assets to enjoy lavish luxury while it lasts', categoryFit: 'Commerce' }
    ], type: 'scenario'
  },
  {
    id: 'sc3', section: 'Future Goals', category: 'Scenarios', text: 'A completely new technology is invented. What is your role in it?', options: [
      { text: 'I am the engineer who built the underlying circuit architecture.', categoryFit: 'STEM' },
      { text: 'I am the designer who made it beautiful and intuitive to use.', categoryFit: 'Arts' },
      { text: 'I am the financial backer who funded and monetized it.', categoryFit: 'Commerce' },
      { text: 'I am the CEO who pitched it to the world and built the company.', categoryFit: 'Management' }
    ], type: 'scenario'
  },
  {
    id: 'sc4', section: 'Future Goals', category: 'Scenarios', text: 'Your ideal work environment is:', options: [
      { text: 'A quiet, high-tech laboratory or server room.', categoryFit: 'STEM' },
      { text: 'A vibrant, colorful studio with music playing.', categoryFit: 'Arts' },
      { text: 'A sleek, high-rise corporate office in the financial district.', categoryFit: 'Commerce' },
      { text: 'A bustling open-plan office where I am constantly in meetings.', categoryFit: 'Management' }
    ], type: 'scenario'
  },
  {
    id: 'sc5', section: 'Future Goals', category: 'Scenarios', text: 'When you encounter a critical failure at work, what is your first instinct?', options: [
      { text: 'Debug the system and find the root technical cause.', categoryFit: 'STEM' },
      { text: 'Redesign the user experience completely to bypass the issue.', categoryFit: 'Arts' },
      { text: 'Calculate the financial loss and mitigate monetary damages.', categoryFit: 'Commerce' },
      { text: 'Call an emergency meeting and delegate crisis management tasks.', categoryFit: 'Management' }
    ], type: 'scenario'
  }
];

module.exports = questions;
