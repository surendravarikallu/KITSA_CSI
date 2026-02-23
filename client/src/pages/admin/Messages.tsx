import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/DataTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function Messages() {
    const { data: messages, isLoading } = useQuery({
        queryKey: ["/api/contacts"],
        queryFn: async () => {
            const res = await fetch("/api/contacts");
            if (!res.ok) throw new Error("Failed to fetch messages");
            return res.json();
        }
    });

    const columns = [
        { header: "Date", accessorKey: (row: any) => format(new Date(row.createdAt), "PPP") },
        { header: "Name", accessorKey: "name" },
        { header: "Email", accessorKey: "email" },
        { header: "Message", accessorKey: "message" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
                    <p className="text-muted-foreground">Read and respond to messages submitted via the public contact form.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inbox</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={messages || []} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
