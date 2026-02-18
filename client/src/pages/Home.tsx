import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Code, Users, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/shared/EventCard";

export default function Home() {
  const { events, isLoading } = useEvents();

  // Get up to 3 upcoming events
  const upcomingEvents = events
    ?.filter(e => e.status === 'upcoming')
    .slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
              Innovate. <span className="text-primary-foreground text-blue-400">Connect.</span> Excel.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the premier student chapter for computer science enthusiasts. 
              We bridge the gap between academic learning and industry demands.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-blue-500/25">
                  Become a Member
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Browse Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">Technical Workshops</h3>
              <p className="text-slate-600">Hands-on sessions on the latest tech stacks, from AI/ML to Full Stack Development.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">Networking</h3>
              <p className="text-slate-600">Connect with industry experts, alumni, and like-minded peers to grow your professional network.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">Hackathons & Competitions</h3>
              <p className="text-slate-600">Test your skills in 24-hour hackathons, coding contests, and project exhibitions.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-4">Upcoming Events</h2>
              <p className="text-slate-600 max-w-xl">Don't miss out on what's happening next. Register early to secure your spot.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="hidden md:flex group">
                View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900">No upcoming events</h3>
              <p className="text-slate-500 mt-2">Check back later for new workshops and sessions.</p>
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/events">
              <Button variant="outline" className="w-full">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">Ready to start your journey?</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Join 500+ student members who are already building their future with CSI. 
            Access exclusive resources, mentorship, and events.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-primary font-bold px-10 py-6 rounded-full text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              Join CSI Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
