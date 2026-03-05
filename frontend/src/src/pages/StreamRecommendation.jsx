import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';

function StreamRecommendation() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('assessmentResults');
        if (!stored) { navigate('/'); return; }
        setResults(JSON.parse(stored));
    }, [navigate]);

    if (!results) return null;
    const { streamData, topMatch } = results;
    const stream = streamData?.subjectStream || topMatch?.subjectStream || 'N/A';
    const courseDegree = streamData?.courseDegree || topMatch?.courseDegree || [];
    const academicStrength = streamData?.academicStrength || topMatch?.academicStrength || [];

    const streamColors = { Science: '#3B82F6', Arts: '#8B5CF6', Commerce: '#10B981', Technology: '#F59E0B' };
    const streamColor = Object.entries(streamColors).find(([k]) => stream?.includes(k))?.[1] || '#3B82F6';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                {['Scoring', 'Career Match', 'Stream', 'Roadmap', 'Dashboard'].map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: i < 2 ? 'rgba(59,130,246,0.3)' : i === 2 ? '#8B5CF6' : 'rgba(255,255,255,0.1)', color: i <= 2 ? '#fff' : 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {i === 2 ? '● ' : ''}{step}
                        </div>
                        {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>›</span>}
                    </div>
                ))}
            </div>

            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: 'rgba(139,92,246,0.15)', borderRadius: '12px', padding: '0.75rem', color: '#8B5CF6' }}>
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <p style={{ color: '#8B5CF6', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 6 of 8</p>
                        <h2 style={{ margin: 0 }}>Stream & Subject Recommendation Engine</h2>
                    </div>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Based on your career match and profile, our engine recommends the following academic path.
                </p>

                {/* Recommended Stream */}
                <div style={{ background: `linear-gradient(135deg, ${streamColor}22, ${streamColor}0a)`, border: `1px solid ${streamColor}44`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <FlaskConical size={32} color={streamColor} />
                    </div>
                    <p style={{ color: streamColor, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Recommended Stream</p>
                    <h3 style={{ fontSize: '2rem', margin: 0 }}>{stream}</h3>
                </div>

                {/* Recommended Degrees */}
                {courseDegree.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Recommended Courses / Degrees</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {courseDegree.map((course, i) => (
                                <span key={i} style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Academic Strengths */}
                {academicStrength.length > 0 && (
                    <div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Key Subjects / Strengths</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {academicStrength.map((strength, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.6rem 1rem' }}>
                                    <CheckCircle2 size={16} color="#8B5CF6" />
                                    <span style={{ fontSize: '0.9rem' }}>{strength}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/roadmap')}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}
                >
                    View Your Career Roadmap <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default StreamRecommendation;
