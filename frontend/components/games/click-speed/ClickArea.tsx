"use client";

interface Props {
  clicks: number;
  timeLeft: number;
  active: boolean;
  finished: boolean;
  onClick: () => void;
  onStart: () => void;
  onReset: () => void;
}

export function ClickArea({ clicks, timeLeft, active, finished, onClick, onStart, onReset }: Props) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-bg card-shadow rounded-xl p-4 text-center">
          <p className="text-4xl font-bold text-heading">{clicks}</p>
          <p className="text-muted text-sm mt-1">clicks</p>
        </div>
        <div className="bg-card-bg card-shadow rounded-xl p-4 text-center">
          <p className={`text-4xl font-bold ${timeLeft <= 3 && active ? "text-red-500" : "text-heading"}`}>
            {timeLeft}
          </p>
          <p className="text-muted text-sm mt-1">seconds left</p>
        </div>
      </div>

      {/* Click target */}
      {!finished ? (
        <button
          onClick={active ? onClick : onStart}
          className={`w-full h-48 rounded-2xl font-bold text-xl transition-all select-none
            ${active
              ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white hover:scale-[0.98] active:scale-95 animate-pulse-glow"
              : "bg-surface-alt text-label hover:bg-accent-soft hover:text-accent border-2 border-dashed border-border"
            }`}
        >
          {active ? "CLICK!" : "Click to Start"}
        </button>
      ) : (
        <div className="w-full h-48 rounded-2xl bg-surface-alt flex flex-col items-center justify-center gap-3">
          <p className="text-2xl font-bold text-heading">Time's up!</p>
          <button
            onClick={onReset}
            className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
