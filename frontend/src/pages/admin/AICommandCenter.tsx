import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Users, Target, Brain, Play, Download, ChevronRight, Plus, X, AlertTriangle, Eye, Activity, Zap, Shield } from 'lucide-react';
import { useAdminSearch } from '@/components/admin/AdminShell';
import axios from 'axios';

interface AgentExecution {
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  confidence?: number;
  error?: string;
}

interface AgentRun {
  id: string;
  runType: string;
  status: 'running' | 'completed' | 'failed' | 'awaiting_approval';
  startTime: string;
  endTime?: string;
  duration?: number;
  opportunitiesGenerated: number;
  campaignsCreated: number;
  executions?: AgentExecution[];
  additionalData?: any;
  approvedBy?: string;
  approvedAt?: string;
}

interface AgentDecision {
  id: string;
  decisionType: string;
  decisionData: any;
  status: string;
  priority: number;
  reasoning: string;
  confidence: number;
  approvedBy?: string;
  approvedAt?: string;
}

interface LLMStatus {
  status: string;
  modelLoaded: boolean;
  modelName?: string;
  device: string;
}

const AICommandCenter: React.FC = () => {
  const { searchQuery } = useAdminSearch();
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentLoading, setAgentLoading] = useState(false);
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);
  const [autonomyLevel, setAutonomyLevel] = useState<'recommend' | 'require_approval' | 'auto_execute'>('require_approval');
  const [llmStatus, setLLMStatus] = useState<LLMStatus | null>(null);

  useEffect(() => {
    loadAgentRuns();
    loadLLMStatus();
  }, []);

  const loadLLMStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/health');
      setLLMStatus(response.data);
    } catch (error) {
      console.log('LLM service not available:', error);
      setLLMStatus({
        status: 'unhealthy',
        modelLoaded: false,
        device: 'unknown'
      });
    }
  };

  const loadAgentRuns = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/commerce-agent/runs?limit=10');
      setAgentRuns(response.data.data.runs || []);
    } catch (error) {
      console.error('Failed to load agent runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgent = async () => {
    setAgentLoading(true);
    try {
      const response = await axios.post('/api/commerce-agent/run', {
        autonomyLevel,
      });
      
      // Reload agent runs after execution
      await loadAgentRuns();
      
      // Show the latest run
      if (response.data.data && response.data.data.runId) {
        const runDetails = await axios.get(`/api/commerce-agent/runs/${response.data.data.runId}`);
        setSelectedRun(runDetails.data.data.run);
      }
    } catch (error) {
      console.error('Agent run failed:', error);
    } finally {
      setAgentLoading(false);
    }
  };

  const handleApproveDecisions = async (runId: string) => {
    try {
      await axios.post(`/api/commerce-agent/runs/${runId}/approve`);
      await loadAgentRuns();
      if (selectedRun?.id === runId) {
        const runDetails = await axios.get(`/api/commerce-agent/runs/${runId}`);
        setSelectedRun(runDetails.data.data.run);
      }
    } catch (error) {
      console.error('Failed to approve decisions:', error);
    }
  };

  const handleViewRun = async (runId: string) => {
    try {
      const response = await axios.get(`/api/commerce-agent/runs/${runId}`);
      setSelectedRun(response.data.data.run);
    } catch (error) {
      console.error('Failed to load run details:', error);
    }
  };

  const filteredRuns = useMemo(() => {
    if (!searchQuery) return agentRuns;
    return agentRuns.filter(run => 
      run.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.runType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agentRuns, searchQuery]);

  const getAgentIcon = (agentName: string) => {
    const icons: Record<string, any> = {
      ObserveAgent: Eye,
      ReasoningAgent: Brain,
      PredictionAgent: TrendingUp,
      DecisionAgent: Target,
      ActionAgent: Zap,
      LearningAgent: Activity,
    };
    return icons[agentName] || Brain;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      awaiting_approval: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      running: Activity,
      completed: CheckCircle,
      failed: AlertCircle,
      awaiting_approval: Shield,
    };
    return icons[status] || Clock;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agentic Commerce Command Center
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor and control the Agentic AI workflow for regional commerce intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={autonomyLevel}
            onChange={(e) => setAutonomyLevel(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="recommend">Recommend Only</option>
            <option value="require_approval">Require Approval</option>
            <option value="auto_execute">Auto Execute</option>
          </select>
          <button
            onClick={handleRunAgent}
            disabled={agentLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {agentLoading ? 'Running Agents...' : 'Run Agents'}
          </button>
        </div>
      </div>

      {/* LLM Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          VendSway LLM Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${llmStatus?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {llmStatus?.status === 'healthy' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Model Loaded</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {llmStatus?.modelLoaded ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Model Name</p>
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {llmStatus?.modelName || 'Not configured'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Device</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {llmStatus?.device || 'Unknown'}
            </p>
          </div>
        </div>
        {!llmStatus?.modelLoaded && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> LLM is not currently loaded. Agents will use deterministic reasoning only. 
              Start the AI service to enable LLM-enhanced reasoning and explanations.
            </p>
          </div>
        )}
      </div>

      {/* Agent Workflow Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Agentic AI Workflow
        </h2>
        <div className="flex items-center justify-between overflow-x-auto py-4">
          {['Observe Agent', 'Reasoning Agent', 'Prediction Agent', 'Decision Agent', 'Action Agent', 'Learning Agent'].map((agent, index) => {
            const AgentIcon = getAgentIcon(agent);
            return (
              <React.Fragment key={agent}>
                <div className="flex flex-col items-center min-w-[120px]">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedRun?.executions?.find(e => e.agentName === agent.replace(' ', ''))?.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-600'}`}>
                    <AgentIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {agent}
                  </span>
                </div>
                {index < 5 && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Agent Runs History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Agent Execution History
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Loading agent runs...
          </div>
        ) : filteredRuns.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No agent runs yet. Click "Run Agents" to start the Agentic AI workflow.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRuns.map((run) => (
              <div
                key={run.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => handleViewRun(run.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(run.status)}`}>
                      {getStatusIcon(run.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {run.runType}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(run.startTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {run.opportunitiesGenerated}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">Opportunities</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {run.campaignsCreated}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">Campaigns</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(run.status)}`}>
                      {run.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Run Details */}
      {selectedRun && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agent Execution Details
            </h2>
            <button
              onClick={() => setSelectedRun(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Run Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedRun.opportunitiesGenerated}
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">Opportunities</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {selectedRun.campaignsCreated}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Campaigns</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedRun.executions?.length || 0}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Agents Executed</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {selectedRun.duration ? `${(selectedRun.duration / 1000).toFixed(1)}s` : 'N/A'}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Duration</div>
              </div>
            </div>

            {/* Agent Executions */}
            {selectedRun.executions && selectedRun.executions.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                  Agent Execution Timeline
                </h3>
                <div className="space-y-3">
                  {selectedRun.executions.map((execution, index) => {
                    const AgentIcon = getAgentIcon(execution.agentName);
                    return (
                      <div
                        key={execution.agentName}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(execution.status)}`}>
                          <AgentIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {execution.agentName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {execution.duration ? `${execution.duration}ms` : 'N/A'}
                            </div>
                          </div>
                          {execution.confidence && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Confidence: {(execution.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                          {execution.error && (
                            <div className="text-sm text-red-600 dark:text-red-400">
                              Error: {execution.error}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Approval Section */}
            {selectedRun.status === 'awaiting_approval' && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                    Human Approval Required
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  High-impact decisions require your approval before execution.
                </p>
                <button
                  onClick={() => handleApproveDecisions(selectedRun.id)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Approve & Execute
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICommandCenter;