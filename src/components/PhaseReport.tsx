import React from 'react';
import { format } from 'date-fns';
import { Card, Column, TeamMember } from '../types';
import { generatePhaseReport } from '../utils/reportGenerator';
import { DocumentArrowDownIcon, ShareIcon } from '@heroicons/react/24/outline';

interface PhaseReportProps {
  column: Column;
  nextPhaseCards: Card[];
  teamMembers: TeamMember[];
  onClose: () => void;
}

export const PhaseReport: React.FC<PhaseReportProps> = ({
  column,
  nextPhaseCards,
  teamMembers,
  onClose
}) => {
  const report = generatePhaseReport(column, nextPhaseCards, teamMembers);

  const formatMetric = (value: number, type: 'percentage' | 'decimal' = 'decimal') => {
    return type === 'percentage'
      ? `${(value).toFixed(2)}%`
      : value.toFixed(2);
  };

  const downloadReport = () => {
    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phase-${report.phaseNumber}-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareReport = () => {
    // In a real implementation, this would integrate with your notification
    // or email system to share the report with team members
    console.log('Sharing report with team members...');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Phase {report.phaseNumber} Summary Report
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Generated on {format(new Date(report.generatedAt), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadReport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Download
              </button>
              <button
                onClick={shareReport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary Section */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {report.summary.totalCards}
                </div>
                <div className="text-sm text-gray-500">Total Cards</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {report.summary.completedCards}
                </div>
                <div className="text-sm text-gray-500">Completed Cards</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {report.summary.winningCards}
                </div>
                <div className="text-sm text-gray-500">Winning Cards</div>
              </div>
            </div>
          </section>

          {/* Metrics Section */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Average CTR</div>
                  <div className="text-xl font-semibold">
                    {formatMetric(report.metrics.averageCTR, 'percentage')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Average Conversion Rate</div>
                  <div className="text-xl font-semibold">
                    {formatMetric(report.metrics.averageConversionRate, 'percentage')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Average ROAS</div>
                  <div className="text-xl font-semibold">
                    {formatMetric(report.metrics.averageROAS)}x
                  </div>
                </div>
              </div>
              {report.metrics.topPerformer && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Top Performer
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                          {report.metrics.topPerformer.cardId}
                        </div>
                        <div className="font-medium mt-1">
                          {report.metrics.topPerformer.title}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        ROAS: {formatMetric(report.metrics.topPerformer.metrics.roas)}x
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Variant Analysis */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Variant Analysis</h3>
            <div className="space-y-4">
              {Object.entries(report.variants).map(([variantId, data]) => (
                <div key={variantId} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Variant {variantId}</h4>
                      <p className="text-sm text-gray-500">{data.count} iterations tested</p>
                    </div>
                    {data.bestPerformer && (
                      <div className="text-sm text-gray-500">
                        Best ROAS: {formatMetric(data.bestPerformer.metrics?.roas || 0)}x
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Avg. CTR</div>
                      <div className="font-medium">
                        {formatMetric(data.averageMetrics.ctr || 0, 'percentage')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avg. Conv. Rate</div>
                      <div className="font-medium">
                        {formatMetric(data.averageMetrics.conversionRate || 0, 'percentage')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avg. ROAS</div>
                      <div className="font-medium">
                        {formatMetric(data.averageMetrics.roas || 0)}x
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Contributions */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Team Contributions</h3>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cards Owned
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.teamContributions.map((contribution) => (
                    <tr key={contribution.memberId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {contribution.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contribution.tasksCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contribution.cardsOwned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};