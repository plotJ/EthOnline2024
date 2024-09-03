import React from 'react';
import ResultsTable from '../components/ResultsTable';
import VotingComponent from '../components/VotingComponent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Election Results</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ResultsTable />
        </div>
      </div>
    </main>
  );
}