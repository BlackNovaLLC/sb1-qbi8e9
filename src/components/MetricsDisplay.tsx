import React from 'react';
import { Metrics } from '../types';
import { format } from 'date-fns';

interface MetricsDisplayProps {
  metrics: Metrics;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  metrics,
  onEdit,
  showEditButton = false,
}) => {
  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${formatNumber(value)}%`;
  };

  const MetricCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className={`${color} p-4 rounded-lg`}>
      <div className="text-sm font-medium mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
        {showEditButton && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit Metrics
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="CTR"
          value={formatPercentage(metrics.ctr)}
          color="bg-blue-50 text-blue-700"
        />
        <MetricCard
          label="Conversion Rate"
          value={formatPercentage(metrics.conversionRate)}
          color="bg-green-50 text-green-700"
        />
        <MetricCard
          label="ROAS"
          value={formatNumber(metrics.roas, 2) + 'x'}
          color="bg-purple-50 text-purple-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          label="Revenue"
          value={formatCurrency(metrics.revenue)}
          color="bg-emerald-50 text-emerald-700"
        />
        <MetricCard
          label="EPC"
          value={formatCurrency(metrics.epc)}
          color="bg-indigo-50 text-indigo-700"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Views"
          value={formatNumber(metrics.views, 0)}
          color="bg-gray-50 text-gray-700"
        />
        <MetricCard
          label="Clicks"
          value={formatNumber(metrics.clicks, 0)}
          color="bg-gray-50 text-gray-700"
        />
        <MetricCard
          label="Conversions"
          value={formatNumber(metrics.conversions, 0)}
          color="bg-gray-50 text-gray-700"
        />
      </div>

      <div className="text-sm text-gray-500 mt-4">
        Last updated by {metrics.updatedBy.name} on{' '}
        {format(new Date(metrics.updatedAt), 'MMM d, yyyy HH:mm')}
      </div>
    </div>
  );
};