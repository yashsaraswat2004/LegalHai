import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@clerk/tanstack-react-start";
import { APP_HOME } from "@/lib/routes";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({
        to: "/sign-in",
        search: { redirect_url: pathname || APP_HOME },
      });
    }
  }, [isSignedIn, isLoaded, navigate, pathname]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-signal/30 border-t-signal animate-spin" />
          <p className="text-sm text-muted-foreground font-mono">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) return null;

  return <>{children}</>;
}
