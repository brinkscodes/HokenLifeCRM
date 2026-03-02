import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, ShieldAlert, Target, DollarSign, ArrowUpRight } from "lucide-react";
import { PoliciesByTypeChart, LeadsByStatusChart } from "@/components/charts/dashboard-charts";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  // Fetch real counts + chart data
  const [
    contactsRes,
    policiesRes,
    claimsRes,
    leadsRes,
    recentContactsRes,
    upcomingPoliciesRes,
    totalPremiumRes,
    policyTypesRes,
    leadStatusesRes,
  ] = await Promise.all([
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("policies").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("claims").select("*", { count: "exact", head: true }).in("status", ["open", "in_review"]),
    supabase.from("leads").select("*", { count: "exact", head: true }).in("status", ["new", "contacted", "qualified", "proposal"]),
    supabase.from("contacts").select("id, first_name, last_name, email, type, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("policies").select("id, policy_number, end_date, contacts(first_name, last_name)").eq("status", "active").order("end_date", { ascending: true }).limit(5),
    supabase.from("policies").select("premium").eq("status", "active"),
    supabase.from("policies").select("type").eq("status", "active"),
    supabase.from("leads").select("status"),
  ]);

  const totalContacts = contactsRes.count ?? 0;
  const activePolicies = policiesRes.count ?? 0;
  const openClaims = claimsRes.count ?? 0;
  const activeLeads = leadsRes.count ?? 0;
  const recentContacts = recentContactsRes.data ?? [];
  const upcomingPolicies = upcomingPoliciesRes.data ?? [];
  const totalPremium = (totalPremiumRes.data ?? []).reduce((sum, p) => sum + (p.premium || 0), 0);

  // Aggregate policy types for chart
  const policyTypeCounts: Record<string, number> = {};
  (policyTypesRes.data ?? []).forEach((p) => {
    policyTypeCounts[p.type] = (policyTypeCounts[p.type] || 0) + 1;
  });
  const policyTypeData = Object.entries(policyTypeCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Aggregate lead statuses for chart
  const leadStatusCounts: Record<string, number> = {};
  (leadStatusesRes.data ?? []).forEach((l) => {
    leadStatusCounts[l.status] = (leadStatusCounts[l.status] || 0) + 1;
  });
  const leadStatusOrder = ["new", "contacted", "qualified", "proposal", "won", "lost"];
  const leadStatusData = leadStatusOrder
    .filter((s) => leadStatusCounts[s])
    .map((s) => ({ name: s, count: leadStatusCounts[s] }));

  const stats = [
    { label: "Total Contacts", value: totalContacts.toString(), icon: Users },
    { label: "Active Policies", value: activePolicies.toString(), icon: FileText },
    { label: "Open Claims", value: openClaims.toString(), icon: ShieldAlert },
    { label: "Active Leads", value: activeLeads.toString(), icon: Target },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">Hi, {firstName}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Premium Card */}
      {totalPremium > 0 && (
        <Card className="border-border/50 bg-gradient-to-r from-[#92FE9D]/5 to-[#00C9FF]/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Active Premiums
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] bg-clip-text text-transparent">
              ${totalPremium.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">across {activePolicies} active policies</p>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PoliciesByTypeChart data={policyTypeData} />
        <LeadsByStatusChart data={leadStatusData} />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Contacts */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Contacts</CardTitle>
            <a href="/dashboard/contacts" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No contacts yet. Start by adding your first contact.
              </p>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{contact.first_name} {contact.last_name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email || "No email"}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize text-xs">{contact.type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Renewals */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
            <a href="/dashboard/renewals" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </CardHeader>
          <CardContent>
            {upcomingPolicies.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming renewals. Add policies to track renewals automatically.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingPolicies.map((policy) => {
                  const endDate = new Date(policy.end_date);
                  const daysUntil = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntil <= 30;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const contactData = policy.contacts as any;
                  const contact = Array.isArray(contactData) ? contactData[0] : contactData;
                  return (
                    <div key={policy.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium font-mono">{policy.policy_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact ? `${contact.first_name} ${contact.last_name}` : "Unknown"}
                        </p>
                      </div>
                      <Badge variant={isUrgent ? "destructive" : "secondary"} className="text-xs">
                        {daysUntil <= 0 ? "Expired" : `${daysUntil}d left`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
