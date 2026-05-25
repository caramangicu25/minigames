"use client";

import { ClickArea } from "@/components/games/click-speed/ClickArea";
import { useClickSpeed } from "@/hooks/useClickSpeed";
import { useAuthStore } from "@/store/authStore";
import { useScoreStore } from "@/store/scoreStore";

export default function ClickSpeedPage() {
  const { user } = useAuthStore();
  const { submitScore } = useScoreStore();
  const game = useClickSpeed({
    duration: 10,
    onComplete: (cps) => {
      if (user) submitScore({ userId: user.id, username: user.username, game: "click-speed", value: cps }, user.id);
    },
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-heading">⚡ Click Speed Test</h1>
        <p className="text-muted text-sm">Click as fast as you can for 10 seconds.</p>
      </div>

      {game.finished && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 rounded-xl px-5 py-3 text-center font-semibold animate-rise">
          ⚡ {game.cps} clicks/sec — {game.clicks} total clicks!
          {!user && <span className="block text-sm font-normal mt-1">Sign in to save your score.</span>}
        </div>
      )}

      <ClickArea
        clicks={game.clicks}
        timeLeft={game.timeLeft}
        active={game.active}
        finished={game.finished}
        onClick={game.handleClick}
        onStart={game.start}
        onReset={game.reset}
      />
    </div>
  );
}

type ClickSpeedMode = "5s" | "10s" | "30s";
