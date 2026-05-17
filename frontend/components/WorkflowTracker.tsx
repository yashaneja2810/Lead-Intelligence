'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  AlertTriangle,
  Workflow,
} from 'lucide-react';
import type { WorkflowStatus } from '@/lib/api';

export const workflowSteps = [
  {
    key: 'validation',
    title: 'Validation',
    description: 'Checks the submitted contact and company details for completeness.',
  },
  {
    key: 'scraping',
    title: 'Research',
    description: 'Analyzes the company website and public signals for context.',
  },
  {
    key: 'ai-analysis',
    title: 'AI analysis',
    description: 'Generates insights, recommendations, and executive framing.',
  },
  {
    key: 'pdf-generation',
    title: 'Report generation',
    description: 'Builds the professional PDF audit for the prospect.',
  },
  {
    key: 'drive-upload',
    title: 'Archival upload',
    description: 'Saves a copy to Google Drive when configured.',
  },
  {
    key: 'sheets-logging',
    title: 'Lead logging',
    description: 'Appends the lead record to Sheets when configured.',
  },
  {
    key: 'email-delivery',
    title: 'Email delivery',
    description: 'Sends the report to the prospect with the final handoff.',
  },
] as const;

type WorkflowTrackerProps = {
  statuses: WorkflowStatus[];
  companyName: string;
  isLive: boolean;
};

function getStatus(stepKey: string, statuses: WorkflowStatus[]) {
  return statuses.find((status) => status.step === stepKey);
}

function getStatusIcon(status: WorkflowStatus | undefined) {
  if (status?.status === 'completed') {
    return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  }

  if (status?.status === 'in-progress') {
    return <Loader2 className="h-5 w-5 animate-spin text-sky-600" />;
  }

  if (status?.status === 'failed') {
    return <AlertTriangle className="h-5 w-5 text-rose-600" />;
  }

  return <Circle className="h-5 w-5 text-slate-300" />;
}

export default function WorkflowTracker({ statuses, companyName, isLive }: WorkflowTrackerProps) {
  const completedSteps = workflowSteps.filter((step) => getStatus(step.key, statuses)?.status === 'completed').length;
  const activeStep = statuses.find((status) => status.status === 'in-progress');
  const failedStep = statuses.find((status) => status.status === 'failed');
  const progress = Math.round((completedSteps / workflowSteps.length) * 100);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          <Workflow className="h-4 w-4 text-sky-600" />
          Live workflow tracking
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {companyName ? `Processing ${companyName}` : 'Waiting for a submission'}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              The tracker mirrors the backend workflow and updates as each operational stage completes.
            </p>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${isLive ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600'}`}>
            {isLive ? 'Streaming live' : 'Idle'}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Completed
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">{completedSteps}/{workflowSteps.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Clock3 className="h-4 w-4 text-sky-600" />
              Current stage
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-950">
              {failedStep?.message || activeStep?.message || 'Awaiting workflow start'}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <ArrowRight className="h-4 w-4 text-slate-500" />
              Progress
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">{progress}%</div>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-slate-700"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="space-y-3 px-6 py-5">
        {workflowSteps.map((step, index) => {
          const status = getStatus(step.key, statuses);
          const isPending = !status;
          const tone = status?.status === 'completed'
            ? 'border-emerald-200 bg-emerald-50/70'
            : status?.status === 'in-progress'
              ? 'border-sky-200 bg-sky-50/70'
              : status?.status === 'failed'
                ? 'border-rose-200 bg-rose-50/70'
                : 'border-slate-200 bg-white';

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border p-4 transition ${tone}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                  {getStatusIcon(status)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-950">{step.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {status?.status || 'pending'}
                    </div>
                  </div>
                  {(status?.message || isPending) && (
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {status?.message || 'Waiting in the queue.'}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}