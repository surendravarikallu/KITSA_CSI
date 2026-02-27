import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Code, Users, Award, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/shared/EventCard";

// Import all sections for SPA
import About from "./About";
import Team from "./Team";
import WhyUs from "./WhyUs";
import Events from "./Events";
import Gallery from "./GalleryPage";
import Membership from "./Membership";
import Contact from "./Contact";

export default function Home() {
  const { events, isLoading } = useEvents();

  // Get up to 3 upcoming events
  const upcomingEvents = events
    ?.filter((e: any) => e.status === 'upcoming')
    .slice(0, 3) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center justify-center text-white bg-slate-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-50 z-0"
          style={{ backgroundImage: "url('/csi_hero_with_logo.webp')" }}
        ></div>
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight text-white drop-shadow-lg uppercase">
              Welcome to <span className="text-blue-400 block mt-2">KITS akshar CSI</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-12 font-light tracking-wide drop-shadow-md">
              The seed for KITS AKSHAR CSI has been planted for many months, the hardwork finally paid off on 22nd November, 2022. The KITS AKSHAR CSI came into existance and the students and other members of CSI from our institution are getting benefited since then.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="#about">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700 text-white">
                  Read More
                </Button>
              </a>
              <a href="#events">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2 border-white/50 text-white hover:bg-white hover:text-slate-900 transition-all hover:scale-105">
                  Browse Events
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Wrapper Component for Animations */}
      {[
        { id: "about", Component: About, bg: "bg-white" },
        { id: "team", Component: Team, bg: "bg-slate-50" },
        { id: "why-us", Component: WhyUs, bg: "bg-white" },
        { id: "events", Component: Events, bg: "bg-slate-50" },
        { id: "gallery", Component: Gallery, bg: "bg-white" },
        { id: "membership", Component: Membership, bg: "bg-slate-50" },
        { id: "contact", Component: Contact, bg: "bg-white" },
      ].map(({ id, Component, bg }) => (
        <section key={id} id={id} className={`scroll-mt-16 overflow-hidden ${bg}`}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Component />
          </motion.div>
        </section>
      ))}
    </div>
  );
}