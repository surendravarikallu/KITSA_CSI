import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/shared/EventCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Events() {
  const { events, isLoading } = useEvents();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredEvents = events?.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || event.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pt-16">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-4xl mb-4">Events & Workshops</h1>
          <p className="text-slate-300 max-w-2xl text-lg">
            Discover opportunities to learn, network, and grow. Browse our calendar of upcoming technical sessions and community gatherings.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 mb-12">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search events..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Past Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-1 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredEvents?.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl text-slate-500">No events found matching your criteria.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents?.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}