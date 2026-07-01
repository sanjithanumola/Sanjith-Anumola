/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Instagram, MapPin, Code2, Rocket, ExternalLink, Mail, 
  Github, Globe, Phone, Bot, Gamepad2, Sparkles, LayoutGrid 
} from "lucide-react";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");

  const projects = [
    {
      name: "7pace Time Tracker for Azure DevOps",
      link: "https://7pace-time-tracker-for-azure-dev-op.vercel.app/",
      color: "bg-[#00E676]",
      description: "A professional time tracking solution integrated with Azure DevOps.",
      category: "apps"
    },
    {
      name: "Smart Notes",
      link: "https://smart-notes-ai-ecru.vercel.app/",
      color: "bg-[#FFD600]",
      description: "An AI-powered note-taking application for smarter productivity.",
      category: "ai"
    },
    {
      name: "Daily Health Guardian",
      link: "https://daily-health-guardian.vercel.app/",
      color: "bg-[#00C2FF]",
      description: "Your personal companion for tracking and improving daily health habits.",
      category: "apps"
    },
    {
      name: "Tic Tac Toe",
      link: "https://tic-tac-toe-liart-alpha-24.vercel.app/",
      color: "bg-[#FF3E81]",
      description: "A fun and interactive classic Tic Tac Toe game with a modern touch.",
      category: "games"
    },
    {
      name: "Red Pulse",
      link: "https://red-pulse-news.vercel.app/",
      color: "bg-[#FF5252]",
      description: "A global intelligence and news platform for staying updated with the world.",
      category: "apps"
    },
    {
      name: "Interactive Periodic Table",
      link: "https://periodic-table-blond.vercel.app/",
      color: "bg-[#BD00FF]",
      description: "An educational and beautifully interactive periodic table showcasing properties of all chemical elements.",
      category: "apps"
    },
    {
      name: "Tuggable Lamp",
      link: "https://lamp-ebon.vercel.app/",
      color: "bg-[#FF9100]",
      description: "A playfully realistic interactive hanging lamp experience utilizing physics-based chain interactions.",
      category: "games"
    },
    {
      name: "House Build Game",
      link: "https://house-build-game.vercel.app/",
      color: "bg-[#05C46B]",
      description: "A fun, block-building and structural construction game with interactive mechanics.",
      category: "games"
    },
    {
      name: "Lexora AI",
      link: "https://lexora-ai-gray.vercel.app/",
      color: "bg-[#6C5CE7]",
      description: "An intelligent, adaptive, and highly responsive generative AI assistant companion.",
      category: "ai"
    },
    {
      name: "Massive Multiplayer Laser Tag",
      link: "https://massive-multiplayer-laser-tag-omega.vercel.app/",
      color: "bg-[#00D8D6]",
      description: "An exhilarating, real-time multiplayer laser tag game built with dynamic physics and competitive mechanics.",
      category: "games"
    },
    {
      name: "Gemini Slingshot",
      link: "https://slingshot-dun-kappa.vercel.app/",
      color: "bg-[#FF1F8E]",
      description: "An interactive, camera-controlled experience combining real-time hand-tracking computer vision with elastic, physics-based slingshot controls.",
      category: "ai"
    },
    {
      name: "Lyria Rhythm",
      link: "https://rhythm-ruddy.vercel.app/",
      color: "bg-[#8338EC]",
      description: "A dynamic and beautifully interactive music-making experience featuring captivating rhythm layouts and sound mechanics.",
      category: "games"
    },
    {
      name: "Run Chase!",
      link: "https://cricket-rho-hazel.vercel.app/",
      color: "bg-[#4CAF50]",
      description: "An interactive, retro-styled arcade cricket run-chasing game featuring exciting physics-based hitting mechanics.",
      category: "games"
    },
    {
      name: "Kinetic Canvas",
      link: "https://kinetic-ashy.vercel.app/",
      color: "bg-[#FF5E57]",
      description: "An interactive visual sandbox exploring dynamic physics, organic particle motion, and kinetic gravity interactions.",
      category: "games"
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
            {/* Header with Title & Divider */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-4.5 h-4.5 bg-[#FF3E81] rounded-full border-2 border-black"></span>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  My Creations
                </h3>
              </div>
              <div className="h-[4px] flex-grow bg-black rounded-full hidden sm:block"></div>
            </div>

            {/* Category Navigation Tabs */}
            <div className="flex flex-wrap gap-3 p-1">
              {[
                { id: "all", label: "All Projects", icon: LayoutGrid, activeColor: "bg-[#FF3E81] text-white shadow-[2px_2px_0_0_#000] translate-x-[2px] translate-y-[2px]" },
                { id: "ai", label: "AI Tools 🤖", icon: Bot, activeColor: "bg-[#6C5CE7] text-white shadow-[2px_2px_0_0_#000] translate-x-[2px] translate-y-[2px]" },
                { id: "games", label: "Games & Fun 🎮", icon: Gamepad2, activeColor: "bg-[#00D8D6] text-black shadow-[2px_2px_0_0_#000] translate-x-[2px] translate-y-[2px]" },
                { id: "apps", label: "Web Apps 🌐", icon: Sparkles, activeColor: "bg-[#FFD600] text-black shadow-[2px_2px_0_0_#000] translate-x-[2px] translate-y-[2px]" }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 border-3 border-black rounded-2xl font-black uppercase tracking-wider text-xs transition-all cursor-pointer ${
                      isActive 
                        ? `${tab.activeColor}` 
                        : "bg-white text-black hover:bg-gray-50 shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Project List / Grouped Sections */}
            <div className="flex flex-col gap-12">
              {[
                {
                  id: "ai",
                  title: "AI Tools & Intelligent Apps",
                  icon: Bot,
                  color: "text-[#6C5CE7]",
                  borderColor: "border-[#6C5CE7]",
                  badgeBg: "bg-[#6C5CE7]/15 text-[#6C5CE7]",
                  items: projects.filter(p => p.category === "ai")
                },
                {
                  id: "games",
                  title: "Games & Physics Playgrounds",
                  icon: Gamepad2,
                  color: "text-[#FF1F8E]",
                  borderColor: "border-[#FF1F8E]",
                  badgeBg: "bg-[#FF1F8E]/15 text-[#FF1F8E]",
                  items: projects.filter(p => p.category === "games")
                },
                {
                  id: "apps",
                  title: "Web Applications & Utilities",
                  icon: Sparkles,
                  color: "text-[#00C2FF]",
                  borderColor: "border-[#00C2FF]",
                  badgeBg: "bg-[#00C2FF]/15 text-[#00C2FF]",
                  items: projects.filter(p => p.category === "apps")
                }
              ]
                .filter(sec => activeCategory === "all" || sec.id === activeCategory)
                .map((section) => (
                  <div key={section.id} className="flex flex-col gap-6">
                    {/* Sub Section Header */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 border-3 border-black rounded-xl font-black uppercase text-xs tracking-wider bg-white shadow-[4px_4px_0_0_#000]">
                        <section.icon className={`w-4 h-4 ${section.color} stroke-[3]`} />
                        <span>{section.title}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-black ${section.badgeBg}`}>
                          {section.items.length}
                        </span>
                      </div>
                      <div className="h-[2px] flex-grow bg-black/15"></div>
                    </div>

                    {/* Section Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.items.map((project, idx) => (
                        <motion.a
                          key={project.name}
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group relative overflow-hidden border-4 border-black p-6 rounded-[2rem] shadow-[6px_6px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between min-h-[190px] ${project.color}`}
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Rocket className="w-16 h-16 -rotate-12" />
                          </div>

                          <div className="relative z-10 flex flex-col gap-1.5">
                            <h4 className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-1">
                              {project.name}
                            </h4>
                            <p className="font-bold opacity-85 text-xs leading-relaxed max-w-sm">
                              {project.description}
                            </p>
                          </div>

                          <div className="relative z-10 mt-6 flex items-center gap-2 bg-white text-black self-start px-3.5 py-2 border-3 border-black rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-colors">
                            Launch Project <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Coming Soon Projects */}
            <div className="flex flex-col gap-6 mt-12 bg-[#FFD600]/10 border-4 border-dashed border-black p-6 md:p-8 rounded-[2.5rem]">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-[#FF8A00]">
                  <span className="w-3.5 h-3.5 bg-[#FF8A00] rounded-full animate-ping"></span>
                  Coming Soon 🛠️
                </h3>
                <div className="h-[2px] flex-grow bg-black/20"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative overflow-hidden bg-white border-4 border-black p-6 rounded-[2rem] shadow-[6px_6px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Code2 className="w-16 h-16" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase bg-[#FFD600] px-2 py-0.5 border border-black rounded-md">Prototype</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-black uppercase leading-none tracking-tight mb-2">
                        Interactive Car Showcase
                      </h4>
                      <p className="font-bold text-gray-600 text-xs leading-relaxed">
                        A futuristic interactive vehicle experience examining custom controls, dynamic styling, and immersive WebGL physics-based mechanics.
                      </p>
                    </div>
                    
                    <a
                      href="https://car-seven-peach.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-black hover:bg-[#FFD600] hover:text-black text-white font-black py-2.5 px-4 border-3 border-black rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      <span>Preview Work <ExternalLink className="w-3.5 h-3.5" /></span>
                    </a>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-white border-4 border-black p-6 rounded-[2rem] shadow-[6px_6px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Bot className="w-16 h-16" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase bg-[#6C5CE7] text-white px-2 py-0.5 border border-black rounded-md">AI Helper</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-black uppercase leading-none tracking-tight mb-2">
                        Mail Genius AI
                      </h4>
                      <p className="font-bold text-gray-600 text-xs leading-relaxed">
                        An intelligent email assistant helper designed to craft perfect, contextual replies and manage correspondence seamlessly.
                      </p>
                    </div>
                    
                    <a
                      href="https://mail-genius-ai.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-black hover:bg-[#6C5CE7] hover:text-white text-white font-black py-2.5 px-4 border-3 border-black rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      <span>Preview Work <ExternalLink className="w-3.5 h-3.5" /></span>
                    </a>
                  </div>
                </div>
              </div>
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
