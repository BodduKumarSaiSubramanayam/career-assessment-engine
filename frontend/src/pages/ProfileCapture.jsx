import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Hash, MapPin, Star, Heart, UserCircle, ArrowRight } from 'lucide-react';

function ProfileCapture() {
    const [formData, setFormData] = useState({
        age: '',
        standard: '',
        location: '',
        interests: [],
        strengths: []
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    const interestOptions = ['Technology', 'Art & Design', 'Business', 'Healthcare', 'Social Work', 'Science', 'Sports', 'Music'];
    const strengthOptions = ['Logical Thinking', 'Public Speaking', 'Creativity', 'Team Leadership', 'Problem Solving', 'Empathy', 'Writing', 'Analysis'];

    useEffect(() => {
        if (!userEmail) {
            navigate('/');
        }
    }, [userEmail, navigate]);

    const toggleSelection = (field, value) => {
        setFormData(prev => {
            const current = prev[field];
            const next = current.includes(value)
                ? current.filter(i => i !== value)
                : [...current, value];
            return { ...prev, [field]: next };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.interests.length === 0 || formData.strengths.length === 0) {
            alert('Please select at least one interest and one strength.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail, ...formData })
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/assessment');
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to server.');
        }
        setLoading(false);
    };

    return (
        <div className="animate-fade-in" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'rgba(59,130,246,0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 1rem', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <UserCircle size={32} color="#3B82F6" />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Effective Profile Capture</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Hi {userName}, build an accurate profile for better career matching.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label>Age</label>
                            <div style={{ position: 'relative' }}>
                                <Hash style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                <input
                                    type="number"
                                    placeholder="16"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Qualification</label>
                            <div style={{ position: 'relative' }}>
                                <BookOpen style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                <select
                                    style={{ paddingLeft: '3rem', cursor: 'pointer', appearance: 'none', width: '100%' }}
                                    required
                                    value={formData.standard}
                                    onChange={e => setFormData({ ...formData, standard: e.target.value })}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="10th Standard">10th Standard</option>
                                    <option value="12th Standard">12th Standard</option>
                                    <option value="Bachelors Degree">Bachelors Degree</option>
                                    <option value="Masters Degree">Masters Degree</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Location</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                            <input
                                type="text"
                                placeholder="e.g. Hyderabad, India"
                                style={{ paddingLeft: '3rem' }}
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Interests */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.95rem' }}>
                            <Heart size={16} inline="true" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} color="#EF4444" />
                            Primary Interests (Select 1+)
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {interestOptions.map(opt => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => toggleSelection('interests', opt)}
                                    className={`tag ${formData.interests.includes(opt) ? 'active' : ''}`}
                                    style={{ cursor: 'pointer', outline: 'none', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Strengths */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.95rem' }}>
                            <Star size={16} inline="true" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} color="#F59E0B" />
                            Your Strengths (Select 1+)
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {strengthOptions.map(opt => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => toggleSelection('strengths', opt)}
                                    className={`tag ${formData.strengths.includes(opt) ? 'active' : ''}`}
                                    style={{ cursor: 'pointer', outline: 'none', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} disabled={loading}>
                        {loading ? 'Saving Profile...' : <>Start Assessment <ArrowRight size={20} /></>}
                    </button>
                </form>
            </div>

            <style>{`
        .tag.active {
          background: var(--primary) !important;
          color: white !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
        }
      `}</style>
        </div>
    );
}

export default ProfileCapture;
