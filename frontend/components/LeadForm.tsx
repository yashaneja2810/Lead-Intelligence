'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import WorkflowTracker from './WorkflowTracker';
import { submitLeadWithStatus, type LeadFormData, type WorkflowStatus } from '@/lib/api';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Brain,
  ShieldCheck,
  Search,
  FileText,
  Mail,
  Database,
} from 'lucide-react';

const industries = [
  'SaaS',
  'E-commerce',
  'Consulting',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Marketing Agency',
  'Technology',
  'Other',
];

const initialFormData: LeadFormData = {
  name: '',
  email: '',
  companyName: '',
  websiteUrl: '',
  industry: '',
  additionalNotes: '',
  aiProvider: 'groq',
};

export default function LeadForm() {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowStatuses, setWorkflowStatuses] = useState<WorkflowStatus[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setIsComplete(false);
    setWorkflowStatuses([]);
    setFormData(initialFormData);
  };

  const getErrorMessage = (value: unknown) => {
    if (value instanceof Error) {
      return value.message;
    }

    if (typeof value === 'string') {
      return value;
    }

    return 'An error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setWorkflowStatuses([]);
    setIsComplete(false);
    setError(null);

    try {
      await submitLeadWithStatus(formData, (status) => {
        setWorkflowStatuses((prev) => {
          const existing = prev.findIndex((item) => item.step === status.step);

          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = status;
            return updated;
          }

          return [...prev, status];
        });

        if (status.step === 'completed') {
          setIsComplete(true);
          setIsSubmitting(false);
        }

        if (status.step === 'error') {
          setError(status.message);
          setIsSubmitting(false);
        }
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="form" className="border-t border-slate-200 bg-[#f4f7fb] py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            Controlled automation
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Request a fully automated audit package.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The platform validates the lead, enriches the company, generates the report, archives the PDF, logs the lead, and emails the result in one continuous flow.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6 flex flex-col justify-start">
            <WorkflowTracker statuses={workflowStatuses} companyName={formData.companyName} isLive={isSubmitting} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)]"
          >
            <AnimatePresence mode="wait">
              {!isSubmitting && !isComplete && !error && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 p-7 md:p-8"
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-slate-700">Full name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="mt-2 h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-slate-700">Work email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="mt-2 h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <Label htmlFor="companyName" className="text-slate-700">Company name *</Label>
                      <Input
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Acme Inc."
                        className="mt-2 h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="industry" className="text-slate-700">Industry *</Label>
                      <select
                        id="industry"
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="mt-2 flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                      >
                        <option value="">Select industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="websiteUrl" className="text-slate-700">Website URL *</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      required
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="mt-2 h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalNotes" className="text-slate-700">Additional context</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Any priorities, audience nuances, or positioning details we should reflect?"
                      className="mt-2 min-h-[120px] border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500"
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full rounded-xl bg-sky-600 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500"
                  >
                    <Brain className="mr-2 h-4.5 w-4.5" />
                    Generate report
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    The workflow runs without human intervention and the PDF/email output remains unchanged.
                  </p>
                </motion.form>
              )}

              {isSubmitting && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6 p-7 md:p-8"
                >
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-600">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Workflow in progress</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      The backend is processing {formData.companyName || 'the submission'} step by step. Live updates appear on the left as each stage completes.
                    </p>
                  </div>
                </motion.div>
              )}

              {isComplete && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-7 md:p-8"
                >
                  <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Report delivered</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Check your inbox at <span className="font-semibold text-slate-900">{formData.email}</span> for the generated audit.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      The PDF was generated, the email was sent, and the workflow completed with no manual touchpoint.
                    </p>
                    <Button
                      onClick={resetForm}
                      size="lg"
                      className="mt-6 h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Submit another request
                    </Button>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-7 md:p-8"
                >
                  <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-600">
                      <XCircle className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Workflow interrupted</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>
                    <Button
                      onClick={() => {
                        setError(null);
                        setWorkflowStatuses([]);
                      }}
                      size="lg"
                      variant="outline"
                      className="mt-6 h-11 rounded-xl border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Try again
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Database className="h-4 w-4 text-sky-600" />
            Operational overview
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Built for sales teams that need a premium first touch.
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The workflow is structured to feel like a real internal operations tool, with clear progress, credible system language, and an output that looks ready for a client-facing handoff.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: 'Public research', text: 'Website and contextual scraping' },
              { icon: FileText, title: 'Polished report', text: 'Executive PDF with recommendations' },
              { icon: Mail, title: 'Automatic email', text: 'Direct delivery to the prospect' },
              { icon: Database, title: 'Internal logging', text: 'Sheets and Drive archive support' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
