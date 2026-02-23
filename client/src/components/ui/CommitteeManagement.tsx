import { useState } from "react";
import { useCommittee } from "@/hooks/use-committee";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CommitteeManagement() {
    const { members, isLoading, createMember, updateMember, deleteMember, isCreating, isUpdating, isDeleting } = useCommittee();
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        designation: "",
        name: "",
        rollNo: "",
        year: "",
        branch: "",
        orderOffset: 0
    });

    const resetForm = () => {
        setFormData({ designation: "", name: "", rollNo: "", year: "", branch: "", orderOffset: 0 });
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
                orderOffset: member.orderOffset || 0
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

        const payload = {
            ...formData,
            orderOffset: Number(formData.orderOffset)
        };

        if (editingId) {
            updateMember({ id: editingId, updates: payload }, {
                onSuccess: () => {
                    toast({ title: "Updated", description: "Committee member updated successfully." });
                    setIsModalOpen(false);
                },
                onError: (err: any) => toast({ variant: "destructive", title: "Failed to update", description: err.message })
            });
        } else {
            createMember(payload, {
                onSuccess: () => {
                    toast({ title: "Created", description: "Committee member added successfully." });
                    setIsModalOpen(false);
                },
                onError: (err: any) => toast({ variant: "destructive", title: "Failed to create", description: err.message })
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to remove this committee member?")) {
            deleteMember(id, {
                onSuccess: () => toast({ title: "Deleted", description: "Committee member removed." }),
                onError: (err: any) => toast({ variant: "destructive", title: "Failed to delete", description: err.message })
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Committee Members</h2>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="gap-2">
                            <Plus className="w-4 h-4" /> Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Committee Member" : "Add Committee Member"}</DialogTitle>
                            <DialogDescription>
                                Fill in the details. These will appear exactly as typed on the public Landing Page.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Designation</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Year & Branch</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : members?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No committee members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            members?.map((m) => (
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
        </div>
    );
}
