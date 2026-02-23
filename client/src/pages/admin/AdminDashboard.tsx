import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { useAdminStats, useAdminUsers } from "@/hooks/use-admin";
import { Users, Calendar, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDCardUploader } from "@/components/ui/IDCardUploader";
import { CommitteeManagement } from "@/components/ui/CommitteeManagement";
import { EventManagement } from "@/components/ui/EventManagement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
    const { data: stats } = useAdminStats();
    const { users, approveUser, isApproving } = useAdminUsers();

    const userColumns = [
        { header: "Name", accessorKey: "name" },
        { header: "Email", accessorKey: "email" },
        { header: "Role", accessorKey: "role" },
        { header: "Status", accessorKey: "membershipStatus" },
        {
            header: "Action",
            accessorKey: (row: any) => row.membershipStatus === "pending" ? (
                <Button
                    size="sm"
                    onClick={() => approveUser(row.id)}
                    disabled={isApproving}
                >
                    Approve
                </Button>
            ) : "Approved"
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage users, events, and chapter statistics.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <IDCardUploader />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Members" value={stats?.totalMembers || 0} icon={Users} />
                    <StatCard title="Active Events" value={stats?.activeEvents || 0} icon={Activity} />
                    <StatCard title="Pending Approvals" value={stats?.pendingApprovals || 0} icon={Clock} />
                    <StatCard title="Total Registrations" value={stats?.totalRegistrations || 0} icon={Calendar} />
                </div>

                <div className="space-y-4 shadow-sm border rounded-lg p-4 bg-background">
                    <h2 className="text-xl font-semibold">Recent Member Requests</h2>
                    <DataTable data={users || []} columns={userColumns} />
                </div>

                {/* Committee Management Region */}
                <Card>
                    <CardHeader>
                        <CardTitle>CSI Organization Team</CardTitle>
                        <p className="text-sm text-muted-foreground">Manage the active members representing the CSI chapter on the public landing page.</p>
                    </CardHeader>
                    <CardContent>
                        <CommitteeManagement />
                    </CardContent>
                </Card>

                {/* Event Management Region */}
                <Card>
                    <CardHeader>
                        <CardTitle>Event Management Hub</CardTitle>
                        <p className="text-sm text-muted-foreground">Schedule, update, or cancel upcoming events globally.</p>
                    </CardHeader>
                    <CardContent>
                        <EventManagement />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
