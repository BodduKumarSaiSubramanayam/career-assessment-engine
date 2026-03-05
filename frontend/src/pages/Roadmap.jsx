import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Calendar, AlertCircle } from 'lucide-react';

function Roadmap() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [visible, setVisible] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('assessmentResults');
            if (!stored || stored === 'undefined') {
                throw new Error('No assessment data found. Please complete the assessment first.');
            }
            const parsed = JSON.parse(stored);
            setResults(parsed);

            const steps = parsed.roadmap || parsed.topMatch?.actionPlan || [];
            steps.forEach((_, i) => {
                setTimeout(() => setVisible(prev => [...prev, i]), 200 + i * 200);
            });
        } catch (err) {
            console.error('Roadmap Page Error:', err);
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

    if (!results) return <div style={{ textAlign: 'center', marginTop: '30vh' }}><h2>Generating Roadmap...</h2></div>;

    const roadmap = results.roadmap || results.topMatch?.actionPlan || [];
    const topCareer = results.topMatch?.role || 'Your Career';

    const stepColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

    const renderStep = (step, i) => {
        const color = stepColors[i % stepColors.length];
        if (typeof step === 'string') {
            const colonIdx = step.indexOf(':');
            return {
                color,
                phase: colonIdx > -1 ? step.slice(0, colonIdx).trim() : `Phase ${i + 1}`,
                description: colonIdx > -1 ? step.slice(colonIdx + 1).trim() : step,
                actions: []
            };
        }
        return {
            color,
            phase: step.phase || step.timeframe || `Phase ${i + 1}`,
            description: step.goal || step.description || '',
            actions: Array.isArray(step.actions) ? step.actions : []
        };
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                {['Scoring', 'Career Match', 'Stream', 'Roadmap', 'Dashboard'].map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: i < 3 ? 'rgba(59,130,246,0.3)' : i === 3 ? '#F59E0B' : 'rgba(255,255,255,0.1)', color: i <= 3 ? '#fff' : 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {i === 3 ? '● ' : ''}{step}
                        </div>
                        {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>›</span>}
                    </div>
                ))}
            </div>

            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: 'rgba(245,158,11,0.15)', borderRadius: '12px', padding: '0.75rem', color: '#F59E0B' }}>
                        <MapPin size={28} />
                    </div>
                    <div>
                        <p style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 7 of 8</p>
                        <h2 style={{ margin: 0 }}>Roadmap Generator</h2>
                    </div>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Personal plan for <strong style={{ color: '#fff' }}>{topCareer}</strong>.</p>

                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    <div style={{ position: 'absolute', left: '9px', top: '8px', bottom: '8px', width: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {roadmap.map((step, i) => {
                            const { color, phase, description, actions } = renderStep(step, i);
                            const show = visible.includes(i);
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', opacity: show ? 1 : 0, transform: show ? 'none' : 'translateX(-10px)', transition: 'all 0.4s ease', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-2rem', top: '6px', width: '18px', height: '18px', borderRadius: '50%', background: color, border: '3px solid rgb(15,15,25)', flexShrink: 0 }} />
                                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem 1.25rem', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                            <Calendar size={14} color={color} />
                                            <span style={{ color, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>{phase}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                    View Career Dashboard <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default Roadmap;
