import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Mail, BookOpen, Hash, Target, Navigation, Briefcase } from 'lucide-react';

function Registration() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok || data.error === 'User already exists') {
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', formData.name);
        navigate('/profile');
      } else {
        alert(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '4rem', alignItems: 'center', minHeight: '85vh', maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

      <div style={{ textAlign: 'left' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>Discover Your True Potential</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Take our incredibly accurate, AI-powered multi-dimensional assessment to find your ideal career path and action plan.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', color: '#3B82F6' }}>
              <Target size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', fontWeight: 600 }}>5-Dimensional Analysis</h3>
              <p style={{ color: 'var(--text-muted)' }}>Evaluates Interests, Aptitude, Personality, Values, and Academic Strength.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', color: '#10B981' }}>
              <Navigation size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', fontWeight: 600 }}>5-Year Action Plan</h3>
              <p style={{ color: 'var(--text-muted)' }}>Get a step-by-step sequential roadmap tailored to your specific goals and traits.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', color: '#8B5CF6' }}>
              <Briefcase size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', fontWeight: 600 }}>Priority Match Scoring</h3>
              <p style={{ color: 'var(--text-muted)' }}>We rank your best alternative careers exactly through algorithmic probability vectors.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card delay-1" style={{ width: '100%', padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Begin Assessment</h2>
        <form onSubmit={handleSubmit} >
          < div className="input-group" >
            < label htmlFor="name" > Full Name</label >
            < div style={{ position: 'relative' }}>
              < UserCircle style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              < input
                id="name"
                type="text"
                placeholder="John Doe"
                style={{ paddingLeft: '3rem' }}
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div >
          </div >

          < div className="input-group" >
            < label htmlFor="email" > Email Address</label >
            < div style={{ position: 'relative' }}>
              < Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              < input
                id="email"
                type="email"
                placeholder="john@example.com"
                style={{ paddingLeft: '3rem' }}
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div >
          </div >



          < button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading} >
            {loading ? 'Processing...' : 'Continue to Profile Capture'}
          </button >
        </form >
      </div >
    </div >
  );
}

export default Registration;

