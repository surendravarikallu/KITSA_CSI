import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
    Users,
    CalendarDays,
    Settings,
    Image as ImageIcon,
    MessageSquare,
    LogOut,
    LayoutDashboard,
    ArrowLeft,
    User as UserIcon,
    UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [location] = useLocation();
    const { user, logout } = useAuth();

    if (!user) return null;

    const role = user.role;

    const navItems = [
        {
            title: "Dashboard",
            href: `/${role}/dashboard`,
            icon: LayoutDashboard,
            roles: ["admin", "organizer", "student"]
        },
        {
            title: "Members",
            href: "/admin/members",
            icon: Users,
            roles: ["admin"]
        },
        {
            title: "Import Users",
            href: "/admin/import",
            icon: UserPlus,
            roles: ["admin", "organizer"]
        },
        {
            title: "Events Manage",
            href: "/organizer/events",
            icon: CalendarDays,
            roles: ["admin", "organizer"]
        },
        {
            title: "My Events",
            href: "/student/events",
            icon: CalendarDays,
            roles: ["student"]
        },
        {
            title: "Gallery Manage",
            href: "/admin/gallery",
            icon: ImageIcon,
            roles: ["admin", "organizer"]
        },
        {
            title: "Messages",
            href: "/admin/messages",
            icon: MessageSquare,
            roles: ["admin"]
        },
        {
            title: "Profile",
            href: "/profile",
            icon: UserIcon,
            roles: ["admin", "organizer", "student"]
        }
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(role));

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-background flex flex-col hidden md:flex">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <p className="text-sm text-muted-foreground capitalize">{role} Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {filteredItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <a className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                location === item.href
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "hover:bg-muted"
                            )}>
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </a>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={() => logout()}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back to Home</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                            Welcome, {user.name}
                        </span>
                        <Link href="/profile">
                            <Button variant="outline" size="sm" className="gap-2">
                                <UserIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
