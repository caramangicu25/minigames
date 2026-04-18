"use client";

interface Props {
  board: (string | null)[];
  onCell: (i: number) => void;
  winner: string | null;
  winLine: number[] | null;
}

export function TicTacToeBoard({ board, onCell, winner, winLine }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {board.map((cell, i) => {
        const isWin = winLine?.includes(i);
        return (
          <button
            key={i}
            onClick={() => !cell && !winner && onCell(i)}
            disabled={!!cell || !!winner}
            className={`aspect-square rounded-xl text-4xl font-bold flex items-center justify-center transition-all
              ${isWin ? "bg-accent text-white scale-105" : ""}
              ${!isWin && !cell && !winner ? "bg-surface-alt hover:bg-accent-soft hover:scale-105" : ""}
              ${!isWin && cell ? "bg-card-bg card-shadow" : ""}
              ${cell === "X" && !isWin ? "text-accent" : ""}
              ${cell === "O" && !isWin ? "text-pink-500" : ""}
            `}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
