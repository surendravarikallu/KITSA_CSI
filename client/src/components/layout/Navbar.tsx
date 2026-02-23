import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User as UserIcon, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if we are on the home page where the transparent navbar is needed
  const isHomePage = location === "/";
  // The navbar should be transparent ONLY on the home page AND when not scrolled
  const isTransparent = isHomePage && !isScrolled;

  const links = [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#team", label: "Team" },
    { href: "/#why-us", label: "Why Us" },
    { href: "/#events", label: "Events" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/#membership", label: "Membership" },
    { href: "/#contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  // Do not render the public Navbar on protected dashboard or profile pages
  if (
    location.startsWith("/admin/") ||
    location.startsWith("/organizer/") ||
    location.startsWith("/student/") ||
    location.startsWith("/profile")
  ) {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isTransparent
          ? "bg-transparent text-white"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b text-foreground shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        {/* Logo and College Name */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="/college.webp"
            alt="KITS Logo"
            className="h-16 w-auto bg-white rounded-md p-1"
          />
          <div className="flex flex-col">
            <span className={cn(
              "font-display font-bold text-xl md:text-2xl tracking-tight transition-colors",
              isTransparent ? "text-white" : "text-primary"
            )}>
              KITSA CSI
            </span>
            <span className={cn(
              "text-[0.6rem] md:text-xs font-medium tracking-wider hidden sm:block capitalize",
              isTransparent ? "text-slate-200" : "text-slate-500"
            )}>
              Kits Akshar Institute of Technology
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => {
            const isActive = location === "/" && window.location.hash === link.href.replace('/', '');
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-blue-400",
                  isActive
                    ? (isTransparent ? "text-blue-300" : "text-primary")
                    : (isTransparent ? "text-slate-100" : "text-muted-foreground")
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {(user.role === 'admin' || user.role === 'organizer' || user.role === 'student') && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.role}/dashboard`}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "md:hidden p-2 transition-colors",
            isTransparent ? "text-white hover:text-slate-200" : "text-muted-foreground hover:text-primary"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background animate-in slide-in-from-top-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block text-sm font-medium p-2 rounded-md hover:bg-muted",
                location === "/" && window.location.hash === link.href.replace('/', '') ? "bg-muted text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t space-y-2">
            {user ? (
              <>
                <div className="px-2 text-sm font-medium text-muted-foreground mb-2">Signed in as {user.name}</div>
                {(user.role === 'admin' || user.role === 'organizer' || user.role === 'student') && (
                  <Link href={`/${user.role}/dashboard`} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => { logout(); setIsOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
