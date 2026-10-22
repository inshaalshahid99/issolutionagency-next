"use client";

import { useState } from "react";
import { projects, workFilters, type WorkFilter } from "@/content/work";
import { WorkCard } from "@/components/home/WorkCard";

/** Filterable grid of work (the /work page). */
export function WorkGrid() {
  const [filter, setFilter] = useState<"all" | WorkFilter>("all");
  const visible = projects.filter((p) => filter === "all" || p.filters.includes(filter));
  return (
    <>
      <div className="x-filters mb-10" role="group" aria-label="Filter projects">
        {workFilters.map((f) => (
          <button key={f.id} className="x-chip" type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>
      <div className="x-workgrid">
        {projects.map((p, i) => (
          <WorkCard key={p.slug} p={p} index={i} hidden={!visible.includes(p)} headingLevel="h2" />
        ))}
      </div>
      {visible.length === 0 && <p className="text-muted">No projects in this category yet.</p>}
    </>
  );
}
