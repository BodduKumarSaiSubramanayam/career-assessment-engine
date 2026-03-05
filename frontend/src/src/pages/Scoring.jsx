import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, ArrowRight, CheckCircle } from 'lucide-react';

const DIMENSION_INFO = {
    STEM: { label: 'Aptitude & Logic', color: '#3B82F6', desc: 'Analytical reasoning and technical problem-solving.' },
    Arts: { label: 'Creativity & Expression', color: '#8B5CF6', desc: 'Creative thinking and artistic expression skills.' },
    Commerce: { label: 'Commerce & Finance', color: '#10B981', desc: 'Business acumen and financial understanding.' },
    Management: { label: 'Leadership & People', color: '#F59E0B', desc: 'Team management and interpersonal influence.' },
};

function Scoring() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [animated, setAnimated] = useState({});

    useEffect(() => {
        const stored = localStorage.getItem('assessmentResults');
        if (!stored) { navigate('/'); return; }
        const parsed = JSON.parse(stored);
        setResults(parsed);
        // Animate bars one by one
        const keys = Object.keys(DIMENSION_INFO);
        keys.forEach((key, i) => {
            setTimeout(() => {
                setAnimated(prev => ({ ...prev, [key]: true }));
            }, 300 + i * 300);
        });
    }, [navigate]);

    if (!results) return null;
    const profile = results.profile || {};

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                {['Scoring', 'Career Match', 'Stream', 'Roadmap', 'Dashboard'].map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: i === 0 ? '#3B82F6' : 'rgba(255,255,255,0.1)', color: i === 0 ? '#fff' : 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {i === 0 ? '● ' : ''}{step}
                        </div>
                        {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>›</span>}
                    </div>
                ))}
            </div>

            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: 'rgba(59,130,246,0.15)', borderRadius: '12px', padding: '0.75rem', color: '#3B82F6' }}>
                        <BarChart2 size={28} />
                    </div>
                    <div>
                        <p style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 4 of 8</p>
                        <h2 style={{ margin: 0 }}>Scoring & Weightage Algorithm</h2>
                    </div>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                    We've analysed your responses across 5 dimensions and calculated your unique profile scores below.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {Object.entries(DIMENSION_INFO).map(([key, info]) => {
                        const score = Math.round((profile[key] || 0));
                        return (
                            <div key={key}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span style={{ fontWeight: 600 }}>{info.label}</span>
                                    <span style={{ fontWeight: 700, color: info.color }}>{score}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100</span></span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        borderRadius: '999px',
                                        background: `linear-gradient(90deg, ${info.color}, ${info.color}99)`,
                                        width: animated[key] ? `${score}%` : '0%',
                                        transition: 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
                                        boxShadow: `0 0 12px ${info.color}66`
                                    }} />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{info.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '1rem', marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={18} color="#3B82F6" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Your highest dimension: <strong style={{ color: '#fff' }}>{DIMENSION_INFO[Object.entries(profile).sort((a, b) => b[1] - a[1])[0]?.[0]]?.label || '—'}</strong>
                    </span>
                </div>

                <button
                    onClick={() => navigate('/career-match')}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    Proceed to Career Matching Engine <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default Scoring;
