

'use client';

import { useState } from 'react';

export default function GeneratePage() {
  const [studentInput, setStudentInput] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock professor data for now — this will later come from /match
  const mockProfessor = {
    name: 'Dr. Jane Doe',
    title: 'Associate Professor of Computer Science',
    department: 'Computer Science',
    summary: 'Researches machine learning and natural language processing',
    recent_publications: [
      'Understanding Contextual Embeddings in Transformers',
      'Efficient Fine-Tuning Techniques for LLMs'
    ]
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_input: studentInput,
          professor: mockProfessor
        })
      });

      const data = await res.json();
      setGeneratedEmail(data.email);
    } catch (err) {
      console.error('Error generating email:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Cold Email</h1>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        rows={4}
        placeholder="Describe your research interests..."
        value={studentInput}
        onChange={(e) => setStudentInput(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Email'}
      </button>
      {generatedEmail && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Email:</h2>
          <div className="whitespace-pre-wrap border border-gray-200 p-4 rounded bg-gray-50">
            {generatedEmail}
          </div>
        </div>
      )}
    </main>
  );
}