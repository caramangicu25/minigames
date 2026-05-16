"use client";

import Link from "next/link";

interface Props {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export function GameCard({ title, description, href, icon, color }: Props) {
  return (
    <Link
      href={href}
      className="group block bg-card-bg card-shadow rounded-2xl overflow-hidden hover:card-shadow-heavy transition-all duration-200 hover:-translate-y-1"
    >
      {/* Gradient banner */}
      <div className={`h-28 bg-gradient-to-br ${color} flex items-center justify-center text-5xl`}>
        {icon}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-heading mb-1 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>

        <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium">
          Play now
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
            <polyline points="4,2 10,7 4,12" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export type GameBadge = "new" | "hot" | "updated" | null;
