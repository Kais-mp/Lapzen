"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

interface AuthorizationDetails {
  client: {
    name: string;
    icon_uri?: string;
  };
  redirect_uri: string;
  scopes?: string[];
}

function OAuthConsentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authorizationId = searchParams.get("authorization_id");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authDetails, setAuthDetails] = useState<AuthorizationDetails | null>(null);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const fetchAuthDetails = async () => {
      if (!authorizationId) {
        router.replace("/");
        return;
      }

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push(`/login?redirect=/oauth/consent?authorization_id=${authorizationId}`);
        return;
      }
      
      setUser(currentUser);

      try {
        const { data, error: authError } = await (supabase.auth as any).oauth.getAuthorizationDetails(authorizationId);
        
        if (authError) {
          setError(authError.message || "Failed to fetch authorization details");
          setLoading(false);
          return;
        }

        setAuthDetails(data);
      } catch (err) {
        setError("Failed to fetch authorization details");
      }
      
      setLoading(false);
    };

    fetchAuthDetails();
  }, [authorizationId, router]);

  const handleApprove = async () => {
    if (!authorizationId) return;
    
    setSubmitting(true);
    try {
      const { data, error: approveError } = await (supabase.auth as any).oauth.approveAuthorization(authorizationId);
      
      if (approveError) {
        setError(approveError.message || "Failed to approve authorization");
        setSubmitting(false);
        return;
      }

      if (data?.redirect_to) {
        window.location.href = data.redirect_to;
      }
    } catch (err) {
      setError("Failed to approve authorization");
      setSubmitting(false);
    }
  };

  const handleDeny = async () => {
    if (!authorizationId) return;
    
    setSubmitting(true);
    try {
      const { data, error: denyError } = await (supabase.auth as any).oauth.denyAuthorization(authorizationId);
      
      if (denyError) {
        setError(denyError.message || "Failed to deny authorization");
        setSubmitting(false);
        return;
      }

      if (data?.redirect_to) {
        window.location.href = data.redirect_to;
      }
    } catch (err) {
      setError("Failed to deny authorization");
      setSubmitting(false);
    }
  };

  const getScopeDescription = (scope: string): string => {
    const descriptions: Record<string, string> = {
      openid: "Access your identity",
      email: "View your email address",
      profile: "View your profile information",
      phone: "View your phone number",
    };
    return descriptions[scope] || scope;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-navy" />
          <p className="text-muted-foreground">Loading authorization details...</p>
        </div>
      </div>
    );
  }

  if (error || !authDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Authorization Error</CardTitle>
            <CardDescription>{error || "Unable to load authorization details"}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => router.push("/")}>
              Return Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mb-4">
            {authDetails.client.icon_uri ? (
              <img
                src={authDetails.client.icon_uri}
                alt={authDetails.client.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <Shield className="h-8 w-8 text-navy" />
            )}
          </div>
          <CardTitle className="text-xl">Authorize {authDetails.client.name}</CardTitle>
          <CardDescription>
            This application is requesting access to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {user?.email && (
            <div className="text-center text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{user.email}</span>
            </div>
          )}
          
          {authDetails.scopes && authDetails.scopes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">This application will be able to:</h3>
              <ul className="space-y-2">
                {authDetails.scopes.map((scope) => (
                  <li key={scope} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{getScopeDescription(scope)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p>
              By authorizing, you allow this application to access the above information. 
              You can revoke access at any time from your account settings.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDeny}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Deny
              </>
            )}
          </Button>
          <Button
            className="flex-1 bg-navy hover:bg-navy/90"
            onClick={handleApprove}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Authorize
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function OAuthConsentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-navy" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <OAuthConsentContent />
    </Suspense>
  );
}
