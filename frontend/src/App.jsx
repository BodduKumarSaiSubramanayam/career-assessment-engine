import { Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import ProfileCapture from './pages/ProfileCapture';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    < div className="app-container" >
      < Routes >
        < Route path="/" element={< Registration />} />
        < Route path="/profile" element={< ProfileCapture />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;

