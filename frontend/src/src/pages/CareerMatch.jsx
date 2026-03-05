import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Star, TrendingUp } from 'lucide-react';

function CareerMatch() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('assessmentResults');
        if (!stored) { navigate('/'); return; }
        setResults(JSON.parse(stored));
    }, [navigate]);

    if (!results) return null;
    const { topMatch, alternateCareers = [] } = results;

    const fitColor = (fit) => {
        if (fit >= 80) return '#10B981';
        if (fit >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                {['Scoring', 'Career Match', 'Stream', 'Roadmap', 'Dashboard'].map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: i === 0 ? 'rgba(59,130,246,0.3)' : i === 1 ? '#3B82F6' : 'rgba(255,255,255,0.1)', color: i <= 1 ? '#fff' : 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {i === 1 ? '● ' : ''}{step}
                        </div>
                        {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>›</span>}
                    </div>
                ))}
            </div>

            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: '12px', padding: '0.75rem', color: '#10B981' }}>
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <p style={{ color: '#10B981', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 5 of 8</p>
                        <h2 style={{ margin: 0 }}>Career Matching Engine</h2>
                    </div>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Your profile was compared against our career database. Here are your matches, ranked by fit percentage.
                </p>

                {/* Top Match */}
                {topMatch && (
                    <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                    <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.85rem' }}>TOP MATCH</span>
                                </div>
                                <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.4rem' }}>{topMatch.role}</h3>
                                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{topMatch.cluster}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: fitColor(topMatch.currentFit), lineHeight: 1 }}>{topMatch.currentFit}%</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Career Fit</div>
                            </div>
                        </div>
                        {topMatch.description && <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>{topMatch.description}</p>}
                    </div>
                )}

                {/* Alternate Careers */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <TrendingUp size={16} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>ALTERNATE MATCHES</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {alternateCareers.slice(0, 4).map((career, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{career.role}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{career.cluster}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: fitColor(career.currentFit), fontSize: '1.1rem' }}>{career.currentFit}%</div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => navigate('/stream-recommendation')}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    View Stream & Subject Recommendations <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default CareerMatch;
