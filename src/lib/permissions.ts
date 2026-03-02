import type { UserRole } from "@/types/database";

/**
 * Role hierarchy (higher number = more privileges):
 *   viewer (0) < agent (1) < admin (2) < owner (3)
 */
const ROLE_LEVEL: Record<UserRole, number> = {
  viewer: 0,
  agent: 1,
  admin: 2,
  owner: 3,
};

export function roleLevel(role: UserRole): number {
  return ROLE_LEVEL[role] ?? 0;
}

/** Can create, update, and delete CRM records (contacts, policies, claims, leads, activities) */
export function canEditData(role: UserRole): boolean {
  return roleLevel(role) >= ROLE_LEVEL.agent;
}

/** Can manage organization settings (name, billing) */
export function canManageOrg(role: UserRole): boolean {
  return roleLevel(role) >= ROLE_LEVEL.admin;
}

/** Can invite/remove team members and change roles */
export function canManageTeam(role: UserRole): boolean {
  return roleLevel(role) >= ROLE_LEVEL.admin;
}

/** Can change another user's role (only owner can promote to admin) */
export function canChangeRole(actorRole: UserRole, targetCurrentRole: UserRole, targetNewRole: UserRole): boolean {
  const actor = roleLevel(actorRole);
  // Must be admin+ to change roles at all
  if (actor < ROLE_LEVEL.admin) return false;
  // Can't change someone with equal or higher role
  if (roleLevel(targetCurrentRole) >= actor) return false;
  // Can't promote someone to equal or higher than your own role
  if (roleLevel(targetNewRole) >= actor) return false;
  return true;
}

/** Can remove a team member */
export function canRemoveMember(actorRole: UserRole, targetRole: UserRole): boolean {
  return roleLevel(actorRole) > roleLevel(targetRole);
}

/** Sidebar items visible to this role */
export function getVisibleNavItems(role: UserRole) {
  const items = [
    { key: "dashboard", minRole: "viewer" as UserRole },
    { key: "contacts", minRole: "viewer" as UserRole },
    { key: "policies", minRole: "viewer" as UserRole },
    { key: "claims", minRole: "viewer" as UserRole },
    { key: "leads", minRole: "viewer" as UserRole },
    { key: "activities", minRole: "viewer" as UserRole },
    { key: "renewals", minRole: "viewer" as UserRole },
    { key: "team", minRole: "admin" as UserRole },
    { key: "settings", minRole: "admin" as UserRole },
  ];

  return items
    .filter((item) => roleLevel(role) >= roleLevel(item.minRole))
    .map((item) => item.key);
}
