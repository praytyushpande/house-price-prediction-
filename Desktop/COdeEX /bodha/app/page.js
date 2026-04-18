'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowRight, GitBranch, Map, Shield, Zap, MessageSquare, ChevronDown, ChevronUp, Code2, Briefcase, Trophy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('founders');
  const [openFaq, setOpenFaq] = useState(null);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#7B61FF]/30 font-body relative isolate overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-[#7B61FF] text-2xl group-hover:scale-110 transition-transform duration-300">✦</span>
            <span className="font-heading font-bold text-2xl tracking-tight">Bodha</span>
          </div>
          
          <div className="hidden md:flex gap-10 text-[15px] text-white/50 font-medium">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How it works</a>
            <a href="#use-cases" className="hover:text-white transition-colors duration-200">Use cases</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </div>
          
          <Link href="/analyze" className="bg-[#7B61FF] hover:bg-[#684DEC] text-white px-6 py-2.5 rounded-full font-semibold text-[15px] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl hover:shadow-[#7B61FF]/20">
            Try Bodha Free
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 flex flex-col gap-32 md:gap-48 pb-32">
        
        {/* 2. HERO SECTION */}
        <section className="pt-48 flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center z-10"
          >
            <motion.h1 
              variants={itemVariants}
              className="font-heading font-bold text-5xl md:text-8xl leading-tight md:leading-[1.05] tracking-tight mb-8 max-w-4xl"
            >
              Your codebase.<br />
              <span className="text-white/40">Finally explained.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-white/60 text-lg md:text-2xl max-w-2xl mb-12 font-regular leading-relaxed"
            >
              Paste any GitHub link. Get a complete plain English breakdown of your entire product — architecture, risks, and health status.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
              <Link href="/analyze" className="flex items-center justify-center gap-2 bg-[#7B61FF] hover:bg-[#684DEC] text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:shadow-[#7B61FF]/40 hover:-translate-y-0.5">
                Analyze a repo <ArrowRight size={20} className="ml-1" />
              </Link>
              <a href="#preview" className="flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/5">
                See sample report
              </a>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-white/30 text-sm font-semibold tracking-wide uppercase">
              Used by founders, PMs, and contributors
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mt-32 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#7B61FF]/40 to-transparent blur-[120px] opacity-20 -z-10 rounded-full" />
            
            <div className="bg-[#121212]/90 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative backdrop-blur-sm">
              <div className="flex gap-2 mb-8 border-b border-white/5 pb-5">
                <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50" />
              </div>
              
              <div className="space-y-6 min-h-[300px]">
                <div className="space-y-4 font-mono text-sm mb-10">
                  <TypingText text="Analyzing github.com/vercel/next.js..." delay={0.5} />
                  <TypingText text="Generating visual map..." delay={1.5} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "1. What is this product?", 
                    "2. The system map", 
                    "3. Visual architecture", 
                    "4. Health check"
                  ].map((title, i) => (
                    <motion.div 
                      key={title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.2 + (i * 0.2) }}
                      className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex items-center gap-4 text-white/90 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="bg-[#7B61FF]/10 p-2 rounded-lg text-[#7B61FF]">
                        <Zap size={18} fill="currentColor" className="fill-[#7B61FF]/20" />
                      </div>
                      <span className="font-bold text-[15px]">{title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. SOCIAL PROOF BAR */}
        <section className="py-16 md:py-24 border-y border-white/5 relative overflow-hidden flex items-center">
          <div className="flex shrink-0 animate-marquee whitespace-nowrap opacity-30 select-none">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center px-10 text-2xl font-heading font-black tracking-tighter uppercase italic">
                <span>Y COMBINATOR</span>
                <span className="text-[#7B61FF] tracking-normal not-italic">✦</span>
                <span>STANFORD</span>
                <span className="text-[#7B61FF] tracking-normal not-italic">✦</span>
                <span>VERCEL</span>
                <span className="text-[#7B61FF] tracking-normal not-italic">✦</span>
                <span>LINEAR</span>
                <span className="text-[#7B61FF] tracking-normal not-italic">✦</span>
                <span>STRIPE</span>
                <span className="text-[#7B61FF] tracking-normal not-italic">✦</span>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        </section>

        {/* 4. HOW IT WORKS */}
        <motion.section 
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="text-center mb-24">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-8 tracking-tight">Three steps to clarity</h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto">No setup. No installation. Just instant understanding.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksCard num="01" title="Paste your link" desc="Public or private repo. No installation needed." icon={<GitBranch className="stroke-[#7B61FF]" size={28} />} />
            <HowItWorksCard num="02" title="Bodha analyzes" desc="AI reads your entire codebase — dependencies & risks." icon={<Zap className="stroke-[#7B61FF]" size={28} />} />
            <HowItWorksCard num="03" title="Get your report" desc="Plain English. Visual map. Health check." icon={<Map className="stroke-[#7B61FF]" size={28} />} />
          </div>
        </motion.section>

        {/* 5. USE CASES SECTION */}
        <motion.section 
          id="use-cases"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="text-center mb-24">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-8 tracking-tight">Built for everyone <br />who isn't a developer</h2>
          </div>
          
          <div className="bg-[#121212]/50 border border-white/10 rounded-[32px] p-2 flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
            <div className="flex lg:flex-col gap-2 p-6 overflow-x-auto no-scrollbar lg:bg-white/[0.02] rounded-[24px] lg:border border-white/5">
              <TabButton active={activeTab === 'founders'} onClick={() => setActiveTab('founders')} icon={<Briefcase size={20} />} label="Founders & PMs" />
              <TabButton active={activeTab === 'oss'} onClick={() => setActiveTab('oss')} icon={<Code2 size={20} />} label="Contributors" />
              <TabButton active={activeTab === 'gsoc'} onClick={() => setActiveTab('gsoc')} icon={<Trophy size={20} />} label="GSoC Applicants" />
            </div>
            
            <div className="flex-1 p-10 bg-[#0A0A0A] rounded-[24px] border border-white/5 relative overflow-hidden min-h-[450px] flex items-center">
              <AnimatePresence mode="wait">
                {activeTab === 'founders' && (
                  <motion.div key="founders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col lg:flex-row gap-12 items-center w-full">
                    <div className="flex-1 space-y-6 text-left">
                      <h3 className="font-heading text-4xl font-bold leading-tight">Stop nodding<br />in standup</h3>
                      <p className="text-white/40 text-lg leading-relaxed">Understand exactly what your team is building. Ask sharper questions. Catch technical debt before it slows you down.</p>
                    </div>
                    <div className="flex-1 bg-red-400/5 border border-red-500/20 p-8 rounded-2xl w-full">
                      <div className="flex items-center gap-3 mb-6 text-red-500 font-bold uppercase text-xs tracking-widest">
                        <Shield size={18} />
                        <span>Critical Health Alert</span>
                      </div>
                      <p className="text-white/90 text-[15px] font-medium leading-relaxed">Hardcoded credentials found in `auth-provider.js`. This is a high-security risk for production deployment.</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'oss' && (
                  <motion.div key="oss" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col lg:flex-row gap-12 items-center w-full">
                    <div className="flex-1 space-y-6 text-left">
                      <h3 className="font-heading text-4xl font-bold leading-tight">Onboard in<br />seconds</h3>
                      <p className="text-white/40 text-lg leading-relaxed">New to a massive repo? Bodha maps the architecture so you know exactly where to make your first commit.</p>
                    </div>
                    <div className="flex-1 bg-[#7B61FF]/5 border border-[#7B61FF]/20 p-8 rounded-2xl w-full">
                      <div className="flex items-center gap-3 mb-6 text-[#7B61FF] font-bold uppercase text-xs tracking-widest">
                        <Code2 size={18} />
                        <span>Core Architecture</span>
                      </div>
                      <div className="space-y-3">
                        {["src/logic/processor.ts", "src/view/renderer.ts", "src/store/index.ts"].map(path => (
                          <div key={path} className="px-4 py-3 bg-white/[0.03] rounded-lg border border-white/5 text-sm text-white/70 font-mono">{path}</div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gsoc' && (
                  <motion.div key="gsoc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col lg:flex-row gap-12 items-center w-full">
                    <div className="flex-1 space-y-6 text-left">
                      <h3 className="font-heading text-4xl font-bold leading-tight">Write proposals<br />that win</h3>
                      <p className="text-white/40 text-lg leading-relaxed">Understand any GSoC org better than other applicants. Find the exact files that need refactoring before you type a word.</p>
                    </div>
                    <div className="flex-1 bg-yellow-500/5 border border-yellow-500/20 p-8 rounded-2xl w-full">
                      <div className="flex items-center gap-3 mb-6 text-yellow-500 font-bold uppercase text-xs tracking-widest">
                        <Trophy size={18} />
                        <span>Contribution Idea</span>
                      </div>
                      <p className="text-white/90 text-[15px] font-medium leading-relaxed italic mb-4">"The current state machine in `src/sm` is highly coupled. Refactoring this to a modular pattern will reduce bug surface area by 40%."</p>
                      <div className="text-[13px] text-white/30 font-semibold tracking-wide">CONFIRMED BY BODHA ARCHITECTURE ENGINE</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* 6. FEATURES GRID */}
        <motion.section 
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="text-center mb-24">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-8 tracking-tight tracking-tight">System features</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="Plain English" desc="No jargon. No code blocks. Just clarity on why this product exists." icon="✦" />
            <FeatureCard title="Static Maps" desc="Visual relationship maps between your modules and external APIs." icon="🗺" />
            <FeatureCard title="Health Checks" desc="Traffic light labels for security, performance, and complexity." icon="❤" />
            <FeatureCard title="Opportunities" desc="Find what to build next based on architectural strengths." icon="💡" />
            <FeatureCard title="Team Questions" desc="6 sharp questions to ask your leads during next meeting." icon="❓" />
            <FeatureCard title="Contributor Mode" desc="Optimized paths for OSS and GSoC contributors." icon="🔄" />
          </div>
        </motion.section>

        {/* 7. PREVIEW SECTION */}
        <motion.section 
          id="preview"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="text-center"
        >
          <h2 className="font-heading font-bold text-4xl md:text-6xl mb-16 tracking-tight tracking-tight">The final report</h2>
          
          <div className="w-full max-w-5xl mx-auto bg-[#121212] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative mb-16">
            <div className="bg-white/5 p-5 flex gap-2 items-center border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              <div className="ml-6 px-4 py-1.5 bg-black/50 rounded-full text-xs text-white/30 font-mono tracking-wide">app.bodha.in/report/vercel-v0</div>
            </div>
            <div className="p-12 text-left h-[500px] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#121212] via-[#0A0A0A] to-[#0A0A0A] space-y-12">
              <div className="space-y-4">
                <h3 className="text-[#7B61FF] font-bold tracking-[0.2em] text-[10px] uppercase">01. OVERVIEW</h3>
                <h4 className="text-4xl font-heading font-black">AI-Driven UI Generator</h4>
                <p className="text-white/50 text-xl leading-relaxed max-w-2xl">This system translates natural language prompts into React components using a distributed agentic architecture.</p>
              </div>
              
              <div className="p-10 bg-red-500/[0.03] border border-red-500/10 rounded-2xl">
                 <h3 className="text-red-500 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Shield size={16} /> Health Assessment: Risk
                 </h3>
                 <p className="text-white/80 text-lg">The prompt sanitization layer is currently tightly coupled with the LLM router, creating a potential bottleneck and single point of failure.</p>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[#7B61FF] font-bold tracking-[0.2em] text-[10px] uppercase">02. LEAD QUESTIONS</h3>
                 <div className="space-y-4">
                   {["How are we decoupling the router from the sanitizer?", "What is the fallback logic if the LLM provider latency exceeds 2s?"].map(q => (
                     <div key={q} className="flex gap-4 items-start text-lg text-white/80 font-medium border-b border-white/5 pb-4">
                       <span className="text-[#7B61FF]">/</span>
                       <p>{q}</p>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </div>
          
          <Link href="/analyze" className="inline-flex items-center justify-center gap-3 bg-[#7B61FF] hover:bg-[#684DEC] text-white px-12 py-5 rounded-full font-black text-xl transition-all shadow-2xl hover:shadow-[#7B61FF]/40 hover:scale-105">
            GENERATE YOURS FREE <ArrowRight size={24} />
          </Link>
        </motion.section>

        {/* 8. PRICING */}
        <motion.section 
          id="pricing"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="text-center mb-24">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-8 tracking-tight tracking-tight">Clarity shouldn't cost</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <PricingCard 
              title="Free Plan" 
              price="0" 
              features={['Unlimited public repos', 'All 4 analysis sections', 'Contributor entry maps', 'Visual system review']}
              cta="Get started now"
              href="/analyze"
            />
            <PricingCard 
              title="Pro Waitlist" 
              price="499" 
              features={['Private repo access', 'Slack integration', 'Real-time health monitoring', 'GSoC refined mode']}
              cta="Join waitlist"
              disabled
              popular
            />
          </div>
        </motion.section>

        {/* 9. FAQ */}
        <section className="max-w-3xl mx-auto">
          <div className="mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight">Details</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Is any code knowledge required?", a: "Zero. Bodha is designed for PMs, founders, and students who need a high-level conceptual understanding without parsing syntax." },
              { q: "Does it support private repositories?", a: "Currently we only support public repositories. Private repo integration is the #1 feature in Bodha Pro, launching soon." },
              { q: "How does it compare to LLM chats?", a: "Standard LLMs explain snippets. Bodha understands the entire repository graph, finding connections and risks that cross file boundaries." },
              { q: "How safe is my code?", a: "For public repos, we only read what is already public. We don't store your code and we don't train our models on it." }
            ].map((faq, idx) => (
              <FaqItem key={idx} idx={idx} openFaq={openFaq} setOpenFaq={setOpenFaq} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="py-48 text-center flex flex-col items-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7B61FF]/10 blur-[160px] rounded-full pointer-events-none -z-10" />
          
          <h2 className="font-heading font-bold text-6xl md:text-8xl mb-16 leading-tight tracking-tighter">
            Stop guessing.<br />
            <span className="text-white/40 italic">Start knowing.</span>
          </h2>
          
          <Link href="/analyze" className="inline-flex items-center justify-center gap-4 bg-[#7B61FF] hover:bg-[#684DEC] text-white px-12 py-6 rounded-full font-black text-2xl transition-all shadow-2xl hover:shadow-[#7B61FF]/60 hover:scale-110 active:scale-95">
            ANALYZE A REPO NOW <ArrowRight size={28} />
          </Link>
          
          <p className="mt-12 text-white/30 text-sm font-black tracking-widest uppercase mb-16">Free for all public projects</p>
        </section>

      </main>

      {/* 11. FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[#7B61FF] text-2xl">✦</span>
              <span className="font-heading font-bold text-2xl tracking-tight">Bodha</span>
            </div>
            <p className="text-white/30 max-w-sm text-sm leading-relaxed">Bodha provides technical clarity for non-technical minds. Built for the next generation of builders.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-20">
            <div className="space-y-4">
              <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">Product</h5>
              <Link href="#features" className="block text-sm text-white/50 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="block text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
              <Link href="/analyze" className="block text-sm text-white/50 hover:text-white transition-colors">Analyzer</Link>
            </div>
            <div className="space-y-4">
              <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">Connect</h5>
              <a href="#" className="block text-sm text-white/50 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="block text-sm text-white/50 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="block text-sm text-white/50 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="md:text-right space-y-2">
            <p className="text-white/80 font-bold text-sm">Built by Pratyush Pandey</p>
            <p className="text-white/20 text-xs">© 2025 Bodha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Optimized Subcomponents

function HowItWorksCard({ num, title, desc, icon }) {
  return (
    <div className="bg-[#121212] border border-white/10 rounded-[32px] p-10 hover:border-[#7B61FF]/50 transition-all duration-300 group hover:-translate-y-2">
      <div className="flex justify-between items-start mb-16">
        <div className="bg-[#7B61FF]/10 p-4 rounded-2xl group-hover:bg-[#7B61FF]/20 transition-colors">
          {icon}
        </div>
        <span className="text-7xl font-black font-heading text-white/[0.03] group-hover:text-white/[0.05] transition-colors">{num}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4 font-heading">{title}</h3>
      <p className="text-white/40 leading-relaxed text-lg">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-[#121212]/50 border border-white/5 p-10 rounded-[24px] hover:border-[#7B61FF]/30 transition-all duration-500 text-left">
      <div className="text-2xl mb-8 flex items-center justify-center bg-white/[0.03] w-14 h-14 rounded-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 font-heading">{title}</h3>
      <p className="text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-[16px] font-bold transition-all w-full lg:w-56 text-left whitespace-nowrap text-sm border ${
        active 
        ? 'bg-[#121212] text-white border-white/10 shadow-2xl' 
        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02] border-transparent'
      }`}
    >
      <span className={active ? 'text-[#7B61FF]' : ''}>{icon}</span>
      <span className="truncate">{label}</span>
      {active && <motion.div layoutId="tab-marker" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />}
    </button>
  );
}

function PricingCard({ title, price, features, cta, disabled, popular, href="#" }) {
  return (
    <div className={`relative p-12 rounded-[40px] border-2 transition-all flex flex-col h-full ${
      popular 
      ? 'bg-[#121212] border-[#7B61FF] shadow-[0_0_80px_rgba(123,97,255,0.1)]' 
      : 'bg-[#0F0F0F] border-white/5 hover:border-white/10'
    }`}>
      {popular && (
        <span className="absolute -top-4 left-10 bg-[#7B61FF] text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full">
          Soon
        </span>
      )}
      <h3 className="text-lg font-bold text-white/50 mb-4">{title}</h3>
      <div className="flex items-baseline gap-2 mb-12">
        <span className="text-6xl font-black font-heading tracking-tighter">₹{price}</span>
        <span className="text-white/20 font-bold uppercase tracking-widest text-[10px]">/ month</span>
      </div>
      
      <div className="space-y-6 flex-1 mb-16">
        {features.map(f => (
          <div key={f} className="flex gap-4 items-center text-[15px] font-medium text-white/70">
            <Plus className="text-[#7B61FF]/40" size={18} />
            <span>{f}</span>
          </div>
        ))}
      </div>
      
      <Link 
        href={href}
        className={`py-5 rounded-full font-black text-sm uppercase tracking-widest text-center transition-all ${
          disabled 
          ? 'bg-white/5 text-white/20 cursor-not-allowed' 
          : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function FaqItem({ idx, openFaq, setOpenFaq, q, a }) {
  const isOpen = openFaq === idx;
  return (
    <div className={`border transition-all duration-300 rounded-[20px] ${isOpen ? 'bg-white/[0.02] border-white/10' : 'border-white/5 hover:border-white/10'}`}>
      <button 
        className="w-full px-8 py-6 flex justify-between items-center text-left"
        onClick={() => setOpenFaq(isOpen ? null : idx)}
      >
        <span className="font-bold text-lg text-white/90">{q}</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#7B61FF]/10 text-[#7B61FF] rotate-180' : 'bg-white/5 text-white/40'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 text-white/40 text-lg leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingText({ text, delay }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let timeoutId;
    timeoutId = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeoutId);
  }, [text, delay]);

  return (
    <div className="flex gap-3">
      <span className="text-[#7B61FF] font-bold">❯</span>
      <span className="text-white/80 font-mono italic">{displayed}</span>
      {displayed.length < text.length && <span className="w-2 h-5 bg-[#7B61FF] animate-pulse" />}
    </div>
  );
}
