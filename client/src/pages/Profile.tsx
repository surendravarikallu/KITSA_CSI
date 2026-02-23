import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@shared/schema";

type UserEvent = Event & { registrationStatus?: string };

export default function Profile() {
    const { user } = useAuth();

    const { data: myEvents, isLoading } = useQuery<UserEvent[]>({
        queryKey: [api.auth.myEvents.path],
        queryFn: async () => {
            const res = await fetch(api.auth.myEvents.path);
            if (!res.ok) throw new Error("Failed to fetch registered events");
            return res.json();
        }
    });

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold">Please log in to view your profile.</h1>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto max-w-4xl py-6 space-y-8">
                <h1 className="font-display font-bold text-4xl">My Profile</h1>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* User Info Card */}
                    <Card className="md:col-span-1 border-slate-200 shadow-sm h-fit">
                        <CardHeader>
                            <CardTitle>User Info</CardTitle>
                            <CardDescription>Your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Name</p>
                                <p className="font-semibold">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Email</p>
                                <p className="font-semibold">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Role</p>
                                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Membership Status</p>
                                <Badge
                                    variant={user.membershipStatus === 'approved' ? 'default' : user.membershipStatus === 'pending' ? 'secondary' : 'destructive'}
                                    className="uppercase text-xs"
                                >
                                    {user.membershipStatus}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registered Events */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="font-display text-2xl font-semibold border-b pb-4">Registered Events</h2>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : !myEvents || myEvents.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-12 text-center text-slate-500">
                                    You haven't registered for any events yet.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {myEvents.map((event) => (
                                    <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                                    <Badge variant="outline" className="text-xs uppercase">{event.registrationStatus}</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                    <div className="flex items-center">
                                                        <CalendarDays className="w-4 h-4 mr-1.5 text-slate-400" />
                                                        {format(new Date(event.date), "PPP")}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                                                        {event.venue}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
