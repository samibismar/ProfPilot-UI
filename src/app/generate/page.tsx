

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Professor = {
  name: string;
  department: string;
  bio: string;
  similarity?: number;
};

function GeneratePageContent() {
  const [studentInput, setStudentInput] = useState('');
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();

  // Mock professor data for standalone usage
  const mockProfessor = {
    name: 'Dr. Jane Doe',
    department: 'Computer Science',
    bio: 'Researches machine learning and natural language processing with focus on transformer architectures and efficient fine-tuning techniques.',
  };

  useEffect(() => {
    // Check for professor data from URL params or localStorage
    const professorParam = searchParams.get('professor');
    const inputParam = searchParams.get('input');
    
    if (professorParam) {
      try {
        setProfessor(JSON.parse(professorParam));
      } catch (e) {
        console.error('Error parsing professor data:', e);
      }
    } else {
      // Check localStorage
      const savedProfessor = localStorage.getItem('selectedProfessor');
      if (savedProfessor) {
        try {
          setProfessor(JSON.parse(savedProfessor));
        } catch (e) {
          console.error('Error parsing saved professor data:', e);
        }
      }
    }

    if (inputParam) {
      setStudentInput(inputParam);
    } else {
      const savedInput = localStorage.getItem('studentInput');
      if (savedInput) {
        setStudentInput(savedInput);
      }
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const professorData = professor || mockProfessor;
      const res = await fetch('http://localhost:8000/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_input: studentInput,
          professor: professorData
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

  const handleCopy = async () => {
    if (generatedEmail) {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentProfessor = professor || mockProfessor;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">ProfPilot</h1>
            </Link>
            <div className="flex space-x-4">
              <Link href="/match" className="text-gray-600 hover:text-gray-900">Find Matches</Link>
              <Link href="/generate" className="text-blue-600 font-medium">Generate Email</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Cold Email</h1>
          <p className="text-gray-600">Create a personalized email to connect with your selected professor</p>
        </div>

        {/* Professor Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Target Professor</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900">{currentProfessor.name}</h3>
            <p className="text-sm text-blue-700 mb-2">{currentProfessor.department}</p>
            <p className="text-sm text-blue-800">{currentProfessor.bio}</p>
            {professor?.similarity && (
              <p className="text-sm text-blue-600 mt-2">
                Match Score: {(professor.similarity * 100).toFixed(1)}%
              </p>
            )}
          </div>
          {!professor && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Using mock professor data - <Link href="/match" className="text-blue-600 hover:underline">find your matches first</Link></span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Research Background</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="student-input" className="block text-sm font-medium text-gray-700 mb-2">
                Research Interests & Background
              </label>
              <textarea
                id="student-input"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="Describe your research interests, background, goals, and why you're interested in working with this professor..."
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !studentInput.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Email...
                </div>
              ) : (
                'Generate Personalized Email'
              )}
            </button>
          </div>
        </div>

        {/* Generated Email */}
        {generatedEmail && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Generated Email</h2>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {generatedEmail}
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium"
              >
                Generate Another Version
              </button>
              <Link
                href="/match"
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-center font-medium"
              >
                Try Different Professor
              </Link>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Email Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Always personalize the subject line with the professor&apos;s name and your specific research interest</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Keep your email concise but detailed enough to show genuine interest</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Include your CV or research statement as an attachment</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Be patient - professors receive many emails and may take time to respond</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>}>
      <GeneratePageContent />
    </Suspense>
  );
}