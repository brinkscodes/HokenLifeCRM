import { getLeads, getContactsForLeads, getAgentsForAssignment } from "./actions";
import { LeadsTable } from "./leads-table";
import { getAuthProfileOrNull } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export default async function LeadsPage() {
  let leads: Awaited<ReturnType<typeof getLeads>> = [];
  let contacts: Awaited<ReturnType<typeof getContactsForLeads>> = [];
  let agents: Awaited<ReturnType<typeof getAgentsForAssignment>> = [];

  try {
    [leads, contacts, agents] = await Promise.all([
      getLeads(),
      getContactsForLeads(),
      getAgentsForAssignment(),
    ]);
  } catch {
    // Will be empty on first load
  }

  const profile = await getAuthProfileOrNull();
  const canEdit = profile ? canEditData(profile.role) : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground">Manage your sales pipeline.</p>
      </div>
      <LeadsTable leads={leads} contacts={contacts} agents={agents} canEdit={canEdit} />
    </div>
  );
}
