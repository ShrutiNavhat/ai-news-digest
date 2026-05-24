import { useState } from 'react';

const MODES_CONFIG = [
  { id: 'summary', label: 'Summary' },
  { id: 'keyFacts', label: 'Key Facts' },
  { id: 'eli5', label: 'ELI5' },
  { id: 'biasCheck', label: 'Bias Check' }
];

export default function App() {
  // REQUIRED CONCEPT: Track 5 distinct state values
  const [text, setText] = useState('');
  const [activeMode, setActiveMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  
  const [submittedText, setSubmittedText] = useState(''); 

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    
    
    if (val.length >= 4000) {
      setError('Hard block reached: Maximum 4,000 characters allowed.');
    } else if (val.length >= 3500) {
      setError('Warning: You are approaching the 4,000 character limit.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');

    
    if (!text.trim()) {
      setError('Empty input: Please paste a news article before submitting.');
      return;
    }
    if (text.length > 4000) {
      setError('Input over 4,000 characters is hard-blocked.');
      return;
    }
    if (!activeMode) {
      setError('No mode selected: Please choose a digest type.');
      return;
    }

    
    const sanitizedText = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    setLoading(true);
    setSubmittedText(sanitizedText);

    try {
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/digest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sanitizedText, mode: activeMode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'LLM API encountered an error.');
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || 'Unable to communicate with the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>📰 AI News Digest App</h1>
        <p style={{ color: '#555' }}>Paste your raw text, pick your mode, and get your custom breakdown.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          rows="8"
          style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
          placeholder="Paste news article body here..."
          value={text}
          onChange={handleTextChange}
        />
        
        <div style={{ fontSize: '0.875rem', color: text.length > 4000 ? 'red' : text.length >= 3500 ? 'orange' : '#666' }}>
          Character Count: {text.length} / 4000
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Select Digest Mode:</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* REQUIRED CONCEPT: Use map() to render the four mode buttons from a config array */}
            {MODES_CONFIG.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '20px',
                  border: '2px solid #007bff',
                  cursor: 'pointer',
                  backgroundColor: activeMode === mode.id ? '#007bff' : '#fff',
                  color: activeMode === mode.id ? '#fff' : '#007bff',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || text.length > 4000}
          style={{
            padding: '1rem',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Generating Digest...' : 'Submit Post'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '1rem', marginTop: '1.5rem', backgroundColor: '#fff3f3', color: '#b71c1c', borderLeft: '5px solid #b71c1c', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      
      {(submittedText || result) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Original News Text</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: '#555', lineHeight: '1.6' }}>{submittedText}</p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid #d0e1fd', borderRadius: '8px', backgroundColor: '#f4f8ff' }}>
            <h3 style={{ marginTop: 0, color: '#0056b3' }}>AI Generated Digest</h3>
            {loading ? (
              <p style={{ fontStyle: 'italic', color: '#777' }}>AI is analyzing text...</p>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap', color: '#222', lineHeight: '1.6' }}>{result}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}