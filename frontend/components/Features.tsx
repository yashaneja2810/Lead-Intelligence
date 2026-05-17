'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  Search,
  FileText,
  Mail,
  Database,
  Cloud,
  TrendingUp,
  Layers3,
  ShieldCheck,
  Wand2,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-agent analysis',
    description: 'Research, strategy, SEO, UX, and synthesis are coordinated into one concise executive readout.',
  },
  {
    icon: Search,
    title: 'Public-web enrichment',
    description: 'Captures site content, structure, metadata, navigation, and other visible business signals.',
  },
  {
    icon: Wand2,
    title: 'Personalized recommendations',
    description: 'Outputs are tuned to the submitted company, industry, and observed digital maturity.',
  },
  {
    icon: TrendingUp,
    title: 'Readiness scoring',
    description: 'AI, SEO, UX, automation, and technical maturity are scored with clear next-step guidance.',
  },
  {
    icon: FileText,
    title: 'Executive PDF reports',
    description: 'The generated report is formatted for stakeholder review with summary, findings, and quick wins.',
  },
  {
    icon: Mail,
    title: 'Automated delivery',
    description: 'The report is emailed automatically with a polished handoff and no manual intervention.',
  },
  {
    icon: Database,
    title: 'Lead logging',
    description: 'Each lead can be written to Google Sheets as a lightweight operational tracker.',
  },
  {
    icon: Cloud,
    title: 'Cloud archiving',
    description: 'Generated PDFs can be archived to Drive for retention, sharing, and internal follow-up.',
  },
];

export default function Features() {
  return (
    <section id="capabilities" className="border-t border-slate-200 bg-[#f4f7fb] py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <Layers3 className="h-4 w-4 text-sky-600" />
            Platform capabilities
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Built to support a complete lead-intake workflow, end to end.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Every stage is designed to look and feel like an enterprise system: validated intake, structured research, professional output, and reliable delivery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group h-full"
            >
              <div className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition group-hover:border-sky-200 group-hover:bg-sky-50 group-hover:text-sky-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                  Enterprise ready
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
