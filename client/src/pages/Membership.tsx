import { SectionHeader, MembershipCard } from "@/components/shared/PublicComponents";
import { useLocation } from "wouter";

export default function Membership() {
  const [, setLocation] = useLocation();

  const handleApply = () => {
    setLocation("/register");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <SectionHeader
        title="Membership Details"
        subtitle="Join our community of over 100+ members and get access to exclusive resources and events."
      />

      <div className="max-w-xl mx-auto">
        <MembershipCard
          title="Student Membership"
          price="₹400"
          period="Year"
          features={[
            "Free access to all local workshops",
            "Discounted entry to national symposiums",
            "Monthly technical magazine (e-copy)",
            "Participation in CSI national level competitions",
            "Networking with industry experts",
            "Leadership opportunities in the student chapter",
          ]}
          onApply={handleApply}
        />

        <div className="mt-12 p-8 bg-muted/30 rounded-2xl border border-primary/5">
          <h3 className="text-xl font-bold mb-4">Membership Process</h3>
          <div className="space-y-4 text-muted-foreground">
            <p className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
              Register an account on our portal with your college details.
            </p>
            <p className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
              Fill out the membership application form.
            </p>
            <p className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
              Complete the payment process at the chapter desk.
            </p>
            <p className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">4</span>
              Get your membership ID and start enjoying the benefits!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
