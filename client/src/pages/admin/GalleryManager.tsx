import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Image as ImageIcon, ExternalLink, Loader2 } from "lucide-react";
import { api } from "@shared/routes";
import { DataTable } from "@/components/ui/DataTable";
import type { Event, GalleryItem } from "@shared/schema";

export default function GalleryManager() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [driveUrl, setDriveUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [selectedEventId, setSelectedEventId] = useState<string>("");

    const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
        queryKey: [api.events.list.path],
        queryFn: async () => {
            const res = await fetch(api.events.list.path);
            if (!res.ok) throw new Error("Failed to fetch events");
            return res.json();
        }
    });

    const { data: galleryItems, isLoading: isLoadingGallery } = useQuery<GalleryItem[]>({
        queryKey: [api.gallery.list.path],
        queryFn: async () => {
            const res = await fetch(api.gallery.list.path);
            if (!res.ok) throw new Error("Failed to fetch gallery");
            return res.json();
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (data: { imageUrl: string, caption?: string, eventId?: number }) => {
            const res = await fetch(api.gallery.upload.path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to save gallery link");
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Google Drive link saved to the gallery." });
            setDriveUrl("");
            setCaption("");
            setSelectedEventId("");
            queryClient.invalidateQueries({ queryKey: [api.gallery.list.path] });
        },
        onError: (err: Error) => {
            toast({ variant: "destructive", title: "Error", description: err.message });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!driveUrl) return toast({ variant: "destructive", title: "Error", description: "Please enter a Google Drive link." });

        uploadMutation.mutate({
            imageUrl: driveUrl,
            caption: caption || undefined,
            eventId: selectedEventId ? parseInt(selectedEventId) : undefined
        });
    };

    const columns: any[] = [
        {
            header: "Google Drive Link",
            accessorKey: (row: GalleryItem) => (
                <a href={row.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                    <Link className="h-3 w-3" /> View Folder
                </a>
            )
        },
        { header: "Caption", accessorKey: "caption" },
        {
            header: "Linked Event",
            accessorKey: (row: GalleryItem) => {
                const event = events?.find(e => e.id === row.eventId);
                return event ? event.title : "None";
            }
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gallery Manager</h1>
                        <p className="text-muted-foreground">Attach Google Drive folders to events to share photos.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Add Drive Link</CardTitle>
                            <CardDescription>Provide a public Google Drive sharing link containing event photos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Google Drive URL</Label>
                                    <Input
                                        placeholder="https://drive.google.com/drive/folders/..."
                                        type="url"
                                        value={driveUrl}
                                        onChange={(e) => setDriveUrl(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Linked Event (Optional)</Label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={selectedEventId}
                                        onChange={(e) => setSelectedEventId(e.target.value)}
                                    >
                                        <option value="">-- No Event --</option>
                                        {events?.map(ev => (
                                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Caption (Optional)</Label>
                                    <Input
                                        placeholder="e.g. Technical Symposium 2024 Photos"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
                                    {uploadMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Save Gallery Link
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Existing Gallery Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={galleryItems || []} columns={columns} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
