import { getClaims, getPoliciesForSelect } from "./actions";
import { ClaimsTable } from "./claims-table";
import { getAuthProfileOrNull } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export default async function ClaimsPage() {
  let claims: Awaited<ReturnType<typeof getClaims>> = [];
  let policies: Awaited<ReturnType<typeof getPoliciesForSelect>> = [];

  try {
    [claims, policies] = await Promise.all([
      getClaims(),
      getPoliciesForSelect(),
    ]);
  } catch {
    // Will be empty on first load
  }

  const profile = await getAuthProfileOrNull();
  const canEdit = profile ? canEditData(profile.role) : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Claims</h1>
        <p className="text-muted-foreground">Track and process insurance claims.</p>
      </div>
      <ClaimsTable claims={claims} policies={policies} canEdit={canEdit} />
    </div>
  );
}
