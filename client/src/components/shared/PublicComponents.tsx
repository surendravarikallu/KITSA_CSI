import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export function TeamCard({ name, role, photo, linkedin }: { name: string; role: string; photo: string; linkedin?: string }) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all border-none bg-muted/50">
      <div className="aspect-square overflow-hidden">
        <img src={photo} alt={name} className="w-full h-full object-cover transition-transform hover:scale-105" />
      </div>
      <CardHeader className="p-4 text-center">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <p className="text-sm text-primary font-medium">{role}</p>
      </CardHeader>
      {linkedin && (
        <CardContent className="p-4 pt-0 text-center">
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            LinkedIn Profile
          </a>
        </CardContent>
      )}
    </Card>
  );
}

export function FeatureCard({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <Card className="hover-elevate transition-all border-none bg-muted/30">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function MembershipCard({ title, price, period, features, onApply }: { title: string; price: string; period: string; features: string[]; onApply: () => void }) {
  return (
    <Card className="flex flex-col h-full border-2 border-primary/10 hover:border-primary/30 transition-all">
      <CardHeader className="text-center pb-8 border-b border-primary/5">
        <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-primary">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-8">
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <button
          onClick={onApply}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Apply for Membership
        </button>
      </CardContent>
    </Card>
  );
}
