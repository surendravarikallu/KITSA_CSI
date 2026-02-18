import { SectionHeader, FeatureCard } from "@/components/shared/PublicComponents";
import { Wrench, Trophy, Building, Users, Lightbulb, Briefcase } from "lucide-react";

const benefits = [
  { title: "Workshops & Certifications", description: "Hands-on learning sessions and industry-recognized certifications.", icon: Wrench },
  { title: "Hackathons & Competitions", description: "Test your skills and win prizes in our regular coding events.", icon: Trophy },
  { title: "Industry Exposure", description: "Direct interaction with professionals and visits to top tech companies.", icon: Building },
  { title: "Networking Opportunities", description: "Connect with a vast network of IT professionals and like-minded peers.", icon: Users },
  { title: "Leadership Experience", description: "Take charge of events and initiatives as part of the core team.", icon: Lightbulb },
  { title: "Career Growth", description: "Enhance your resume and get guidance for your professional journey.", icon: Briefcase },
];

export default function WhyUs() {
  return (
    <div className="container mx-auto px-4 py-16">
      <SectionHeader 
        title="Why Join CSI?" 
        subtitle="Join the most active tech community and accelerate your technical and professional growth."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, i) => (
          <FeatureCard key={i} {...benefit} />
        ))}
      </div>
    </div>
  );
}
