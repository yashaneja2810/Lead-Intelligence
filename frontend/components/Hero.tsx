'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#07111f] text-slate-100">
      <div className="absolute inset-0 opacity-60 grid-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.7),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-white/10 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100 shadow-lg shadow-slate-950/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.2em] text-slate-200 uppercase">SimplifIQ</div>
              <div className="text-xs text-slate-400">Automated lead intelligence</div>
            </div>
          </div>

          <a
            href="#form"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-300/30 hover:bg-white/10 md:inline-flex"
          >
            Start workflow
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid items-center gap-16 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
              <Sparkles className="h-4 w-4" />
              Enterprise AI workflow
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Automated prospect intelligence for every high-intent inbound lead.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                SimplifIQ captures submitted company details, researches the business from public sources, generates a polished audit, and delivers it by email without manual intervention.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#form"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                Open the workflow
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
              >
                View capabilities
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Public data enrichment', value: 'Research + validation' },
                { label: 'Report generation', value: 'PDF + narrative summary' },
                { label: 'Delivery automation', value: 'Email + archive + logs' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                  <div className="mt-2 text-sm font-medium text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-sky-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <div className="text-sm font-semibold text-white">Live orchestration preview</div>
                  <div className="text-xs text-slate-400">What the system does after submission</div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Bot className="h-3.5 w-3.5" />
                  AI active
                </div>
              </div>

              <div className="grid gap-4 p-6">
                {[
                  { title: '1. Validate submission', body: 'Checks contact data, website URL, and required business fields.', status: 'Completed', icon: ShieldCheck },
                  { title: '2. Research the company', body: 'Scrapes site structure, messaging, and technical signals from public pages.', status: 'In queue', icon: Workflow },
                  { title: '3. Generate the report', body: 'Creates a concise audit with recommendations, PDF output, and delivery artifacts.', status: 'Ready to deliver', icon: BarChart3 },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300">{item.status}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
