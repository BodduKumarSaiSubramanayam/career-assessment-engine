import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Star, TrendingUp, AlertCircle } from 'lucide-react';

function CareerMatch() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('assessmentResults');
            if (!stored || stored === 'undefined') {
                throw new Error('No assessment data found. Please complete the assessment first.');
            }
            setResults(JSON.parse(stored));
        } catch (err) {
            console.error('CareerMatch Page Error:', err);
            setError(err.message);
        }
    }, []);

    if (error) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '1rem' }} />
                    <h2>Data missing or corrupted</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/assessment')}>Go to Assessment</button>
                </div>
            </div>
        );
    }

    if (!results) return <div style={{ textAlign: 'center', marginTop: '30vh' }}><h2>Finding Your Matches...</h2></div>;

    const { topMatch, alternateCareers = [] } = results;

    const fitColor = (fit) => {
        if (fit >= 80) return '#10B981';
        if (fit >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                {['Scoring', 'Career Match', 'Stream', 'Roadmap', 'Dashboard'].map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: i < 1 ? 'rgba(59,130,246,0.3)' : i === 1 ? '#3B82F6' : 'rgba(255,255,255,0.1)', color: i <= 1 ? '#fff' : 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
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

                {/* Top Match */}
                {topMatch ? (
                    <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '16px', padding: '1.5rem', margin: '2rem 0' }}>
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
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fit Accuracy</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No matches found.</div>
                )}

                <button onClick={() => navigate('/stream-recommendation')} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Proceed to Stream Recommendation <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default CareerMatch;
