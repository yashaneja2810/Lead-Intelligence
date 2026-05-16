'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  Search, 
  FileText, 
  Mail, 
  Database, 
  Cloud,
  Sparkles,
  TrendingUp 
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-Agent AI Analysis',
    description: 'Six specialized AI agents analyze your business from different perspectives: research, strategy, SEO, UX, AI opportunities, and synthesis.',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: Search,
    title: 'Deep Web Scraping',
    description: 'Advanced Playwright-powered scraping extracts comprehensive data from your website, including multi-page analysis and tech stack detection.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Sparkles,
    title: 'AI Opportunity Detection',
    description: 'Personalized AI integration recommendations tailored to your industry, business model, and current digital maturity.',
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    icon: TrendingUp,
    title: 'Readiness Scoring',
    description: 'Get scored on AI readiness, SEO health, UX quality, automation potential, and technical maturity with actionable insights.',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: FileText,
    title: 'Premium PDF Reports',
    description: 'Beautiful, professional audit reports with executive summaries, strategic recommendations, and quick wins.',
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    icon: Mail,
    title: 'Automated Delivery',
    description: 'Reports automatically delivered via SMTP with personalized messaging and professional formatting.',
    gradient: 'from-red-500 to-red-600',
  },
  {
    icon: Database,
    title: 'Google Sheets Logging',
    description: 'All leads automatically logged to Google Sheets for easy tracking and CRM integration.',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Cloud,
    title: 'Cloud Archiving',
    description: 'PDFs automatically archived to Google Drive with shareable links for easy access and distribution.',
    gradient: 'from-cyan-500 to-cyan-600',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade AI technology that delivers actionable insights in minutes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
