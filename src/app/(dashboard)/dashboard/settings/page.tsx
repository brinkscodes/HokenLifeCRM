import { getProfile } from "./actions";
import { SettingsForms } from "./settings-forms";

export default async function SettingsPage() {
  let profileData = null;
  try {
    profileData = await getProfile();
  } catch {
    // Will fail if user has no profile yet
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and organization.</p>
      </div>
      {profileData ? (
        <SettingsForms profile={profileData.profile} email={profileData.email} />
      ) : (
        <div className="rounded-lg border border-border/50 bg-card/80 p-8 text-center backdrop-blur-sm">
          <p className="text-muted-foreground">Unable to load settings. Please try again.</p>
        </div>
      )}
    </div>
  );
}
