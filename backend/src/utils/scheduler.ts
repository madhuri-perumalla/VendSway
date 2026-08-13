// ============================================================================
// SCHEDULER
// ============================================================================
// Automatic scheduling for AI Commerce Agent runs

import CommerceAgentService from '../services/CommerceAgentService';

class Scheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * Start the scheduler
   * @param intervalMs - Interval in milliseconds (default: 4 hours)
   */
  start(intervalMs: number = 4 * 60 * 60 * 1000) {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log(`Starting Commerce Agent Scheduler (interval: ${intervalMs}ms)`);
    this.isRunning = true;

    // Run immediately on start
    this.runAgent();

    // Schedule subsequent runs
    this.intervalId = setInterval(() => {
      this.runAgent();
    }, intervalMs);
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('Commerce Agent Scheduler stopped');
    }
  }

  /**
   * Run the agent
   */
  private async runAgent() {
    try {
      console.log('Running Commerce Agent...');
      const result = await CommerceAgentService.runAgent();
      console.log('Commerce Agent run completed:', result);
    } catch (error) {
      console.error('Error in scheduled agent run:', error);
    }
  }

  /**
   * Check if scheduler is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

export default new Scheduler();
