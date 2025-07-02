'use client';

import { useState } from 'react';

type Professor = {
  name: string;
  department: string;
  bio: string;
  similarity: number;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [matches, setMatches] = useState<Professor[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMatches(null);

    try {
      const response = await fetch('http://localhost:8000/match', {
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

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Find Your Research Match</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          className="border p-3 rounded h-40 resize-none"
          placeholder="Paste your research interests or resume here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Matching...' : 'Find Matches'}
        </button>
      </form>

      {matches && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Top 3 Matches</h2>
          {matches.slice(0, 3).map((prof, index) => (
            <div key={index} className="border rounded p-4">
              <h3 className="text-lg font-bold">{prof.name}</h3>
              <p className="text-sm text-gray-600">{prof.department}</p>
              <p className="mt-2">{prof.bio}</p>
              <p className="mt-1 text-sm text-gray-500">Match Score: {prof.similarity.toFixed(4)}</p>
            </div>
          ))}

          {matches.length > 3 && (
            <>
              <h2 className="text-xl font-semibold mt-8">Additional Matches</h2>
              {matches.slice(3).map((prof, index) => (
                <div key={index + 3} className="border rounded p-4">
                  <h3 className="text-lg font-bold">{prof.name}</h3>
                  <p className="text-sm text-gray-600">{prof.department}</p>
                  <p className="mt-2">{prof.bio}</p>
                  <p className="mt-1 text-sm text-gray-500">Match Score: {prof.similarity.toFixed(4)}</p>
                </div>
              ))}
            </>
          )}
        </section>
      )}
    </main>
  );
}
