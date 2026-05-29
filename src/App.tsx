/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Instagram, MapPin, Code2, Rocket, ExternalLink, Mail, Github, Globe, Phone } from "lucide-react";

export default function App() {
  const projects = [
    {
      name: "7pace Time Tracker for Azure DevOps",
      link: "https://7pace-time-tracker-for-azure-dev-op.vercel.app/",
      color: "bg-[#00E676]",
      description: "A professional time tracking solution integrated with Azure DevOps."
    },
    {
      name: "Smart Notes",
      link: "https://smart-notes-ai-ecru.vercel.app/",
      color: "bg-[#FFD600]",
      description: "An AI-powered note-taking application for smarter productivity."
    },
    {
      name: "Daily Health Guardian",
      link: "https://daily-health-guardian.vercel.app/",
      color: "bg-[#00C2FF]",
      description: "Your personal companion for tracking and improving daily health habits."
    },
    {
      name: "Tic Tac Toe",
      link: "https://tic-tac-toe-liart-alpha-24.vercel.app/",
      color: "bg-[#FF3E81]",
      description: "A fun and interactive classic Tic Tac Toe game with a modern touch."
    },
    {
      name: "Red Pulse",
      link: "https://red-pulse-news.vercel.app/",
      color: "bg-[#FF5252]",
      description: "A global intelligence and news platform for staying updated with the world."
    },
    {
      name: "Interactive Periodic Table",
      link: "https://periodic-table-blond.vercel.app/",
      color: "bg-[#BD00FF]",
      description: "An educational and beautifully interactive periodic table showcasing properties of all chemical elements."
    },
    {
      name: "Tuggable Lamp",
      link: "https://lamp-ebon.vercel.app/",
      color: "bg-[#FF9100]",
      description: "A playfully realistic interactive hanging lamp experience utilizing physics-based chain interactions."
    },
    {
      name: "House Build Game",
      link: "https://house-build-game.vercel.app/",
      color: "bg-[#05C46B]",
      description: "A fun, block-building and structural construction game with interactive mechanics."
    },
    {
      name: "Lexora AI",
      link: "https://lexora-ai-gray.vercel.app/",
      color: "bg-[#6C5CE7]",
      description: "An intelligent, adaptive, and highly responsive generative AI assistant companion."
    },
    {
      name: "Massive Multiplayer Laser Tag",
      link: "https://massive-multiplayer-laser-tag-omega.vercel.app/",
      color: "bg-[#00D8D6]",
      description: "An exhilarating, real-time multiplayer laser tag game built with dynamic physics and competitive mechanics."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9ED] text-[#1A1A1A] font-sans selection:bg-[#FF3E81] selection:text-white">
      {/* Background Grid Pattern - subtle */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Hero & About */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-7xl md:text-[7rem] font-black uppercase leading-[0.85] tracking-tighter text-[#FF3E81]">
                SANJITH<br />ANUMOLA
              </h1>
              <div className="hidden sm:flex w-24 h-24 rounded-3xl bg-[#FFD600] border-4 border-black rotate-3 items-center justify-center text-5xl shadow-[4px_4px_0_0_#000]">
                🚀
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#00C2FF] leading-tight">
              13-Year-Old Web Developer | <br />
              <span className="text-[#1A1A1A]">Building the Future from Hyderabad</span>
            </h2>
          </motion.header>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
            id="about"
          >
            <div className="bg-white border-4 border-black p-8 rounded-[2rem] shadow-[10px_10px_0_0_#000]">
              <p className="text-2xl md:text-3xl font-medium leading-relaxed italic opacity-90">
                "Hey! I'm <span className="font-black text-[#FF3E81]">Sanjith Anumola</span>, a 13-year-old tech enthusiast based in Hyderabad. I don't just browse the web—I build it. I spend my time learning code and turning ideas into functional, clean websites."
              </p>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-4">
              <h3 className="text-sm uppercase tracking-widest font-black flex items-center gap-2">
                <span className="w-4 h-4 bg-[#FF3E81] rounded-full"></span>
                My Creations & Projects
              </h3>
              <div className="h-[4px] flex-grow bg-black rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {projects.map((project, idx) => (
                <motion.a
                  key={project.name}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative overflow-hidden border-4 border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all ${project.color}`}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Rocket className="w-24 h-24 -rotate-12" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-2">
                    <h4 className="text-2xl md:text-3xl font-black uppercase leading-none tracking-tighter mb-2">
                      {project.name}
                    </h4>
                    <p className="font-bold opacity-80 text-lg leading-snug max-w-xl">
                      {project.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 bg-white text-black self-start px-4 py-2 border-3 border-black rounded-xl font-black text-xs uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-colors">
                      View Live Project <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right Column: Profile & Connect */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group lg:sticky lg:top-12"
          >
            <div className="absolute -inset-2 bg-[#00FF00] border-2 border-black hidden group-hover:block transition-all"></div>
            <div className="relative bg-white border-4 border-black p-2 rounded-[2rem] shadow-[12px_12px_0_0_#000] group-hover:shadow-[4px_4px_0_0_#000] transition-all overflow-hidden">
              <img 
                src="https://kommodo.ai/i/LGB2hCeZCOjeQ9zMIo2J" 
                alt="Sanjith Anumola Profile" 
                className="w-full aspect-square object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/sanjith/800/800";
                }}
              />
              
              <div className="p-6 bg-white">
                <div className="flex flex-col gap-4">
                  <div className="bg-[#FFD600] border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0_0_#000]">
                    <h3 className="text-xs uppercase tracking-widest font-black mb-2 text-[#7C3AED]">Current Status</h3>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎓</div>
                      <span className="font-bold uppercase tracking-tight text-sm">Independent Developer</span>
                    </div>
                  </div>

                  <div className="bg-[#FF8A00] border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0_0_#000] flex flex-col gap-3 text-white">
                    <h3 className="text-xs uppercase tracking-widest font-black">Connect With Me</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a 
                        href="https://github.com/sanjithanumola" 
                        target="_blank" 
                        className="flex items-center gap-2 bg-white text-black p-2 rounded-xl border-2 border-black hover:rotate-1 transition-transform"
                      >
                        <Github className="w-4 h-4 text-[#181717]" />
                        <span className="font-bold text-xs uppercase">GitHub</span>
                      </a>

                      <a 
                        href="https://instagram.com/sanjith.anumola_12" 
                        target="_blank" 
                        className="flex items-center gap-2 bg-white text-black p-2 rounded-xl border-2 border-black hover:-rotate-1 transition-transform"
                      >
                        <Instagram className="w-4 h-4 text-[#FF3E81]" />
                        <span className="font-bold text-xs uppercase">Instagram</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a 
                        href="tel:+919381259371" 
                        className="flex items-center gap-2 bg-white text-black p-2 rounded-xl border-2 border-black hover:rotate-1 transition-transform"
                      >
                        <Phone className="w-4 h-4 text-[#00E676]" />
                        <span className="font-bold text-xs uppercase">Call Me</span>
                      </a>

                      <div className="flex items-center gap-2 bg-white text-black p-2 rounded-xl border-2 border-black">
                        <MapPin className="w-4 h-4 text-[#00C2FF]" />
                        <span className="font-bold text-xs uppercase">Hyderabad</span>
                      </div>
                    </div>

                    <a 
                      href="mailto:sanjith.anumola@gmail.com" 
                      className="flex items-center gap-2 bg-white text-black p-2 rounded-xl border-2 border-black hover:-rotate-1 transition-transform overflow-hidden"
                    >
                      <Mail className="w-4 h-4 flex-shrink-0 text-[#7C3AED]" />
                      <span className="font-bold text-xs truncate">sanjith.anumola@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <footer className="mt-auto pt-12 pb-6 lg:pb-0 border-t-4 border-black">
          </footer>

        </aside>
      </main>

      {/* Marquee Footer (Purely Aesthetic) */}
      <div className="fixed bottom-0 w-full overflow-hidden bg-[#7C3AED] py-3 border-t-4 border-black whitespace-nowrap hidden md:block z-50">
        <div className="flex animate-marquee-slower whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white font-black text-sm uppercase mx-12">
              SANJITH ANUMOLA ★ BUILDING THE FUTURE ★ HYDERABAD ★ INDIA ★ 13-YEAR-OLD DEV ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
