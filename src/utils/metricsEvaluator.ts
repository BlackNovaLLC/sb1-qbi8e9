import { Metrics } from '../types';

interface ThresholdConfig {
  ctr: number;
  conversionRate: number;
  roas: number;
}

const DEFAULT_THRESHOLDS: ThresholdConfig = {
  ctr: 2.0, // 2% CTR threshold
  conversionRate: 1.0, // 1% conversion rate threshold
  roas: 1.5, // 1.5x ROAS threshold
};

export const evaluateMetrics = (
  metrics: Metrics,
  thresholds: ThresholdConfig = DEFAULT_THRESHOLDS
): 'WINNING' | 'NEEDS_IMPROVEMENT' => {
  // Check if metrics meet all thresholds
  const isWinning =
    metrics.ctr >= thresholds.ctr &&
    metrics.conversionRate >= thresholds.conversionRate &&
    metrics.roas >= thresholds.roas;

  return isWinning ? 'WINNING' : 'NEEDS_IMPROVEMENT';
};