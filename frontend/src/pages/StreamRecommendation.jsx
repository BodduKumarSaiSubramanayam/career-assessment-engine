import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle2, FlaskConical, GraduationCap, AlertCircle } from 'lucide-react';

function StreamRecommendation() {
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
            console.error('StreamRecommendation Page Error:', err);
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

    if (!results) return <div style={{ textAlign: 'center', marginTop: '30vh' }}><h2>Analyzing Academic Path...</h2></div>;

    const { streamData, topMatch } = results;

    // Safely extract fields — normalize everything to arrays/strings
    const stream = streamData?.subjectStream || topMatch?.subjectStream || 'N/A';
    const courseDegreeRaw = streamData?.courseDegree || topMatch?.courseDegree || '';
    const academicStrengthRaw = streamData?.academicStrength || topMatch?.academicStrength || '';

    const courseDegrees = Array.isArray(courseDegreeRaw) ? courseDegreeRaw : (courseDegreeRaw ? [courseDegreeRaw] : []);
    const academicStrengths = Array.isArray(academicStrengthRaw) ? academicStrengthRaw : (academicStrengthRaw ? [academicStrengthRaw] : []);

    const streamColors = { Science: '#3B82F6', Arts: '#8B5CF6', Commerce: '#10B981', Technology: '#F59E0B', Humanities: '#EC4899' };
    const streamColor = Object.entries(streamColors).find(([k]) => stream && stream.includes(k))?.[1] || '#3B82F6';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
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

                {/* Recommended Stream */}
                <div style={{ background: `linear-gradient(135deg, ${streamColor}22, ${streamColor}0a)`, border: `1px solid ${streamColor}44`, borderRadius: '16px', padding: '1.5rem', margin: '2rem 0', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <FlaskConical size={32} color={streamColor} />
                    </div>
                    <p style={{ color: streamColor, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Recommended Stream</p>
                    <h3 style={{ fontSize: '1.6rem', margin: 0 }}>{stream}</h3>
                </div>

                {/* Recommended Degrees */}
                {courseDegrees.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <GraduationCap size={16} color="#8B5CF6" />
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Course / Degree Path</h4>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {courseDegrees.map((course, i) => (
                                <span key={i} style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 500 }}>
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Academic Strengths */}
                {academicStrengths.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <CheckCircle2 size={16} color="#8B5CF6" />
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Academic Strength Required</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {academicStrengths.map((strength, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                                    <CheckCircle2 size={16} color="#8B5CF6" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{strength}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button onClick={() => navigate('/roadmap')} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Proceed to Career Roadmap <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default StreamRecommendation;
