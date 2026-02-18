import { SectionHeader, TeamCard } from "@/components/shared/PublicComponents";

const team = [
  { name: "Prof. Sarah Smith", role: "Faculty Coordinator", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
  { name: "Alex Johnson", role: "President", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Emily Davis", role: "Vice President", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
  { name: "Michael Chen", role: "Technical Head", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  { name: "Sophia Wilson", role: "Events Lead", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
  { name: "David Miller", role: "Public Relations", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
];

export default function Team() {
  return (
    <div className="container mx-auto px-4 py-16">
      <SectionHeader 
        title="Managing Team" 
        subtitle="Meet the dedicated individuals who make our CSI Chapter a success."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member, i) => (
          <TeamCard key={i} {...member} />
        ))}
      </div>
    </div>
  );
}
