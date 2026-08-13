// ============================================================================
// RULE ENGINE
// ============================================================================
// Determines actions based on configurable rules

import { Rule, RuleCondition } from './types';

class RuleEngine {
  private rules: Rule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default business rules
   */
  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'festival_inventory_rule',
        name: 'Festival Inventory Rule',
        conditions: [
          { field: 'daysUntilFestival', operator: 'lte', value: 15 },
          { field: 'demandScore', operator: 'gt', value: 80 },
        ],
        actions: ['increase_inventory', 'create_campaign', 'notify_sellers'],
        priority: 90,
        category: 'INVENTORY',
      },
      {
        id: 'low_stock_rule',
        name: 'Low Stock Rule',
        conditions: [
          { field: 'stockLevel', operator: 'lt', value: 20 },
          { field: 'demandScore', operator: 'gt', value: 60 },
        ],
        actions: ['restock_alert', 'pause_marketing'],
        priority: 85,
        category: 'INVENTORY',
      },
      {
        id: 'visibility_improvement_rule',
        name: 'Visibility Improvement Rule',
        conditions: [
          { field: 'visibilityScore', operator: 'lt', value: 60 },
          { field: 'productCompleteness', operator: 'lt', value: 80 },
        ],
        actions: ['improve_images', 'improve_title', 'add_keywords'],
        priority: 70,
        category: 'VISIBILITY',
      },
      {
        id: 'high_demand_rule',
        name: 'High Demand Rule',
        conditions: [
          { field: 'demandScore', operator: 'gt', value: 85 },
          { field: 'competitionScore', operator: 'gt', value: 70 },
        ],
        actions: ['increase_prices', 'expand_inventory', 'target_sellers'],
        priority: 80,
        category: 'PRICING',
      },
      {
        id: 'new_seller_onboarding_rule',
        name: 'New Seller Onboarding Rule',
        conditions: [
          { field: 'catalogGap', operator: 'gt', value: 100 },
          { field: 'sellerCount', operator: 'lt', value: 5 },
        ],
        actions: ['onboard_sellers', 'gi_certification_priority', 'regional_campaign'],
        priority: 75,
        category: 'ONBOARDING',
      },
      {
        id: 'overstock_rule',
        name: 'Overstock Rule',
        conditions: [
          { field: 'stockLevel', operator: 'gt', value: 200 },
          { field: 'demandScore', operator: 'lt', value: 40 },
        ],
        actions: ['discount_prices', 'clearance_campaign', 'pause_restock'],
        priority: 65,
        category: 'INVENTORY',
      },
      {
        id: 'festival_campaign_rule',
        name: 'Festival Campaign Rule',
        conditions: [
          { field: 'daysUntilFestival', operator: 'lte', value: 30 },
          { field: 'daysUntilFestival', operator: 'gte', value: 7 },
        ],
        actions: ['create_festival_campaign', 'generate_marketing', 'notify_sellers'],
        priority: 88,
        category: 'MARKETING',
      },
      {
        id: 'seller_performance_rule',
        name: 'Seller Performance Rule',
        conditions: [
          { field: 'conversionRate', operator: 'lt', value: 3 },
          { field: 'missionCount', operator: 'gt', value: 5 },
        ],
        actions: ['send_training', 'improve_product_quality', 'target_audience_review'],
        priority: 60,
        category: 'SELLER',
      },
    ];
  }

  /**
   * Evaluate rules against context data
   */
  evaluateRules(context: Record<string, any>): Rule[] {
    const matchedRules: Rule[] = [];

    for (const rule of this.rules) {
      if (this.evaluateRule(rule, context)) {
        matchedRules.push(rule);
      }
    }

    // Sort by priority (highest first)
    return matchedRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Evaluate a single rule
   */
  private evaluateRule(rule: Rule, context: Record<string, any>): boolean {
    for (const condition of rule.conditions) {
      if (!this.evaluateCondition(condition, context)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: RuleCondition, context: Record<string, any>): boolean {
    const fieldValue = context[condition.field];
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'eq':
        return fieldValue === conditionValue;
      case 'ne':
        return fieldValue !== conditionValue;
      case 'gt':
        return fieldValue > conditionValue;
      case 'gte':
        return fieldValue >= conditionValue;
      case 'lt':
        return fieldValue < conditionValue;
      case 'lte':
        return fieldValue <= conditionValue;
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(conditionValue);
      default:
        return false;
    }
  }

  /**
   * Add a new rule
   */
  addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  /**
   * Remove a rule by ID
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  /**
   * Get rules by category
   */
  getRulesByCategory(category: string): Rule[] {
    return this.rules.filter(rule => rule.category === category);
  }

  /**
   * Get all rules
   */
  getAllRules(): Rule[] {
    return [...this.rules];
  }

  /**
   * Execute matched rules and return actions
   */
  executeRules(context: Record<string, any>): string[] {
    const matchedRules = this.evaluateRules(context);
    const actions: string[] = [];

    matchedRules.forEach(rule => {
      actions.push(...rule.actions);
    });

    // Remove duplicates while preserving order
    return [...new Set(actions)];
  }
}

export default new RuleEngine();