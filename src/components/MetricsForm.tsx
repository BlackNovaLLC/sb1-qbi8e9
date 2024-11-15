import React, { useState } from 'react';
import { Metrics, TeamMember } from '../types';
import { format } from 'date-fns';

interface MetricsFormProps {
  metrics?: Metrics;
  onSave: (metrics: Metrics) => void;
  currentUser: TeamMember;
}

export const MetricsForm: React.FC<MetricsFormProps> = ({
  metrics: initialMetrics,
  onSave,
  currentUser
}) => {
  const [metrics, setMetrics] = useState<Partial<Metrics>>({
    views: initialMetrics?.views || 0,
    clicks: initialMetrics?.clicks || 0,
    conversions: initialMetrics?.conversions || 0,
    revenue: initialMetrics?.revenue || 0,
    cost: initialMetrics?.cost || 0,
  });

  const calculateDerivedMetrics = (baseMetrics: Partial<Metrics>): Metrics => {
    const views = baseMetrics.views || 0;
    const clicks = baseMetrics.clicks || 0;
    const conversions = baseMetrics.conversions || 0;
    const revenue = baseMetrics.revenue || 0;
    const cost = baseMetrics.cost || 0;

    return {
      ...baseMetrics,
      views,
      clicks,
      ctr: views > 0 ? (clicks / views) * 100 : 0,
      conversions,
      conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
      revenue,
      epc: clicks > 0 ? revenue / clicks : 0,
      cost,
      roas: cost > 0 ? revenue / cost : 0,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser,
    } as Metrics;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeMetrics = calculateDerivedMetrics(metrics);
    onSave(completeMetrics);
  };

  const handleInputChange = (field: keyof Metrics, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const MetricInput = ({ field, label }: { field: keyof Metrics, label: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={metrics[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricInput field="views" label="Views" />
        <MetricInput field="clicks" label="Clicks" />
        <MetricInput field="conversions" label="Conversions" />
        <MetricInput field="revenue" label="Revenue ($)" />
        <MetricInput field="cost" label="Cost ($)" />
      </div>

      {initialMetrics && (
        <div className="text-sm text-gray-500">
          Last updated by {initialMetrics.updatedBy.name} on{' '}
          {format(new Date(initialMetrics.updatedAt), 'MMM d, yyyy HH:mm')}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Metrics
        </button>
      </div>
    </form>
  );
};