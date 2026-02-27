import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { CommitteeMember, InsertCommitteeMember } from "@shared/schema";

export function useCommittee() {
    const {
        data: members,
        isLoading,
        error,
    } = useQuery<CommitteeMember[]>({
        queryKey: ["/api/committee"],
    });

    const createMutation = useMutation({
        mutationFn: async (member: InsertCommitteeMember) => {
            const res = await fetch("/api/admin/committee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(member),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/committee"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertCommitteeMember> }) => {
            const res = await fetch(`/api/admin/committee/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/committee"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/admin/committee/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(await res.text());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/committee"] });
        },
    });

    // Derived filtered lists by role
    const committeeOnly = members?.filter(m => m.memberRole === "committee") ?? [];
    const organisers = members?.filter(m => m.memberRole === "organiser") ?? [];
    const coordinators = members?.filter(m => m.memberRole === "coordinator") ?? [];

    return {
        members,
        committeeOnly,
        organisers,
        coordinators,
        isLoading,
        error,
        createMember: createMutation.mutate,
        updateMember: updateMutation.mutate,
        deleteMember: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
