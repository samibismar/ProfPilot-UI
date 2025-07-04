'use client';

import { useState } from 'react';
import Link from 'next/link';

type Professor = {
  name: string;
  department: string;
  bio: string;
  similarity: number;
};

export default function MatchPage() {
  const [input, setInput] = useState('');
  const [matches, setMatches] = useState<Professor[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMatches(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_input: input }),
      });

      const data = await response.json();
      setMatches(data.top_matches);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfessor = (professor: Professor) => {
    setSelectedProfessor(professor);
    localStorage.setItem('selectedProfessor', JSON.stringify(professor));
    localStorage.setItem('studentInput', input);
  };

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
              <Link href="/match" className="text-blue-600 font-medium">Find Matches</Link>
              <Link href="/generate" className="text-gray-600 hover:text-gray-900">Generate Email</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Research Match</h1>
          <p className="text-gray-600">Share your research interests and we&apos;ll find professors who align with your work</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="research-input" className="block text-sm font-medium text-gray-700 mb-2">
                Research Interests & Background
              </label>
              <textarea
                id="research-input"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="Describe your research interests, background, goals, and what you're looking for in a research mentor. Be specific about your field, techniques, and areas of focus..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding Matches...
                </div>
              ) : (
                'Find Professor Matches'
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {matches && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Matches</h2>
              <span className="text-sm text-gray-500">{matches.length} professors found</span>
            </div>

            {/* Top 3 Matches */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Matches</h3>
              {matches.slice(0, 3).map((prof, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{prof.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500">Match Score:</span>
                          <span className="text-sm font-semibold text-blue-600">{(prof.similarity * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{prof.department}</p>
                      <p className="text-gray-700 leading-relaxed">{prof.bio}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleSelectProfessor(prof)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                      Select This Professor
                    </button>
                    <Link
                      href={`/generate?professor=${encodeURIComponent(JSON.stringify(prof))}&input=${encodeURIComponent(input)}`}
                      className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
                    >
                      Generate Email
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Matches */}
            {matches.length > 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Matches</h3>
                {matches.slice(3).map((prof, index) => (
                  <div key={index + 3} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{prof.name}</h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500">Match Score:</span>
                            <span className="text-sm font-semibold text-blue-600">{(prof.similarity * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{prof.department}</p>
                        <p className="text-gray-700 leading-relaxed">{prof.bio}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleSelectProfessor(prof)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        Select This Professor
                      </button>
                      <Link
                        href={`/generate?professor=${encodeURIComponent(JSON.stringify(prof))}&input=${encodeURIComponent(input)}`}
                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
                      >
                        Generate Email
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Professor Confirmation */}
        {selectedProfessor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professor Selected!</h3>
              <p className="text-gray-600 mb-4">
                You&apos;ve selected <strong>{selectedProfessor.name}</strong>. Ready to generate a personalized email?
              </p>
              <div className="flex space-x-3">
                <Link
                  href="/generate"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center font-medium"
                >
                  Generate Email
                </Link>
                <button
                  onClick={() => setSelectedProfessor(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Keep Looking
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}