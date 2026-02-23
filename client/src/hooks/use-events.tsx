import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useEvents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: events, isLoading, error } = useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to fetch events");
      return await res.json();
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (event: InsertEvent) => {
      const res = await fetch(api.events.create.path, {
        method: api.events.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
      toast({ title: "Event Created", description: "The event has been successfully scheduled." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to create event." });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertEvent> }) => {
      const url = buildUrl(api.events.update.path, { id });
      const res = await fetch(url, {
        method: api.events.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update event");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
      toast({ title: "Event Updated", description: "The event details have been modified." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update event." });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.events.delete.path, { id });
      const res = await fetch(url, { method: api.events.delete.method });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
      toast({ title: "Event Deleted", description: "The event has been removed." });
    },
  });

  return {
    events,
    isLoading,
    error,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: [api.events.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.events.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch event");
      return await res.json();
    },
    enabled: !!id,
  });
}

export function useRegisterEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventId: number) => {
      const url = buildUrl(api.events.register.path, { id: eventId });
      const res = await fetch(url, { method: api.events.register.method });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
      toast({ title: "Registered!", description: "You are now registered for this event." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Registration Failed", description: error.message });
    },
  });
}
