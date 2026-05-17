import Hero from '@/components/Hero';
import Features from '@/components/Features';
import LeadForm from '@/components/LeadForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-slate-100">
      <Hero />
      <Features />
      <LeadForm />
      
      <footer className="border-t border-white/10 bg-[#07111f] text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-base font-semibold text-white">SimplifIQ Lead Intelligence</div>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Automated lead enrichment, report generation, and delivery for teams that want a polished first touch without manual ops overhead.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span>Built for the SimplifIQ assessment</span>
            <span>•</span>
            <span>Enterprise workflow automation</span>
            <span>•</span>
            <span>PDF and email output unchanged</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
