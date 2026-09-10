import { useMemo } from "react";
import { Activity, Code2, GitCommitHorizontal, Star } from "lucide-react";
import type { GithubEventSummary, GithubRepoSummary, GithubUserSummary } from "@/types";
import { profile } from "@/data/profile";
import { projects as curatedProjects } from "@/data/projects";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, timeAgo } from "@/lib/utils";

const REPO_NAMES: Record<string, string> = {
  "bq-play": "BQ-PLAY",
  lowpricemart: "LowPriceMart",
  "event-organizer": "Event-Organizer",
  "tourist-places-guide": "tourist-places-guide",
  ecommerce: "ECommerce",
  "web-3-backend": "Web-3-Bano-Qabil-Backend",
  "web-2-assignments": "Web-2-Bano-Qabil",
  "web-dev-1-projects": "Final-Project-Web-dev-1",
};

function detectLanguage(stack: string[]): string | null {
  if (stack.some((s) => /typescript/i.test(s))) return "TypeScript";
  if (stack.some((s) => /javascript|react|node|express/i.test(s))) return "JavaScript";
  if (stack.some((s) => /css|tailwind/i.test(s))) return "CSS";
  if (stack.some((s) => /html/i.test(s))) return "HTML";
  return null;
}

function staticRepos(): GithubRepoSummary[] {
  return curatedProjects.map((p) => ({
    name: REPO_NAMES[p.slug] ?? p.slug,
    description: p.tagline,
    language: detectLanguage(p.stack),
    stars: 0,
    forks: 0,
    isFork: false,
    archived: p.status === "archived",
    homepage: null,
    topics: p.stack,
    createdAt: p.startedAt,
    pushedAt: p.startedAt,
    defaultBranch: "main",
  }));
}

const EVENT_LABELS: Record<string, string> = {
  PushEvent: "pushed to",
  PullRequestEvent: "opened a PR in",
  IssuesEvent: "opened an issue in",
  CreateEvent: "created a branch/tag in",
  WatchEvent: "starred",
  ForkEvent: "forked",
};

function languageColor(lang: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    CSS: "#663399",
    HTML: "#e34c26",
    Python: "#3572A5",
    Shell: "#89e051",
  };
  return colors[lang] ?? "#9ca3af";
}

function TopLanguages({ repos }: { repos: GithubRepoSummary[] }) {
  const langs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) {
      if (!r.language || r.isFork) continue;
      counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    }
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }));
  }, [repos]);

  return (
    <div className="flex flex-col gap-3">
      {langs.map((lang) => (
        <div key={lang.name} className="flex items-center gap-3">
          <span className="w-24 truncate font-mono text-xs text-muted-foreground">{lang.name}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              suppressHydrationWarning
              style={{
                width: `${lang.pct}%`,
                backgroundColor: languageColor(lang.name),
              }}
            />
          </div>
          <span className="w-10 text-right font-mono text-xs tabular-nums">{lang.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function ActivityHeatmap({ events }: { events: GithubEventSummary[] }) {
  const cells = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const e of events) {
      const day = e.created_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    const days: { date: string; count: number }[] = [];
    const start = new Date();
    start.setDate(start.getDate() - 83);
    for (let i = 0; i < 84; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, count: byDay.get(key) ?? 0 });
    }
    return days;
  }, [events]);

  const max = Math.max(1, ...cells.map((c) => c.count));
  const total = events.length;

  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
        {cells.map((cell) => (
          <div
            key={cell.date}
            title={`${cell.date}: ${cell.count} activity event${cell.count === 1 ? "" : "s"}`}
            className={cn(
              "h-3 w-3 rounded-[3px]",
              cell.count === 0 && "bg-muted",
              cell.count > 0 && "bg-primary",
              cell.count > 0 && cell.count < max * 0.4 && "opacity-40",
              cell.count > 0 && cell.count >= max * 0.4 && cell.count < max * 0.8 && "opacity-70"
            )}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        Last 12 weeks of public activity · {total} events (source: GitHub public events API)
      </p>
    </div>
  );
}

export function GithubPanel() {
  const user: GithubUserSummary = {
    login: profile.githubUsername,
    name: profile.name,
    public_repos: curatedProjects.length,
    followers: 0,
    following: 0,
    created_at: "2024-06-21T00:00:00Z",
  };
  const repos = staticRepos();
  const events: GithubEventSummary[] = [];

  const topRepos = useMemo(() => {
    if (!repos) return [];
    return [...repos]
      .filter((r) => !r.isFork)
      .sort(
        (a, b) =>
          b.stars - a.stars ||
          new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
      )
      .slice(0, 4);
  }, [repos]);

  const fallbackRepos = repos;
  const stars = fallbackRepos.reduce((a, r) => a + r.stars, 0);
  const renderedUser = user;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <ScrollReveal>
          <div className="glass-card flex h-full flex-col gap-3 rounded-xl p-6">
            <h3 className="font-display text-base font-semibold">GitHub Profile</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-mono text-2xl font-bold tabular-nums">{renderedUser.public_repos}</div>
                <div className="text-xs text-muted-foreground">Repos</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold tabular-nums">{stars}</div>
                <div className="text-xs text-muted-foreground">Stars</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold tabular-nums">{renderedUser.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
            </div>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Star className="h-4 w-4" />
              Follow on GitHub
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="glass-card flex h-full flex-col gap-4 rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold">
              <Code2 className="h-4 w-4 text-primary" />
              Top Languages
            </h3>
            <TopLanguages repos={fallbackRepos} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.16}>
          <div className="glass-card flex h-full flex-col gap-3 rounded-xl p-6">
            <h3 className="font-display text-base font-semibold">Top Repositories</h3>
            <ul className="flex flex-col gap-2">
              {topRepos.length > 0
                ? topRepos.map((repo) => (
                    <li key={repo.name}>
                      <a
                        href={`https://github.com/${profile.githubUsername}/${repo.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50"
                      >
                        <span className="truncate font-mono text-xs">
                          <span className="text-primary">{repo.name}</span>
                        </span>
                        <Badge variant="muted" className="shrink-0">
                          {repo.language ?? "—"}
                        </Badge>
                      </a>
                    </li>
                  ))
                : fallbackRepos.slice(0, 4).map((repo) => (
                    <li key={repo.name}>
                      <a
                        href={`https://github.com/${profile.githubUsername}/${repo.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50"
                      >
                        <span className="truncate font-mono text-xs">
                          <span className="text-primary">{repo.name}</span>
                        </span>
                        <Badge variant="muted" className="shrink-0">
                          {repo.language ?? "—"}
                        </Badge>
                      </a>
                    </li>
                  ))}
            </ul>
            <p className="mt-auto font-mono text-[10px] text-muted-foreground">
              Cached · updated hourly
            </p>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.1}>
          <div className="glass-card flex flex-col gap-4 rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold">
              <Activity className="h-4 w-4 text-primary" />
              Recent Activity
            </h3>
            <ActivityHeatmap events={events} />
          </div>
      </ScrollReveal>

      {events && events.length > 0 ? (
        <ScrollReveal delay={0.15}>
          <div className="glass-card rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold">
              <GitCommitHorizontal className="h-4 w-4 text-primary" />
              Latest Events
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {events.slice(0, 6).map((event, i) => {
                const repoName = event.repo.name.replace("Abid-Tanoli/", "");
                const label = EVENT_LABELS[event.type] ?? "did something in";
                return (
                  <li key={`${event.created_at}-${i}`} className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="truncate">
                      <span className="font-medium text-foreground">{label}</span>{" "}
                      <span className="font-mono text-xs text-primary">{repoName}</span>
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
                      {timeAgo(event.created_at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollReveal>
      ) : null}

      <p className="text-center font-mono text-[11px] text-muted-foreground">
        Curated repository snapshots from the static portfolio data ·{" "}
        {formatDate(renderedUser.created_at)} account
      </p>
    </div>
  );
}
