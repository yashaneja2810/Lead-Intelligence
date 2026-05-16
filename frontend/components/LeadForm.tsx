'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { submitLeadWithStatus, type LeadFormData, type WorkflowStatus } from '@/lib/api';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Brain,
  Zap
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

const workflowSteps = [
  { key: 'validation', label: 'Validating' },
  { key: 'scraping', label: 'Analyzing Website' },
  { key: 'ai-analysis', label: 'AI Processing' },
  { key: 'pdf-generation', label: 'Creating Report' },
  { key: 'drive-upload', label: 'Archiving' },
  { key: 'sheets-logging', label: 'Logging Data' },
  { key: 'email-delivery', label: 'Sending Email' },
];

export default function LeadForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    companyName: '',
    websiteUrl: '',
    industry: '',
    additionalNotes: '',
    aiProvider: 'gemini',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowStatuses, setWorkflowStatuses] = useState<WorkflowStatus[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setWorkflowStatuses([]);
    setIsComplete(false);
    setError(null);

    try {
      await submitLeadWithStatus(formData, (status) => {
        setWorkflowStatuses((prev) => {
          const existing = prev.findIndex((s) => s.step === status.step);
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
        } else if (status.step === 'error') {
          setError(status.message);
          setIsSubmitting(false);
        }
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (stepKey: string) => {
    const status = workflowStatuses.find((s) => s.step === stepKey);
    return status?.status || 'pending';
  };

  const getStepMessage = (stepKey: string) => {
    const status = workflowStatuses.find((s) => s.step === stepKey);
    return status?.message || '';
  };

  return (
    <section id="form" className="py-24 bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your Free AI Audit
          </h2>
          <p className="text-xl text-gray-600">
            Submit your information and receive a comprehensive business analysis in minutes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
        >
          <AnimatePresence mode="wait">
            {!isSubmitting && !isComplete && !error && (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* AI Provider Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    {formData.aiProvider === 'gemini' ? (
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Zap className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">
                        AI Provider: {formData.aiProvider === 'gemini' ? 'Gemini' : 'Groq'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.aiProvider === 'gemini' 
                          ? 'Google\'s advanced AI model' 
                          : 'Ultra-fast inference engine'}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.aiProvider === 'groq'}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, aiProvider: checked ? 'groq' : 'gemini' })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Acme Inc."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <select
                      id="industry"
                      required
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  <Label htmlFor="websiteUrl">Website URL *</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    required
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Any specific areas you'd like us to focus on?"
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 text-lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Generate AI Audit Report
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Your report will be generated and emailed to you within minutes
                </p>
              </motion.form>
            )}

            {isSubmitting && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Processing Your Request</h3>
                  <p className="text-gray-600">
                    Our AI agents are analyzing {formData.companyName}...
                  </p>
                </div>

                <div className="space-y-4">
                  {workflowSteps.map((step, index) => {
                    const status = getStepStatus(step.key);
                    const message = getStepMessage(step.key);

                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          {status === 'completed' && (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          )}
                          {status === 'in-progress' && (
                            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                          )}
                          {status === 'failed' && (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                          {status === 'pending' && (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{step.label}</div>
                          {message && (
                            <div className="text-sm text-gray-600">{message}</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {isComplete && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Report Sent Successfully!</h3>
                <p className="text-xl text-gray-600 mb-8">
                  Check your inbox at <strong>{formData.email}</strong>
                </p>
                <p className="text-gray-600 mb-8">
                  Your comprehensive AI-powered business audit has been generated and sent to your email. 
                  The report includes personalized insights, strategic recommendations, and actionable quick wins.
                </p>
                <Button
                  onClick={() => {
                    setIsComplete(false);
                    setWorkflowStatuses([]);
                    setFormData({
                      name: '',
                      email: '',
                      companyName: '',
                      websiteUrl: '',
                      industry: '',
                      additionalNotes: '',
                      aiProvider: 'gemini',
                    });
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full mb-6">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Something Went Wrong</h3>
                <p className="text-xl text-gray-600 mb-8">{error}</p>
                <Button
                  onClick={() => {
                    setError(null);
                    setWorkflowStatuses([]);
                  }}
                  size="lg"
                  variant="outline"
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
