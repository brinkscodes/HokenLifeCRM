"use client";

import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Calendar, StickyNote, CheckSquare } from "lucide-react";

const typeConfig: Record<string, { icon: typeof Phone; label: string; color: string }> = {
  call: { icon: Phone, label: "Call", color: "text-blue-400" },
  email: { icon: Mail, label: "Email", color: "text-green-400" },
  meeting: { icon: Calendar, label: "Meeting", color: "text-purple-400" },
  note: { icon: StickyNote, label: "Note", color: "text-yellow-400" },
  task: { icon: CheckSquare, label: "Task", color: "text-orange-400" },
};

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contacts: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profiles: any;
}

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <StickyNote className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">No activities yet.</p>
        <p className="text-sm text-muted-foreground/60">
          Log your first call, email, or meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const config = typeConfig[activity.type] || typeConfig.note;
        const Icon = config.icon;
        const contact = Array.isArray(activity.contacts)
          ? activity.contacts[0]
          : activity.contacts;
        const profile = Array.isArray(activity.profiles)
          ? activity.profiles[0]
          : activity.profiles;
        const date = new Date(activity.created_at);
        const isLast = index === activities.length - 1;

        return (
          <div key={activity.id} className="relative flex gap-4 pb-6">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[17px] top-10 h-[calc(100%-24px)] w-px bg-border/50" />
            )}
            {/* Icon */}
            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card">
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs capitalize">
                  {config.label}
                </Badge>
                {contact && (
                  <span className="text-xs text-muted-foreground">
                    {contact.first_name} {contact.last_name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground/60">
                  {date.toLocaleDateString()} at{" "}
                  {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground/90">{activity.description}</p>
              {profile && (
                <p className="mt-1 text-xs text-muted-foreground/60">
                  by {profile.full_name}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
