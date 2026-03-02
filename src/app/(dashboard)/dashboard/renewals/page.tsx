import { getUpcomingRenewals } from "./actions";
import { RenewalsTable } from "./renewals-table";

export default async function RenewalsPage() {
  let renewals = [];
  try {
    renewals = await getUpcomingRenewals();
  } catch {
    // Will be empty on first load or if user has no org yet
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Renewals</h1>
        <p className="text-muted-foreground">
          Track upcoming policy renewals and expirations.
        </p>
      </div>
      <RenewalsTable renewals={renewals} />
    </div>
  );
}
