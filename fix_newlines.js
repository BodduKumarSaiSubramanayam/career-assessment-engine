const fs = require('fs');
const files = [
    'backend/data/store.js',
    'backend/data/questions.js',
    'backend/data/careers.js',
    'backend/services/scoring.service.js',
    'backend/services/recommendation.service.js',
    'backend/routes/auth.routes.js',
    'backend/routes/assessment.routes.js',
    'backend/server.js'
];
files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/\\n/g, '\n');
        fs.writeFileSync(f, content);
        console.log('Fixed ' + f);
    }
});
