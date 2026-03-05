import { Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import ProfileCapture from './pages/ProfileCapture';
import Assessment from './pages/Assessment';
import Scoring from './pages/Scoring';
import CareerMatch from './pages/CareerMatch';
import StreamRecommendation from './pages/StreamRecommendation';
import Roadmap from './pages/Roadmap';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Step 1: User Registration */}
        <Route path="/" element={<Registration />} />
        {/* Step 2: Student Profile Capture */}
        <Route path="/profile" element={<ProfileCapture />} />
        {/* Step 3: Multi-Dimensional Assessment Engine */}
        <Route path="/assessment" element={<Assessment />} />
        {/* Step 4: Scoring & Weightage Algorithm */}
        <Route path="/scoring" element={<Scoring />} />
        {/* Step 5: Career Matching Engine */}
        <Route path="/career-match" element={<CareerMatch />} />
        {/* Step 6: Stream & Subject Recommendation Engine */}
        <Route path="/stream-recommendation" element={<StreamRecommendation />} />
        {/* Step 7: Roadmap Generator */}
        <Route path="/roadmap" element={<Roadmap />} />
        {/* Step 8: Interactive Career Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
