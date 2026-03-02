import { getTeamMembers } from "./actions";
import { TeamTable } from "./team-table";

export default async function TeamPage() {
  let teamData = null;
  try {
    teamData = await getTeamMembers();
  } catch {
    // Permission denied or not authenticated
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          Manage your team members and their roles.
        </p>
      </div>
      {teamData ? (
        <TeamTable
          members={teamData.members}
          currentUserId={teamData.currentUserId}
        />
      ) : (
        <div className="rounded-lg border border-border/50 bg-card/80 p-8 text-center backdrop-blur-sm">
          <p className="text-muted-foreground">
            You don&apos;t have permission to manage the team.
          </p>
        </div>
      )}
    </div>
  );
}
