import { useState } from "react";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EventManagement() {
    const { events, isLoading, createEvent, updateEvent, deleteEvent, isCreating, isUpdating, isDeleting } = useEvents();
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        venue: "",
        capacity: 100,
        status: "upcoming" as "upcoming" | "completed" | "cancelled",
    });

    const resetForm = () => {
        setFormData({ title: "", description: "", date: "", venue: "", capacity: 100, status: "upcoming" });
        setEditingId(null);
    };

    const handleOpenDialog = (event?: any) => {
        if (event) {
            setEditingId(event.id);
            setFormData({
                title: event.title,
                description: event.description,
                date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local
                venue: event.venue,
                capacity: event.capacity,
                status: event.status,
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.venue) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Title, Date, and Venue are required." });
            return;
        }

        const payload = {
            ...formData,
            date: new Date(formData.date),
            capacity: Number(formData.capacity)
        };

        if (editingId) {
            updateEvent({ id: editingId, updates: payload }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            });
        } else {
            createEvent(payload, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to completely delete this event? (Cancellation is preferred)")) {
            deleteEvent(id);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Event Log</h2>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="gap-2">
                            <Plus className="w-4 h-4" /> Create Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Event" : "Create New Event"}</DialogTitle>
                            <DialogDescription>
                                Schedule and configure a CSI technical or non-technical event.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Event Title</Label>
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date & Time</Label>
                                    <Input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Venue Location</Label>
                                    <Input value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Attendee Capacity Max</Label>
                                    <Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} required min={1} />
                                </div>
                                {editingId && (
                                    <div className="space-y-2">
                                        <Label>Event Status</Label>
                                        <select
                                            className="w-full border rounded-md h-10 px-3 py-2 text-sm"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating || isUpdating} className="w-full">
                                    {(isCreating || isUpdating) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Confirm Settings
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
                            <TableHead>Event Title</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Venue</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Manage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : !events || events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No events exist yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events?.map((e: any) => (
                                <TableRow key={e.id}>
                                    <TableCell className="font-medium">{e.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <Calendar className="w-3 h-3 text-muted-foreground" />
                                            {new Date(e.date).toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate">{e.venue}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${e.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                e.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {e.status.toUpperCase()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(e)} disabled={isDeleting}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(e.id)} disabled={isDeleting}>
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
