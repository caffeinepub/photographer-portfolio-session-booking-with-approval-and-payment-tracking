import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../../hooks/useQueries";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Show loading while checking authentication or admin status
  if (loginStatus === "initializing" || (isAuthenticated && isCheckingAdmin)) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Alert>
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">
            Authentication Required
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>You need to be logged in to access the dashboard.</p>
            <div className="flex gap-3">
              <Button asChild variant="default">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">
            Access Denied
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>
              You don't have permission to access this area. Only the
              photographer can access the dashboard.
            </p>
            <div className="flex gap-3">
              <Button asChild variant="default">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
