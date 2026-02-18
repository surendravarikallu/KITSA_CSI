import { useAuth } from "@/hooks/use-auth";
import { useAdminStats, useAdminUsers } from "@/hooks/use-admin";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats } = useAdminStats();
  const { users, approveUser, isApproving } = useAdminUsers();

  if (authLoading) return null;
  
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    setLocation("/");
    return null;
  }

  const pendingMembers = users?.filter(u => u.membershipStatus === 'pending') || [];
  const activeMembers = users?.filter(u => u.membershipStatus === 'active') || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display font-bold text-3xl">Admin Dashboard</h1>
          <Button variant="outline">Export Reports</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">4 upcoming this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              <Clock className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingApprovals || 0}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Pending Member Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  No pending approvals!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            onClick={() => approveUser(member.id)}
                            disabled={isApproving}
                          >
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Members Section */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeMembers.slice(0, 5).map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="capitalize">{member.role}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
