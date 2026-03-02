import { getActivities, getContactsForSelect } from "./actions";
import { ActivityTimeline } from "./activity-timeline";
import { ActivityForm } from "./activity-form";
import { getAuthProfileOrNull } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export default async function ActivitiesPage() {
  let activities: Awaited<ReturnType<typeof getActivities>> = [];
  let contacts: Awaited<ReturnType<typeof getContactsForSelect>> = [];
  try {
    [activities, contacts] = await Promise.all([
      getActivities(),
      getContactsForSelect(),
    ]);
  } catch {
    // Will be empty on first load or if user has no org yet
  }

  const profile = await getAuthProfileOrNull();
  const canEdit = profile ? canEditData(profile.role) : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
          <p className="text-muted-foreground">
            Track calls, emails, meetings, and notes.
          </p>
        </div>
        {canEdit && <ActivityForm contacts={contacts} />}
      </div>
      <ActivityTimeline activities={activities} />
    </div>
  );
}
