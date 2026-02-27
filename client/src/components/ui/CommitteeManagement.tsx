import { useState } from "react";
import { useCommittee } from "@/hooks/use-committee";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLE_LABELS: Record<string, string> = {
    committee: "Committee",
    organiser: "Organiser",
    coordinator: "Coordinator",
};

export function CommitteeManagement() {
    const { members, isLoading, createMember, updateMember, deleteMember, isCreating, isUpdating, isDeleting } = useCommittee();
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        designation: "",
        name: "",
        rollNo: "",
        year: "",
        branch: "",
        orderOffset: 0,
        memberRole: "committee" as "committee" | "organiser" | "coordinator",
    });

    const resetForm = () => {
        setFormData({ designation: "", name: "", rollNo: "", year: "", branch: "", orderOffset: 0, memberRole: "committee" });
        setEditingId(null);
    };

    const handleOpenDialog = (member?: any) => {
        if (member) {
            setEditingId(member.id);
            setFormData({
                designation: member.designation,
                name: member.name,
                rollNo: member.rollNo || "",
                year: member.year || "",
                branch: member.branch || "",
                orderOffset: member.orderOffset || 0,
                memberRole: member.memberRole || "committee",
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.designation) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Name and Designation are required." });
            return;
        }

        const payload = { ...formData, orderOffset: Number(formData.orderOffset) };

        if (editingId) {
            updateMember({ id: editingId, updates: payload }, {
                onSuccess: () => {
                    toast({ title: "Updated", description: "Member updated successfully." });
                    setIsModalOpen(false);
                },
                onError: (err: any) => toast({ variant: "destructive", title: "Failed to update", description: err.message }),
            });
        } else {
            createMember(payload, {
                onSuccess: () => {
                    toast({ title: "Created", description: "Member added successfully." });
                    setIsModalOpen(false);
                },
                onError: (err: any) => toast({ variant: "destructive", title: "Failed to create", description: err.message }),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to remove this member?")) {
            deleteMember(id, {
                onSuccess: () => toast({ title: "Deleted", description: "Member removed." }),
                onError: (err: any) => toast({ variant: "destructive", title: "Failed to delete", description: err.message }),
            });
        }
    };

    // Group members by role for display
    const grouped: Record<string, typeof members> = {
        committee: members?.filter(m => m.memberRole === "committee"),
        organiser: members?.filter(m => m.memberRole === "organiser"),
        coordinator: members?.filter(m => m.memberRole === "coordinator"),
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Committee, Organisers & Coordinators</h2>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="gap-2">
                            <Plus className="w-4 h-4" /> Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Member" : "Add Member"}</DialogTitle>
                            <DialogDescription>
                                Fill in the details. These appear on the public Team page.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label>Role / Section</Label>
                                    <Select
                                        value={formData.memberRole}
                                        onValueChange={(v) => setFormData({ ...formData, memberRole: v as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="committee">Committee Member</SelectItem>
                                            <SelectItem value="organiser">Organiser</SelectItem>
                                            <SelectItem value="coordinator">Coordinator</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Designation (e.g. PRESIDENT)</Label>
                                    <Input value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Roll Number</Label>
                                    <Input value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Year (e.g. 3rd YEAR)</Label>
                                    <Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Branch</Label>
                                    <Input value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Display Order (0 is first)</Label>
                                    <Input type="number" value={formData.orderOffset} onChange={(e) => setFormData({ ...formData, orderOffset: Number(e.target.value) })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating || isUpdating} className="w-full">
                                    {(isCreating || isUpdating) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Save Member
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    {(["committee", "organiser", "coordinator"] as const).map(role => (
                        <div key={role} className="rounded-md border bg-white">
                            <div className="px-4 py-2 bg-slate-50 border-b font-semibold text-slate-700 text-sm uppercase tracking-wide">
                                {ROLE_LABELS[role]}s
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Designation</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Roll No</TableHead>
                                        <TableHead>Year &amp; Branch</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!grouped[role]?.length ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                No {ROLE_LABELS[role].toLowerCase()}s added yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        grouped[role]?.map((m) => (
                                            <TableRow key={m.id}>
                                                <TableCell className="font-medium">{m.designation}</TableCell>
                                                <TableCell>{m.name}</TableCell>
                                                <TableCell>{m.rollNo || "-"}</TableCell>
                                                <TableCell>{[m.year, m.branch].filter(Boolean).join(" - ") || "-"}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(m)} disabled={isDeleting}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(m.id)} disabled={isDeleting}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
