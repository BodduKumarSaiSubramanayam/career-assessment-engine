import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Navigation, Star, Briefcase, Download, CheckCircle2, Share2, Award } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

function Dashboard() {
  const [results, setResults] = useState(null);
  const [targetName, setTargetName] = useState('Explorer');
  const [typedText, setTypedText] = useState('');
  const [acquiredSkills, setAcquiredSkills] = useState([]);
  const [skillBoost, setSkillBoost] = useState(0);
  const [showShareCard, setShowShareCard] = useState(false);
  const shareCardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('assessmentResults');
    const uName = localStorage.getItem('userName');
    if (uName) setTargetName(uName);

    if (data) {
      const resData = JSON.parse(data);
      setResults(resData);

      // AI Typing Effect Setup
      let i = 0;
      const textToType = resData.topMatch.whyMatch;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText(prev => prev + textToType.charAt(i));
        i++;
        if (i >= textToType.length) clearInterval(interval);
      }, 30);

      return () => clearInterval(interval);
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!results) return <div style={{ textAlign: 'center', marginTop: '20vh' }}><h2>Designing Dashboard...</h2></div>;

  const { topMatch, alternateCareers, profile } = results;



  const toggleSkill = (skill) => {
    setAcquiredSkills(prev => {
      const next = prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill];
      setSkillBoost(next.length * 1.5);
      return next;
    });
  };

  const currentFitWithBoost = Math.min(topMatch.currentFit + skillBoost, 100);

  const handleJobSearch = () => {
    const query = encodeURIComponent(`Junior ${topMatch.role} jobs`);
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, '_blank');
  };

  const handleCourseSearch = () => {
    const query = encodeURIComponent(`${topMatch.role} certification course`);
    window.open(`https://www.google.com/search?q=${query}+site:coursera.org+OR+site:udemy.com`, '_blank');
  };

  // --- Feature 1: Personality Type Badge ---
  const getPersonalityType = (profile) => {
    const scores = [
      { name: 'STEM', val: profile.STEM },
      { name: 'Arts', val: profile.Arts },
      { name: 'Commerce', val: profile.Commerce },
      { name: 'Management', val: profile.Management || 0 }
    ].sort((a, b) => b.val - a.val);

    const top = scores[0].name;
    const second = scores[1].name;
    const badges = {
      'STEM-Arts': { label: 'The Creative Technologist', emoji: '🔬🎨', color: '#6366F1', desc: 'You blend analytical thinking with creative flair — rare and highly sought after in modern tech.' },
      'STEM-Commerce': { label: 'The Data Strategist', emoji: '📊💻', color: '#0EA5E9', desc: 'You think in systems and numbers. Perfect for roles at the intersection of technology and business.' },
      'STEM-Management': { label: 'The Analytical Leader', emoji: '⚙️🧠', color: '#8B5CF6', desc: 'You have the rare ability to lead teams while thinking in data — an engineering manager in the making.' },
      'Arts-STEM': { label: 'The UX Visionary', emoji: '🎨✨', color: '#EC4899', desc: 'You make technology beautiful and human-friendly. Your empathy for users is your greatest strength.' },
      'Arts-Commerce': { label: 'The Brand Storyteller', emoji: '🎭💡', color: '#F59E0B', desc: 'You communicate ideas powerfully and understand markets. Marketing and branding are your domains.' },
      'Arts-Management': { label: 'The Creative Director', emoji: '🎬🌟', color: '#EF4444', desc: 'You inspire teams through vision and creativity. Born to lead creative studios and agencies.' },
      'Commerce-STEM': { label: 'The FinTech Builder', emoji: '💰🔧', color: '#10B981', desc: 'You understand financial systems and can automate them. The future of finance needs people like you.' },
      'Commerce-Arts': { label: 'The Growth Marketer', emoji: '📈🎯', color: '#F97316', desc: 'You understand what customers want and how markets move. Sales and marketing is your playground.' },
      'Commerce-Management': { label: 'The Corporate Leader', emoji: '🏢👔', color: '#64748B', desc: 'You think strategically and manage resources brilliantly. C-suite is where you are headed.' },
      'Management-STEM': { label: 'The Product Visionary', emoji: '🚀💡', color: '#A855F7', desc: 'You build products that change the world by combining technical understanding with leadership.' },
      'Management-Arts': { label: 'The Innovation Catalyst', emoji: '✨🗣️', color: '#14B8A6', desc: 'You energize teams and create culture. Entrepreneurship and consulting are ideal for you.' },
      'Management-Commerce': { label: 'The Business Architect', emoji: '🏗️📋', color: '#06B6D4', desc: 'You design systems that make organizations grow. A natural entrepreneur and strategist.' },
    };
    const key = `${top}-${second}`;
    return badges[key] || { label: 'The Well-Rounded Explorer', emoji: '🌟', color: '#6366F1', desc: 'You have a balanced profile which makes you adaptable to multiple career paths.' };
  };

  const personality = getPersonalityType(profile);

  // --- Feature 2: Shareable Card Screenshot ---
  const handleShareCard = async () => {
    if (!shareCardRef.current) return;
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#0D1117',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `${targetName.replace(/\s+/g, '_')}_Career_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Share card error:', err);
      alert('Could not generate image. Please try again.');
    }
  };

  // --- Feature 5: Upgraded PDF Report ---
  const handleDownloadPDF = () => {
    const element = document.getElementById('printable-dashboard');
    const opt = {
      margin: [0.3, 0.5, 0.3, 0.5],
      filename: `${targetName.replace(/\s+/g, '_')}_Professional_Career_Report.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Data for Recharts Radar
  const radarData = [
    { subject: 'STEM / Analytical', A: profile.STEM, fullMark: 100 },
    { subject: 'Arts / Creative', A: profile.Arts, fullMark: 100 },
    { subject: 'Commerce / Financial', A: profile.Commerce, fullMark: 100 },
    { subject: 'Leadership / Mgt', A: profile.Management || 0, fullMark: 100 }
  ];

  // Data for Recharts Bar (Career Fits)
  const barData = [
    { name: topMatch.role, Fit: topMatch.currentFit },
    ...alternateCareers.map(ac => ({ name: ac.role, Fit: ac.currentFit }))
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>

      {/* Personalized Header & PDF Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1rem 2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={`https://ui-avatars.com/api/?name=${targetName}&background=2563EB&color=fff&rounded=true&size=48`} alt="Avatar" width="48" height="48" style={{ border: '2px solid var(--primary)', borderRadius: '50%' }} />
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Welcome back,</p>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{targetName}</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleShareCard} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', marginBottom: 0 }}>
            <Share2 size={18} /> Share Card
          </button>
          <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', marginBottom: 0 }}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div id="printable-dashboard" style={{ padding: '1rem', background: 'var(--background)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', margin: '1rem 0 0.5rem 0' }}>Your Career Roadmap</h1>
          <p style={{ fontSize: '1.2rem' }}>We&apos;ve analyzed your multi-dimensional profile. Here is your ideal future.</p>
        </div>

        {/* Feature 1: Personality Type Badge */}
        <div className="glass-card" style={{ marginBottom: '2rem', background: `linear-gradient(135deg, ${personality.color}18, transparent)`, border: `1px solid ${personality.color}44`, display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '4rem', lineHeight: 1 }}>{personality.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Award size={18} color={personality.color} />
              <span style={{ fontSize: '0.85rem', color: personality.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Your Personality Type</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: 'white' }}>{personality.label}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: '600px' }}>{personality.desc}</p>
          </div>
          <div style={{ background: `${personality.color}22`, border: `1px solid ${personality.color}55`, padding: '0.6rem 1.2rem', borderRadius: '20px', color: personality.color, fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
            {Math.round(currentFitWithBoost)}% Match
          </div>
        </div>

        {/* Top Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--secondary)' }}>Top Career Match</h3>
            <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{topMatch.role}</h2>
            <span className="tag">{topMatch.cluster}</span>
            <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '50%', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--primary)' }}>
              <span className="match-score">{Math.round(currentFitWithBoost)}%</span>
            </div>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Match Accuracy {skillBoost > 0 && <span style={{ color: '#10B981', fontSize: '0.8rem' }}>(+Skills Boost!)</span>}</p>
          </div>

          <div className="glass-card" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Star color="#F59E0B" size={24} />
              <h3 style={{ fontSize: '1.25rem' }}>Market Intelligence</h3>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                <p style={{ fontSize: '0.85rem', color: '#F59E0B', marginBottom: '0.2rem' }}>Salary Outlook</p>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{topMatch.salaryRange || '$70,000 - $110,000'}</h4>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <p style={{ fontSize: '0.85rem', color: '#10B981', marginBottom: '0.2rem' }}>Market Growth</p>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{topMatch.marketGrowth || '+15% Growth'}</h4>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={handleJobSearch} style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem' }}>Search Jobs</button>
                <button className="btn btn-primary" onClick={handleCourseSearch} style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem' }}>Find Courses</button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizations Grid */}
        <div className="dashboard-grid delay-1">
          {/* Radar Profile */}
          <div className="glass-card" style={{ minHeight: '350px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target color="var(--primary)" size={24} />
              <h3 style={{ fontSize: '1.25rem' }}>Aptitude Distribution</h3>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Aptitude" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Match Probabilities */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target color="var(--secondary)" size={24} />
              <h3 style={{ fontSize: '1.25rem' }}>Career Fit Probabilities</h3>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'var(--text-main)', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }} formatter={(val) => `${val}% Fit`} />
                  <Bar dataKey="Fit" fill="var(--secondary)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Academics */}
          <div className="glass-card delay-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <BookOpen color="#3B82F6" size={24} />
              <h3 style={{ fontSize: '1.25rem' }}>AI Rationale & Academic Path</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', minHeight: '60px', fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
              &quot;{typedText}&quot;
            </p>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ fontSize: '0.9rem', color: '#60A5FA' }}>Recommended Stream</p>
              <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>{topMatch.subjectStream}</h4>
            </div>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ fontSize: '0.9rem', color: '#60A5FA' }}>Future Scope</p>
              <h4 style={{ fontSize: '1rem', marginTop: '0.2rem', color: 'var(--text-main)', fontWeight: 400 }}>{topMatch.futureScope}</h4>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ fontSize: '0.9rem', color: '#60A5FA' }}>Academic Strength Needed</p>
              <h4 style={{ fontSize: '1rem', marginTop: '0.2rem', color: 'var(--text-main)', fontWeight: 400 }}>{topMatch.academicStrength}</h4>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ fontSize: '0.9rem', color: '#60A5FA' }}>Degree / Course</p>
              <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>{topMatch.courseDegree}</h4>
            </div>
          </div>

          {/* Alternates */}
          <div className="glass-card delay-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Briefcase color="#8B5CF6" size={24} />
              <h3 style={{ fontSize: '1.25rem' }}>Priority Alternate Careers</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {alternateCareers.map((career, idx) => (
                <li key={idx} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'white', display: 'block', marginBottom: '0.2rem' }}>{career.role}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{career.cluster}</span>
                  </div>
                  <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '20px', color: '#C4B5FD', fontWeight: 600 }}>
                    {career.currentFit}%
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interaction: Skill Gap Analyzer */}
        <div className="glass-card delay-1" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Star color="#F59E0B" size={24} />
            <h3 style={{ fontSize: '1.25rem' }}>Interactive Skill Gap Analyzer</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Check the skills you already possess to see how your career readiness improves!</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {topMatch.skillsToDevelop.map((skill, idx) => (
              <div
                key={idx}
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: acquiredSkills.includes(skill) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: acquiredSkills.includes(skill) ? '1px solid #10B981' : '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid', borderColor: acquiredSkills.includes(skill) ? '#10B981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {acquiredSkills.includes(skill) && <CheckCircle2 size={16} color="#10B981" />}
                </div>
                <span style={{ color: acquiredSkills.includes(skill) ? 'white' : 'var(--text-muted)' }}>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Year Plan */}
        <div className="glass-card delay-3" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Navigation color="#10B981" size={24} />
            <h3 style={{ fontSize: '1.5rem' }}>5-Year Action Plan</h3>
          </div>
          <div className="timeline">
            {topMatch.actionPlan.map((step, idx) => (
              <div key={idx} className="timeline-item">
                <p style={{ fontSize: '1.1rem', color: 'white' }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="btn btn-secondary" onClick={() => {
          localStorage.clear();
          navigate('/');
        }}>
          Retake Assessment
        </button>
      </div>

      {/* Feature 2: Hidden Shareable Card for Screenshot */}
      <div
        ref={shareCardRef}
        style={{
          position: 'fixed', top: '-9999px', left: '-9999px',
          width: '600px', padding: '2.5rem',
          background: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)',
          border: `2px solid ${personality.color}`,
          borderRadius: '24px', fontFamily: 'Inter, sans-serif'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <p style={{ color: '#8B949E', fontSize: '0.8rem', margin: '0 0 0.3rem 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Career Assessment Result</p>
            <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0 }}>{targetName}</h1>
          </div>
          <div style={{ background: `${personality.color}22`, border: `1px solid ${personality.color}`, padding: '0.4rem 1rem', borderRadius: '20px', color: personality.color, fontWeight: 700 }}>
            {Math.round(currentFitWithBoost)}% Match
          </div>
        </div>

        <div style={{ background: `${personality.color}11`, border: `1px solid ${personality.color}44`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '3.5rem' }}>{personality.emoji}</div>
          <div>
            <p style={{ color: personality.color, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.3rem 0' }}>Personality Type</p>
            <h2 style={{ color: 'white', fontSize: '1.4rem', margin: '0 0 0.4rem 0' }}>{personality.label}</h2>
            <p style={{ color: '#8B949E', fontSize: '0.85rem', margin: 0 }}>{personality.desc.substring(0, 80)}...</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: '#8B949E', fontSize: '0.75rem', margin: '0 0 0.3rem 0' }}>TOP CAREER MATCH</p>
            <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>{topMatch.role}</h3>
            <p style={{ color: '#58A6FF', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>{topMatch.cluster}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: '#8B949E', fontSize: '0.75rem', margin: '0 0 0.3rem 0' }}>SALARY OUTLOOK</p>
            <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>{topMatch.salaryRange || '$70K – $110K'}</h3>
            <p style={{ color: '#10B981', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>{topMatch.marketGrowth || '+15% Growth'}</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          <p style={{ color: '#8B949E', fontSize: '0.75rem', margin: 0 }}>Generated by AI Career Assessment Engine • {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
