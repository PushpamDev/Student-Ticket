import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <img src="/assests/download.jpeg" alt="Logo" className="h-6 w-6" />
          <span>RVM CAD Student Support</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {!user && (
            <NavLink to="/" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              Home
            </NavLink>
          )}
          {user && (
            <>
              {user.role === "student" && (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/tickets/new" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                    Raise Ticket
                  </NavLink>
                </>
              )}
              {user.role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  Admin
                </NavLink>
              )}
              {user.role === "placement" && (
                <NavLink to="/placement" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>Placement</NavLink>
              )}
              {user.role === "superadmin" && (
                <NavLink to="/super-admin" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>Super Admin</NavLink>
              )}
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
              <Button asChild size="sm"><Link to="/register">Create account</Link></Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground hidden sm:block">{user.name} · {user.role}</div>
              <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}