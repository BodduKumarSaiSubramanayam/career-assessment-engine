import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Navigation, Star, Briefcase, Download, CheckCircle2, Share2, Award, Zap, ChevronRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

function Dashboard() {
  const [results, setResults] = useState(null);
  const [targetName, setTargetName] = useState('Explorer');
  const [typedText, setTypedText] = useState('');
  const [acquiredSkills, setAcquiredSkills] = useState([]);
  const [skillBoost, setSkillBoost] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const shareCardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('assessmentResults');
    const uName = localStorage.getItem('userName');
    if (uName) setTargetName(uName);

    if (data) {
      try {
        const resData = JSON.parse(data);
        setResults(resData);

        // AI Typing Effect
        let i = 0;
        const textToType = resData.topMatch.whyMatch || "We've matched you based on your unique combination of skills and interests.";
        setTypedText('');
        const interval = setInterval(() => {
          setTypedText(prev => prev + textToType.charAt(i));
          i++;
          if (i >= textToType.length) clearInterval(interval);
        }, 20);

        return () => clearInterval(interval);
      } catch (e) {
        console.error("Dashboard Parse Error", e);
        navigate('/assessment');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!results) return <div style={{ textAlign: 'center', marginTop: '30vh' }}><div className="loader"></div><h2>Assembling Your Dashboard...</h2></div>;

  const { topMatch, alternateCareers, profile } = results;

  const toggleSkill = (skill) => {
    setAcquiredSkills(prev => {
      const next = prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill];
      setSkillBoost(next.length * 2.5); // More impactful boost
      return next;
    });
  };

  const currentFitWithBoost = Math.min(topMatch.currentFit + skillBoost, 100);

  const handleDownloadPDF = () => {
    const element = document.getElementById('dashboard-content');
    const opt = {
      margin: 0.5,
      filename: `${targetName}_Career_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const radarData = [
    { subject: 'STEM', A: profile.STEM, fullMark: 100 },
    { subject: 'Arts', A: profile.Arts, fullMark: 100 },
    { subject: 'Commerce', A: profile.Commerce, fullMark: 100 },
    { subject: 'Mgt', A: profile.Management || 0, fullMark: 100 }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Interactive Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Interactive <span style={{ color: 'var(--primary)' }}>Career Dashboard</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time analysis for <strong>{targetName}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleDownloadPDF} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export PDF
          </button>
          <button onClick={() => navigate('/roadmap')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View Full Roadmap <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div id="dashboard-content">
        {/* Top Highlight Card */}
        <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '6px solid var(--primary)', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
            <Briefcase size={200} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Zap size={20} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Optimal Match Found</span>
              </div>
              <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{topMatch.role}</h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <span className="tag" style={{ background: 'rgba(59,130,246,0.2)', color: '#60A5FA' }}>{topMatch.cluster}</span>
                <span className="tag" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399' }}>{topMatch.marketGrowth} Growth</span>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: '600px' }}>
                {typedText}<span className="cursor">|</span>
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{Math.round(currentFitWithBoost)}%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Match Score</div>
              {skillBoost > 0 && <div style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>+{Math.round(skillBoost)}% Boost Applied</div>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {/* Aptitude Radar */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="var(--primary)" /> Aptitude Blueprint
            </h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="You" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
                  <Tooltip contentStyle={{ background: '#1F2937', border: 'none', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Checklist */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} color="#F59E0B" /> Skill Gap Analyzer
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Check skills you've mastered to see your match score climb!</p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {topMatch.skillsToDevelop.map(skill => (
                <div
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: acquiredSkills.includes(skill) ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: acquiredSkills.includes(skill) ? '#10B981' : 'var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    border: '2px solid',
                    borderColor: acquiredSkills.includes(skill) ? '#10B981' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {acquiredSkills.includes(skill) && <CheckCircle2 size={16} color="#10B981" />}
                  </div>
                  <span style={{ fontWeight: acquiredSkills.includes(skill) ? 600 : 400 }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career Path Table */}
        <div className="glass-card" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Priority Alternate Paths</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem' }}>Career Path</th>
                  <th style={{ padding: '1rem' }}>Industry</th>
                  <th style={{ padding: '1rem' }}>Match</th>
                  <th style={{ padding: '1rem' }}>Salary Potential</th>
                </tr>
              </thead>
              <tbody>
                {alternateCareers.map((career, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1.25rem', fontWeight: 600 }}>{career.role}</td>
                    <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{career.cluster}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ height: '6px', width: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                          <div style={{ height: '100%', width: `${career.currentFit}%`, background: 'var(--secondary)', borderRadius: '3px' }}></div>
                        </div>
                        <span>{career.currentFit}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem', color: '#10B981', fontWeight: 600 }}>{career.salaryRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .cursor {
          display: inline-block;
          width: 8px;
          animation: blink 1s infinite;
          color: var(--primary);
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .table-row-hover:hover {
          background: rgba(255,255,255,0.02);
        }
        .loader {
          border: 3px solid rgba(255,255,255,0.1);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
