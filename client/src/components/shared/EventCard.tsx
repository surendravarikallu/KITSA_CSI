import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useRegisterEvent } from "@/hooks/use-events";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuth();
  const { mutate: register, isPending } = useRegisterEvent();

  // Helper to generate a consistent random image based on ID
  const randomImageId = (event.id % 5) + 1;
  const imageUrl = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60`; 
  // Tech/Event related fallback images
  const images = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60", // Conference
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60", // Meeting
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60", // Tech Talk
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60", // Workshop
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60", // Team
  ];

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={images[event.id % images.length]} 
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className="uppercase text-xs font-bold tracking-wider">
            {event.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-display font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-primary/70" />
            {format(new Date(event.date), "PPP 'at' p")}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary/70" />
            {event.venue}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary/70" />
            {event.capacity} seats available
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full font-semibold shadow-md hover:shadow-lg transition-all" 
          onClick={() => register(event.id)}
          disabled={isPending || event.status !== 'upcoming'}
        >
          {isPending ? "Registering..." : event.status === 'upcoming' ? "Register Now" : "Event Closed"}
        </Button>
      </CardFooter>
    </Card>
  );
}
