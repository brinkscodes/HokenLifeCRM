"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateProfile, updateOrganization } from "./actions";
import { User, Building2, CreditCard } from "lucide-react";
import type { UserRole } from "@/types/database";
import { canManageOrg } from "@/lib/permissions";

interface SettingsFormsProps {
  profile: {
    full_name: string;
    email: string;
    role: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    organizations: any;
  };
  email: string | undefined;
}

export function SettingsForms({ profile, email }: SettingsFormsProps) {
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgSaved, setOrgSaved] = useState(false);

  const role = profile.role as UserRole;
  const isManager = canManageOrg(role);

  const org = Array.isArray(profile.organizations)
    ? profile.organizations[0]
    : profile.organizations;

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSaved(false);
    await updateProfile(new FormData(e.currentTarget));
    setProfileLoading(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  async function handleOrgSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOrgLoading(true);
    setOrgSaved(false);
    await updateOrganization(new FormData(e.currentTarget));
    setOrgLoading(false);
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 3000);
  }

  async function handleUpgrade(plan: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  const planLabel = org?.plan || "free";
  const trialEnds = org?.trial_ends_at
    ? new Date(org.trial_ends_at)
    : null;
  const trialActive = trialEnds && trialEnds > new Date();

  return (
    <div className="space-y-6">
      {/* Profile — all roles can edit their own name */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile.full_name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email || ""}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label>Role</Label>
              <Badge variant="secondary" className="capitalize">
                {profile.role}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={profileLoading}>
                {profileLoading ? "Saving..." : "Save changes"}
              </Button>
              {profileSaved && (
                <span className="text-sm text-primary">Saved!</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Organization — admin/owner only */}
      {isManager && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Organization</CardTitle>
            </div>
            <CardDescription>Manage your agency settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrgSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org_name">Organization name</Label>
                <Input
                  id="org_name"
                  name="org_name"
                  defaultValue={org?.name || ""}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={orgLoading}>
                  {orgLoading ? "Saving..." : "Save changes"}
                </Button>
                {orgSaved && (
                  <span className="text-sm text-primary">Saved!</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Billing — admin/owner only */}
      {isManager && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Billing</CardTitle>
            </div>
            <CardDescription>Manage your subscription plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Current plan:</span>
              <Badge
                className={
                  planLabel === "free"
                    ? ""
                    : "bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black"
                }
                variant={planLabel === "free" ? "secondary" : "default"}
              >
                {planLabel.charAt(0).toUpperCase() + planLabel.slice(1)}
              </Badge>
              {trialActive && (
                <span className="text-xs text-muted-foreground">
                  Trial ends {trialEnds.toLocaleDateString()}
                </span>
              )}
            </div>

            {(planLabel === "free" || planLabel === "starter") && (
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  {planLabel === "free"
                    ? "Upgrade to unlock all features."
                    : "Upgrade to Professional for unlimited contacts and team collaboration."}
                </p>
                <div className="flex gap-2">
                  {planLabel === "free" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpgrade("starter")}
                    >
                      Starter — $29/mo
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90"
                    onClick={() => handleUpgrade("professional")}
                  >
                    Professional — $79/mo
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
