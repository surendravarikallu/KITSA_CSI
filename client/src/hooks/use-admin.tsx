import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAdminStats() {
  return useQuery({
    queryKey: [api.admin.stats.path],
    queryFn: async () => {
      const res = await fetch(api.admin.stats.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    },
  });
}

export function useAdminUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: [api.admin.users.path],
    queryFn: async () => {
      const res = await fetch(api.admin.users.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    },
  });

  const approveUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.approveMember.path, { id });
      const res = await fetch(url, { method: api.admin.approveMember.method });
      if (!res.ok) throw new Error("Failed to approve user");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
      queryClient.invalidateQueries({ queryKey: [api.admin.stats.path] });
      toast({ title: "User Approved", description: "Membership has been activated." });
    },
  });

  return {
    users,
    isLoading,
    approveUser: approveUserMutation.mutate,
    isApproving: approveUserMutation.isPending,
  };
}
