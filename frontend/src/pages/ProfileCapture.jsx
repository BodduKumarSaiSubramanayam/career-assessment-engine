import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Hash, MapPin, Star, Heart, Languages, Target, Rocket, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

function ProfileCapture() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: '',
        standard: '',
        location: '',
        interests: [],
        strengths: [],
        languages: [],
        aspirations: '',
        dreamGoals: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    const interestOptions = ['Technology', 'Art & Design', 'Business', 'Healthcare', 'Social Work', 'Science', 'Sports', 'Music'];
    const strengthOptions = ['Logical Thinking', 'Public Speaking', 'Creativity', 'Team Leadership', 'Problem Solving', 'Empathy', 'Writing', 'Analysis'];
    const languageOptions = ['English', 'Hindi', 'Telugu', 'Tamil', 'Spanish', 'French', 'German', 'Mandarin'];

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

    const calculateStrength = () => {
        let score = 0;
        if (formData.age) score += 10;
        if (formData.standard) score += 10;
        if (formData.location) score += 10;
        if (formData.interests.length > 0) score += 15;
        if (formData.strengths.length > 0) score += 15;
        if (formData.languages.length > 0) score += 15;
        if (formData.aspirations) score += 15;
        if (formData.dreamGoals) score += 10;
        return score;
    };

    const handleSubmit = async () => {
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

    const renderStepIndicators = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            {[1, 2, 3].map(s => (
                <div
                    key={s}
                    style={{
                        width: '40px', height: '6px', borderRadius: '3px',
                        background: s <= step ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease'
                    }}
                />
            ))}
        </div>
    );

    const strength = calculateStrength();

    return (
        <div className="animate-fade-in" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '700px', padding: '3rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Extreme <span style={{ color: 'var(--primary)' }}>Profile DNA</span></h2>
                    <p style={{ color: 'var(--text-muted)' }}>Guided setup for <strong>{userName}</strong></p>
                </div>

                {renderStepIndicators()}

                {/* Profile Strength Meter */}
                <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Profile Effectiveness</span>
                        <span style={{ fontWeight: 700, color: strength > 70 ? '#10B981' : strength > 40 ? '#F59E0B' : '#60A5FA' }}>{strength}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${strength}%`, height: '100%', background: strength > 70 ? '#10B981' : 'var(--primary)', transition: 'width 0.5s ease' }} />
                    </div>
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="animate-slide-up" style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label>Age</label>
                                <div style={{ position: 'relative' }}>
                                    <Hash style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                    <input type="number" placeholder="18" style={{ paddingLeft: '3rem' }} value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Qualification</label>
                                <div style={{ position: 'relative' }}>
                                    <BookOpen style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                    <select style={{ paddingLeft: '3rem', appearance: 'none', width: '100%' }} value={formData.standard} onChange={e => setFormData({ ...formData, standard: e.target.value })}>
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
                            <label>Current Location</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                <input type="text" placeholder="e.g. Hyderabad, India" style={{ paddingLeft: '3rem' }} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setStep(2)} disabled={!formData.age || !formData.standard || !formData.location}>
                            Next Step: Personal DNA <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Step 2: DNA */}
                {step === 2 && (
                    <div className="animate-slide-up" style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}><Heart size={16} inline="true" color="#EF4444" style={{ marginRight: '0.5rem' }} /> Primary Interests</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {interestOptions.map(opt => (
                                    <button key={opt} type="button" onClick={() => toggleSelection('interests', opt)} className={`tag ${formData.interests.includes(opt) ? 'active' : ''}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}><Star size={16} inline="true" color="#F59E0B" style={{ marginRight: '0.5rem' }} /> Key Strengths</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {strengthOptions.map(opt => (
                                    <button key={opt} type="button" onClick={() => toggleSelection('strengths', opt)} className={`tag ${formData.strengths.includes(opt) ? 'active' : ''}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}><Languages size={16} inline="true" color="#60A5FA" style={{ marginRight: '0.5rem' }} /> Languages Proficiency</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {languageOptions.map(opt => (
                                    <button key={opt} type="button" onClick={() => toggleSelection('languages', opt)} className={`tag ${formData.languages.includes(opt) ? 'active' : ''}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}><ArrowLeft size={18} /> Back</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)} disabled={formData.interests.length === 0 || formData.strengths.length === 0}>Next: Future Vision <ArrowRight size={18} /></button>
                        </div>
                    </div>
                )}

                {/* Step 3: Vision */}
                {step === 3 && (
                    <div className="animate-slide-up" style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label>Career Aspirations</label>
                            <div style={{ position: 'relative' }}>
                                <Target theme="outline" size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                                <textarea
                                    placeholder="What kind of impact do you want to make in your career?"
                                    style={{ paddingLeft: '3rem', width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', padding: '1rem 1rem 1rem 3rem' }}
                                    value={formData.aspirations}
                                    onChange={e => setFormData({ ...formData, aspirations: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Dream Goal (or Top 3 Dream Companies)</label>
                            <div style={{ position: 'relative' }}>
                                <Rocket theme="outline" size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                                <textarea
                                    placeholder="e.g. Work at Google, Start my own AI firm, Become a surgeon..."
                                    style={{ paddingLeft: '3rem', width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', padding: '1rem 1rem 1rem 3rem' }}
                                    value={formData.dreamGoals}
                                    onChange={e => setFormData({ ...formData, dreamGoals: e.target.value })}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}><ArrowLeft size={18} /> Back</button>
                            <button className="btn btn-primary" style={{ flex: 2, height: '3.5rem' }} onClick={handleSubmit} disabled={loading || !formData.aspirations || !formData.dreamGoals}>
                                {loading ? 'Finalizing Profile...' : <>Launch Assessment <CheckCircle2 size={18} style={{ marginLeft: '0.5rem' }} /></>}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tag.active {
          background: var(--primary) !important;
          color: white !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

export default ProfileCapture;
