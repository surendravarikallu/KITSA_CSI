import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { useAdminUsers } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { IDCardUploader } from "@/components/ui/IDCardUploader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Members() {
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
                        <h1 className="text-3xl font-bold tracking-tight">Members Management</h1>
                        <p className="text-muted-foreground">Approve new members and import bulk rosters.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <IDCardUploader />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Member Roster</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={users || []} columns={userColumns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
