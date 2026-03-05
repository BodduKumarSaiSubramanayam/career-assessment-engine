const fs = require('fs');
const files = [
    'frontend/src/main.jsx',
    'frontend/src/App.jsx',
    'frontend/src/index.css',
    'frontend/src/pages/Registration.jsx',
    'frontend/src/pages/Assessment.jsx',
    'frontend/src/pages/Dashboard.jsx'
];
files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/\\n/g, '\n');
        fs.writeFileSync(f, content);
        console.log('Fixed ' + f);
    }
});
