import { getPolicies, getContactsForSelect } from "./actions";
import { PoliciesTable } from "./policies-table";
import { getAuthProfileOrNull } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export default async function PoliciesPage() {
  let policies: Awaited<ReturnType<typeof getPolicies>> = [];
  let contacts: Awaited<ReturnType<typeof getContactsForSelect>> = [];

  try {
    [policies, contacts] = await Promise.all([
      getPolicies(),
      getContactsForSelect(),
    ]);
  } catch {
    // Will be empty on first load
  }

  const profile = await getAuthProfileOrNull();
  const canEdit = profile ? canEditData(profile.role) : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Policies</h1>
        <p className="text-muted-foreground">Track and manage insurance policies.</p>
      </div>
      <PoliciesTable policies={policies} contacts={contacts} canEdit={canEdit} />
    </div>
  );
}
