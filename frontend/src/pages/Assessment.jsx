import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

function Assessment() {
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const navigate = useNavigate();

  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assessment/questions`)
      .then(res => res.json())
      .then(data => {
        const qs = data.questions || [];
        setQuestions(qs);

        // Group by section
        const uniqueSections = [...new Set(qs.map(q => q.section))];
        setSections(uniqueSections);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [email, navigate]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  useEffect(() => {
    if (loading || sections.length === 0) return;
    if (timeLeft <= 0) {
      handleNext(true);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, loading, sections]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = async (forceSubmit = false) => {
    if (!forceSubmit && currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(([questionId, answerValue]) => ({
        questionId, answerValue
      }));

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assessment/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, answers: formattedAnswers })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('assessmentResults', JSON.stringify(data.results));
          navigate('/scoring');
        } else {
          alert(data.error || 'Submission failed');
        }
      } catch (error) {
        console.error(error);
        alert('Error submitting assessment');
      }
      setSubmitting(false);
    }
  };




  if (loading) return <div style={{ textAlign: 'center', marginTop: '20vh' }}><h2>Loading Assessment Modules...</h2></div>;
  if (sections.length === 0) return <div style={{ textAlign: 'center', marginTop: '20vh' }}><h2>No questions found</h2></div>;

  const currentSectionName = sections[currentSectionIndex];
  const currentQuestions = questions.filter(q => q.section === currentSectionName);

  // Check if all questions in current section are answered
  const isSectionComplete = currentQuestions.every(q => answers[q.id] !== undefined);
  const progress = Math.round(((currentSectionIndex) / sections.length) * 100);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
            Module {currentSectionIndex + 1} of {sections.length}
          </span>
          {currentSectionName}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>{currentQuestions.length} Questions</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
            color: timeLeft < 60 ? '#EF4444' : 'var(--text-main)',
            padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold'
          }}>
            <Clock size={16} className={timeLeft < 60 ? 'animate-pulse' : ''} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '3rem', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.3s ease' }}></div>
      </div>

      <div className="glass-card" style={{ padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>{currentSectionName} Assessment</h2>

        {currentQuestions.map((q, idx) => (
          <div key={q.id} className={`question-container delay-${(idx % 3) + 1}`} style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>{idx + 1}. {q.text}</h3>

            <div>
              {(() => {
                if (['scale', 'likert_text', 'boolean', 'frequency'].includes(q.type)) {
                  let choices = [];
                  if (q.type === 'scale') choices = [1, 2, 3, 4, 5];
                  if (q.type === 'likert_text') choices = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];
                  if (q.type === 'boolean') choices = ['Yes', 'No'];
                  if (q.type === 'frequency') choices = ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'];

                  const isRowLayout = q.type === 'scale' || q.type === 'boolean';

                  return (
                    <div style={{ display: 'flex', flexDirection: isRowLayout ? 'row' : 'column', gap: '0.5rem' }}>
                      {choices.map(choice => (
                        <button
                          key={choice}
                          className={`option-btn ${answers[q.id] === choice ? 'selected' : ''}`}
                          style={{ textAlign: isRowLayout ? 'center' : 'left', padding: '1rem', flex: 1, marginBottom: 0 }}
                          onClick={() => handleAnswer(q.id, choice)}
                        >
                          {!isRowLayout ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '1.1rem' }}>{choice}</span>
                              {answers[q.id] === choice && <CheckCircle2 size={20} color="var(--primary)" />}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{choice}</span>
                              {answers[q.id] === choice && q.type === 'boolean' && <CheckCircle2 size={18} color="var(--primary)" />}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          className={`option-btn ${answers[q.id] === opt.text ? 'selected' : ''}`}
                          onClick={() => handleAnswer(q.id, opt.text)}
                          style={{ marginBottom: 0 }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                            <span>{opt.text}</span>
                            {answers[q.id] === opt.text && <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginLeft: '1rem' }} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => handleNext(false)}
            disabled={!isSectionComplete || submitting}
          >
            {submitting ? 'Analyzing Constraints...' : currentSectionIndex === sections.length - 1 ? 'Generate Career Roadmap' : 'Next Module'}
            {!submitting && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
