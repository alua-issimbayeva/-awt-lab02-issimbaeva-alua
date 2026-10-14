"use client";

import { useState } from "react";
import useSWR from "swr";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetcher(url: string): Promise<Course[]> {
  const res = await fetch(url);
  // fetch only rejects on a network failure; a 404 or 500 has to be thrown by hand
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function ElectiveFilter() {
  const [onlyElective, setOnlyElective] = useState(false);
  // the query parameter keeps its Python name: aliases only apply to JSON bodies
  const query = onlyElective ? "?is_elective=true" : "";
  const { data, error, isLoading } = useSWR(`${API}/courses${query}`, fetcher);

  return (
    <div>
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={onlyElective}
          onChange={(e) => setOnlyElective(e.target.checked)}
        />
        Electives only
      </label>
      {error && <p>Failed to load courses</p>}
      {isLoading && <p>Loading…</p>}
      {data && (
        <ul className="list-disc pl-6">
          {data.map((c) => (
            <li key={c.id}>
              {c.title} — {c.credits} cr.{c.isElective && " · elective"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
