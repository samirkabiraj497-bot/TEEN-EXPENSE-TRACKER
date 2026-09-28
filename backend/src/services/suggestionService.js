/**
 * Smart Spending Suggestion Engine for TeenSpend
 * Generates transparent, actionable, data-driven suggestions and spending health indicators.
 * Architecture allows seamless extension with future AI models.
 */

class SuggestionEngine {
  /**
   * Main entry point to generate suggestions and spending health indicators
   * @param {Object} params
   * @param {Array} params.currentMonthExpenses - Expenses for current month
   * @param {Array} params.previousMonthExpenses - Expenses for previous month
   * @param {Array} params.budgets - Current month budgets
   * @returns {Object} suggestions list and health indicators
   */
  generateInsights({ currentMonthExpenses = [], previousMonthExpenses = [], budgets = [] }) {
    const totalSpentCurrent = currentMonthExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalSpentPrev = previousMonthExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Group expenses by category
    const categoryTotalsCurrent = this._groupCategoryTotals(currentMonthExpenses);
    const categoryTotalsPrev = this._groupCategoryTotals(previousMonthExpenses);

    const suggestions = [];

    // 1. Top Category Concentration Rule
    const sortedCategories = Object.entries(categoryTotalsCurrent).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0 && totalSpentCurrent > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const percentage = Math.round((topAmount / totalSpentCurrent) * 100);

      if (percentage >= 30) {
        const weeklyTarget = Math.round(topAmount / 4);
        suggestions.push({
          id: 'sug-top-category',
          type: 'category_concentration',
          category: topCategory,
          icon: this._getCategoryEmoji(topCategory),
          severity: percentage >= 50 ? 'warning' : 'info',
          title: `${topCategory} is your biggest spending category this month`,
          message: `You've spent ₹${topAmount.toLocaleString('en-IN')} on ${topCategory}, which accounts for ${percentage}% of your total spending.`,
          actionTip: `Consider setting a weekly ${topCategory.toLowerCase()} target of around ₹${weeklyTarget.toLocaleString('en-IN')} to balance your habits.`
        });
      }
    }

    // 2. Budget Alert Rules (Safe / Warning >= 80% / Exceeded > 100%)
    budgets.forEach(budget => {
      const catSpent = categoryTotalsCurrent[budget.category] || 0;
      const budgetAmount = Number(budget.amount);
      if (budgetAmount <= 0) return;

      const usageRatio = catSpent / budgetAmount;
      const usagePercent = Math.round(usageRatio * 100);

      if (catSpent > budgetAmount) {
        const overspent = catSpent - budgetAmount;
        suggestions.push({
          id: `sug-budget-exceeded-${budget.id}`,
          type: 'budget_exceeded',
          category: budget.category,
          icon: '🚨',
          severity: 'danger',
          title: `Your ${budget.category} budget has been exceeded!`,
          message: `You have spent ₹${catSpent.toLocaleString('en-IN')} against your allocated ₹${budgetAmount.toLocaleString('en-IN')} limit (exceeded by ₹${overspent.toLocaleString('en-IN')}).`,
          actionTip: `Try pausing non-essential ${budget.category.toLowerCase()} expenses for the remainder of the month.`
        });
      } else if (usagePercent >= 80) {
        const remaining = budgetAmount - catSpent;
        suggestions.push({
          id: `sug-budget-warning-${budget.id}`,
          type: 'budget_warning',
          category: budget.category,
          icon: '⚠️',
          severity: 'warning',
          title: `You've used ${usagePercent}% of your ${budget.category} budget`,
          message: `You have ₹${remaining.toLocaleString('en-IN')} left before reaching your ₹${budgetAmount.toLocaleString('en-IN')} limit.`,
          actionTip: `Pace your remaining spending over the next few days to stay comfortably in the safe zone.`
        });
      }
    });

    // 3. Month-over-Month Category Spike Rule
    for (const [category, currentAmount] of Object.entries(categoryTotalsCurrent)) {
      const prevAmount = categoryTotalsPrev[category] || 0;
      if (prevAmount > 0 && currentAmount > prevAmount * 1.35 && currentAmount > 500) {
        const difference = currentAmount - prevAmount;
        const percentIncrease = Math.round(((currentAmount - prevAmount) / prevAmount) * 100);
        suggestions.push({
          id: `sug-spike-${category}`,
          type: 'trend_increase',
          category,
          icon: this._getCategoryEmoji(category),
          severity: 'warning',
          title: `Your ${category} spending increased by ${percentIncrease}%`,
          message: `You spent ₹${currentAmount.toLocaleString('en-IN')} compared to ₹${prevAmount.toLocaleString('en-IN')} last month (+₹${difference.toLocaleString('en-IN')}).`,
          actionTip: `Take a quick moment to review if these extra expenses were one-off occasions or recurring habits.`
        });
      }
    }

    // 4. Subscriptions Audit Rule
    const subExpenses = currentMonthExpenses.filter(e => 
      e.category.toLowerCase() === 'subscriptions' || 
      /netflix|spotify|prime|youtube|discord|icloud|game pass/i.test(e.title)
    );
    if (subExpenses.length >= 2) {
      const subTotal = subExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      suggestions.push({
        id: 'sug-subscriptions-audit',
        type: 'subscription_audit',
        category: 'Subscriptions',
        icon: '📱',
        severity: 'info',
        title: `You spent money on ${subExpenses.length} recurring digital services`,
        message: `Total subscriptions spending is ₹${subTotal.toLocaleString('en-IN')} across services like ${subExpenses.map(s => s.title).slice(0, 3).join(', ')}.`,
        actionTip: 'Do a quick monthly audit: cancel or pause subscriptions you haven’t opened in the past 14 days.'
      });
    }

    // 5. Frequent Micro-Expenses Pattern Rule
    const smallExpenses = currentMonthExpenses.filter(e => Number(e.amount) <= 150);
    if (smallExpenses.length >= 6) {
      const smallTotal = smallExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      suggestions.push({
        id: 'sug-micro-transactions',
        type: 'micro_expenses',
        category: 'Habits',
        icon: '🪙',
        severity: 'info',
        title: `Small purchases added up to ₹${smallTotal.toLocaleString('en-IN')}`,
        message: `You made ${smallExpenses.length} individual small transactions under ₹150 each this month.`,
        actionTip: 'Small daily snacks or convenience purchases feel tiny, but tracking them daily keeps hundreds in your pocket.'
      });
    }

    // 6. Positive Reinforcement Rule
    if (totalSpentPrev > 0 && totalSpentCurrent < totalSpentPrev && currentMonthExpenses.length > 0) {
      const savedAmount = totalSpentPrev - totalSpentCurrent;
      suggestions.push({
        id: 'sug-savings-streak',
        type: 'positive_progress',
        category: 'General',
        icon: '🎉',
        severity: 'success',
        title: `Great job! Spending is lower than last month`,
        message: `You're currently spending ₹${savedAmount.toLocaleString('en-IN')} less than this same period last month.`,
        actionTip: 'Keep up the momentum! Consider moving a portion of the difference directly into a teen savings pot.'
      });
    }

    // Calculate Spending Health Indicators
    const healthIndicators = this._calculateHealthIndicators({
      totalSpentCurrent,
      budgets,
      categoryTotalsCurrent,
      currentMonthExpenses,
      previousMonthExpenses
    });

    return {
      suggestions,
      healthIndicators
    };
  }

  _calculateHealthIndicators({ totalSpentCurrent, budgets, categoryTotalsCurrent, currentMonthExpenses, previousMonthExpenses }) {
    // 1. Budget Usage
    const totalBudget = budgets.reduce((acc, b) => acc + Number(b.amount), 0);
    let budgetUsage = {
      score: 100,
      label: 'Optimal',
      status: 'safe',
      detail: totalBudget > 0 
        ? `${Math.round((totalSpentCurrent / totalBudget) * 100)}% of total budget used` 
        : 'No budgets configured yet'
    };

    if (totalBudget > 0) {
      const pct = (totalSpentCurrent / totalBudget) * 100;
      if (pct > 100) {
        budgetUsage = { score: 35, label: 'Exceeded', status: 'danger', detail: `${Math.round(pct)}% used - over limit` };
      } else if (pct >= 85) {
        budgetUsage = { score: 65, label: 'Near Limit', status: 'warning', detail: `${Math.round(pct)}% used - caution advised` };
      } else {
        budgetUsage = { score: 92, label: 'Within Limits', status: 'safe', detail: `${Math.round(pct)}% used - healthy pace` };
      }
    }

    // 2. Savings Potential
    let savingsPotential = {
      score: 80,
      label: 'Good',
      status: 'safe',
      detail: 'Healthy control observed across discretionary categories'
    };
    const nonEssentialCategories = ['Entertainment', 'Gaming', 'Shopping', 'Subscriptions'];
    const discretionarySpend = Object.entries(categoryTotalsCurrent)
      .filter(([cat]) => nonEssentialCategories.includes(cat))
      .reduce((sum, [, val]) => sum + val, 0);

    if (totalSpentCurrent > 0) {
      const discRatio = discretionarySpend / totalSpentCurrent;
      if (discRatio > 0.5) {
        savingsPotential = { score: 50, label: 'High Opportunity', status: 'warning', detail: `${Math.round(discRatio * 100)}% spent on non-essentials` };
      } else if (discRatio > 0.3) {
        savingsPotential = { score: 75, label: 'Moderate', status: 'safe', detail: `${Math.round(discRatio * 100)}% spent on non-essentials` };
      }
    }

    // 3. Spending Consistency
    const daysWithExpenses = new Set(currentMonthExpenses.map(e => e.expense_date)).size;
    const consistencyScore = daysWithExpenses > 15 ? 88 : daysWithExpenses > 7 ? 75 : 60;
    const consistency = {
      score: consistencyScore,
      label: consistencyScore >= 80 ? 'Steady' : 'Variable',
      status: consistencyScore >= 80 ? 'safe' : 'info',
      detail: `Activity spread across ${daysWithExpenses} tracked active days`
    };

    // 4. Category Concentration
    let concentration = {
      score: 85,
      label: 'Balanced',
      status: 'safe',
      detail: 'Expenses are nicely distributed across multiple categories'
    };
    const categoriesCount = Object.keys(categoryTotalsCurrent).length;
    if (categoriesCount === 1 && totalSpentCurrent > 0) {
      concentration = { score: 45, label: 'Heavy Concentration', status: 'warning', detail: '100% of spending sits in a single category' };
    } else if (categoriesCount >= 4) {
      concentration = { score: 90, label: 'Well Distributed', status: 'safe', detail: `Diversified across ${categoriesCount} distinct categories` };
    }

    return {
      budgetUsage,
      savingsPotential,
      consistency,
      concentration,
      disclaimer: 'These indicators are calculated directly from your logged transactions for educational guidance only.'
    };
  }

  _groupCategoryTotals(expenses) {
    return expenses.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Number(curr.amount);
      return acc;
    }, {});
  }

  _getCategoryEmoji(category) {
    const map = {
      'Food': '🍔',
      'Transport': '🚌',
      'Education': '📚',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Gaming': '🎮',
      'Subscriptions': '📱',
      'Mobile/Data': '📶',
      'Sports': '⚽',
      'Travel': '✈️',
      'Personal Care': '✨',
      'Gifts': '🎁',
      'Other': '💳'
    };
    return map[category] || '💡';
  }
}

module.exports = new SuggestionEngine();
