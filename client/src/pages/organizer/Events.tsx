import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EventManagement } from "@/components/ui/EventManagement";

export default function OrganizerEvents() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
                    <p className="text-muted-foreground">Schedule, update, or cancel upcoming events for the student chapter.</p>
                </div>

                <div className="bg-card border rounded-lg shadow-sm">
                    <div className="p-6">
                        <EventManagement />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
