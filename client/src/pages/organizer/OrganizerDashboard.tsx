import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { useEvents } from "@/hooks/use-events";
import { Calendar, Users } from "lucide-react";
import { CSVUploader } from "@/components/ui/CSVUploader";
import { IDCardUploader } from "@/components/ui/IDCardUploader";
import { EventManagement } from "@/components/ui/EventManagement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function OrganizerDashboard() {
    const { events } = useEvents();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Organizer Control Panel</h1>
                        <p className="text-muted-foreground">Coordinate events, export reports, and oversee activities.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <IDCardUploader />
                    <CSVUploader onUploadSuccess={() => {
                        window.location.reload();
                    }} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard title="Total Events" value={events?.length || 0} icon={Calendar} />
                    <StatCard title="Active Events" value={events?.filter((e: any) => e.status === "upcoming").length || 0} icon={Users} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Event Management Hub</CardTitle>
                        <p className="text-sm text-muted-foreground">Schedule, update, or cancel CSI chapter events.</p>
                    </CardHeader>
                    <CardContent>
                        <EventManagement />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
