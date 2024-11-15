import { Card, Column, TeamMember, Metrics } from '../types';
import { format } from 'date-fns';

interface PhaseReport {
  phaseNumber: number;
  phaseTitle: string;
  generatedAt: string;
  summary: {
    totalCards: number;
    completedCards: number;
    winningCards: number;
  };
  metrics: {
    averageCTR: number;
    averageConversionRate: number;
    averageROAS: number;
    topPerformer: {
      cardId: string;
      title: string;
      metrics: Metrics;
    } | null;
  };
  variants: {
    [key: string]: {
      count: number;
      averageMetrics: Partial<Metrics>;
      bestPerformer: Card | null;
    };
  };
  winningCards: Card[];
  teamContributions: {
    memberId: string;
    name: string;
    tasksCompleted: number;
    cardsOwned: number;
  }[];
}

export const generatePhaseReport = (
  column: Column,
  nextPhaseCards: Card[],
  teamMembers: TeamMember[]
): PhaseReport => {
  const { cards, phase, title } = column;
  
  // Calculate basic statistics
  const completedCards = cards.filter(card => 
    card.subtasks.every(subtask => subtask.completed)
  );
  
  const winningCards = cards.filter(card => card.status === 'WINNING');

  // Calculate metrics
  const cardsWithMetrics = cards.filter(card => card.metrics);
  const averageMetrics = cardsWithMetrics.reduce(
    (acc, card) => {
      if (!card.metrics) return acc;
      return {
        ctr: acc.ctr + (card.metrics.ctr || 0),
        conversionRate: acc.conversionRate + (card.metrics.conversionRate || 0),
        roas: acc.roas + (card.metrics.roas || 0),
      };
    },
    { ctr: 0, conversionRate: 0, roas: 0 }
  );

  const cardCount = cardsWithMetrics.length;
  const normalizedMetrics = {
    ctr: cardCount > 0 ? averageMetrics.ctr / cardCount : 0,
    conversionRate: cardCount > 0 ? averageMetrics.conversionRate / cardCount : 0,
    roas: cardCount > 0 ? averageMetrics.roas / cardCount : 0,
  };

  // Find top performer
  const topPerformer = cardsWithMetrics.reduce(
    (best, current) => {
      if (!current.metrics || !best) return best;
      if (!best.metrics) return current;
      return current.metrics.roas > best.metrics.roas ? current : best;
    },
    cardsWithMetrics[0]
  );

  // Analyze variants
  const variants: PhaseReport['variants'] = {};
  cards.forEach(card => {
    if (!card.variantId) return;
    
    if (!variants[card.variantId]) {
      variants[card.variantId] = {
        count: 0,
        averageMetrics: {},
        bestPerformer: null
      };
    }
    
    const variant = variants[card.variantId];
    variant.count++;
    
    if (card.metrics) {
      variant.averageMetrics = {
        ctr: (variant.averageMetrics.ctr || 0) + (card.metrics.ctr || 0),
        conversionRate: (variant.averageMetrics.conversionRate || 0) + (card.metrics.conversionRate || 0),
        roas: (variant.averageMetrics.roas || 0) + (card.metrics.roas || 0),
      };
      
      if (!variant.bestPerformer || 
          (card.metrics.roas > (variant.bestPerformer.metrics?.roas || 0))) {
        variant.bestPerformer = card;
      }
    }
  });

  // Normalize variant metrics
  Object.values(variants).forEach(variant => {
    if (variant.count > 0) {
      variant.averageMetrics = {
        ctr: (variant.averageMetrics.ctr || 0) / variant.count,
        conversionRate: (variant.averageMetrics.conversionRate || 0) / variant.count,
        roas: (variant.averageMetrics.roas || 0) / variant.count,
      };
    }
  });

  // Calculate team contributions
  const teamContributions = teamMembers.map(member => {
    const memberCards = cards.filter(card => 
      card.assignedTo.some(assigned => assigned.id === member.id)
    );
    
    const completedTasks = cards.reduce((sum, card) => {
      return sum + card.subtasks.filter(task => 
        task.assignedTo.id === member.id && task.completed
      ).length;
    }, 0);

    return {
      memberId: member.id,
      name: member.name,
      tasksCompleted: completedTasks,
      cardsOwned: memberCards.length
    };
  });

  return {
    phaseNumber: phase,
    phaseTitle: title,
    generatedAt: new Date().toISOString(),
    summary: {
      totalCards: cards.length,
      completedCards: completedCards.length,
      winningCards: winningCards.length
    },
    metrics: {
      averageCTR: normalizedMetrics.ctr,
      averageConversionRate: normalizedMetrics.conversionRate,
      averageROAS: normalizedMetrics.roas,
      topPerformer: topPerformer ? {
        cardId: topPerformer.id,
        title: topPerformer.title,
        metrics: topPerformer.metrics!
      } : null
    },
    variants,
    winningCards,
    teamContributions
  };
};