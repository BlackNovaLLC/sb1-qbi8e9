import React from 'react';
import { Board } from './components/Board';
import { Dashboard } from './components/Dashboard';
import { CardModal } from './components/CardModal';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
        <CardModal />
      </div>
    </ErrorBoundary>
  );
}

export default App;