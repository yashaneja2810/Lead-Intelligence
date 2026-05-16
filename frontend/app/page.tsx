import Hero from '@/components/Hero';
import Features from '@/components/Features';
import LeadForm from '@/components/LeadForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <LeadForm />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              AI Lead Enrichment Platform
            </h3>
            <p className="text-gray-400 mb-6">
              Powered by advanced AI technology including Gemini, Groq, and multi-agent analysis
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <span>© 2024 All rights reserved</span>
              <span>•</span>
              <span>Built for Simplifi-IQ Assessment</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
