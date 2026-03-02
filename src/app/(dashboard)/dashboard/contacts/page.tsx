import { getContacts } from "./actions";
import { ContactsTable } from "./contacts-table";
import { getAuthProfileOrNull } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export default async function ContactsPage() {
  let contacts = [];
  try {
    contacts = await getContacts();
  } catch {
    // Will be empty on first load or if user has no org yet
  }

  const profile = await getAuthProfileOrNull();
  const canEdit = profile ? canEditData(profile.role) : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contacts</h1>
        <p className="text-muted-foreground">Manage your clients and prospects.</p>
      </div>
      <ContactsTable contacts={contacts} canEdit={canEdit} />
    </div>
  );
}
