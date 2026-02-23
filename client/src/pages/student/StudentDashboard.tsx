import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { useEvents } from "@/hooks/use-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, IdCard } from "lucide-react";

export default function StudentDashboard() {
    const { user } = useAuth();
    const { events } = useEvents();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
                    <p className="text-muted-foreground">Student Member Dashboard</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-2">
                                <Badge variant={user?.membershipStatus === 'approved' ? 'default' : 'secondary'} className="text-sm py-1">
                                    {user?.membershipStatus?.toUpperCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {events?.filter((e: any) => e.status === "upcoming").length || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My ID Card</CardTitle>
                            <IdCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center space-y-4">
                                {user?.idCardUrl ? (
                                    <>
                                        <div className="w-full flex justify-center">
                                            {user.idCardUrl.startsWith('data:application/pdf') ? (
                                                <div className="h-24 w-full border rounded flex items-center justify-center text-sm text-muted-foreground bg-muted">
                                                    PDF Document
                                                </div>
                                            ) : (
                                                <img src={user.idCardUrl} alt="ID Card" className="rounded-md border object-contain max-h-32" />
                                            )}
                                        </div>
                                        <Button className="w-full" asChild>
                                            <a href={user.idCardUrl} download={`ID_Card_${user.rollNumber || user.name}`}>
                                                Download ID Card
                                            </a>
                                        </Button>
                                    </>
                                ) : (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        No ID Card uploaded yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
