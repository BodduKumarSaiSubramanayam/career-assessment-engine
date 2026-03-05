import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Hash, UserCircle } from 'lucide-react';

function ProfileCapture() {
    const [formData, setFormData] = useState({ age: '', standard: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        if (!userEmail) {
            navigate('/');
        }
    }, [userEmail, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div className="animate-fade-in" style={{ display: 'grid', placeItems: 'center', minHeight: '85vh', maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <div className="glass-card" style={{ width: '100%', padding: '2.5rem' }}>
                <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Student Profile Capture</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Hi {userName}, let's finish setting up your profile.</p>

                <form onSubmit={handleSubmit} >
                    <div className="input-group">
                        <label htmlFor="age">Age</label>
                        <div style={{ position: 'relative' }}>
                            <Hash style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input
                                id="age"
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
                        <label htmlFor="standard">Standard / Qualification</label>
                        <div style={{ position: 'relative' }}>
                            <BookOpen style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <select
                                id="standard"
                                style={{ paddingLeft: '3rem', paddingRight: '2rem', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', width: '100%' }}
                                required
                                value={formData.standard}
                                onChange={e => setFormData({ ...formData, standard: e.target.value })}
                            >
                                <option value="" disabled>Select Qualification</option>
                                <option value="10th Standard">10th Standard</option>
                                <option value="12th Standard">12th Standard</option>
                                <option value="Bachelors Degree">Bachelors Degree</option>
                                <option value="Masters Degree">Masters Degree</option>
                                <option value="Ph.D / Doctorate">Ph.D / Doctorate</option>
                                <option value="Other">Other</option>
                            </select>
                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                ▼
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Saving Profile...' : 'Start Assessment'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfileCapture;
