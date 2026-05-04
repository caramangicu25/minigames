"use client";

interface Props {
  grid: number[][];
  original: boolean[][];
  selected: [number, number] | null;
  errors: Set<string>;
  onSelect: (r: number, c: number) => void;
}

export function SudokuBoard({ grid, original, selected, errors, onSelect }: Props) {
  return (
    <div className="grid grid-cols-9 border-2 border-heading rounded-xl overflow-hidden w-full max-w-[400px] mx-auto card-shadow-heavy">
      {grid.map((row, r) =>
        row.map((val, c) => {
          const isSelected = selected?.[0] === r && selected?.[1] === c;
          const isOriginal = original[r][c];
          const isError = errors.has(`${r},${c}`);
          const sameBox =
            selected &&
            Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
            Math.floor(selected[1] / 3) === Math.floor(c / 3);
          const sameRow = selected?.[0] === r;
          const sameCol = selected?.[1] === c;
          const highlighted = !isSelected && (sameBox || sameRow || sameCol);

          const borderR = (r + 1) % 3 === 0 && r !== 8 ? "border-b-2 border-b-heading" : "border-b border-b-border";
          const borderC = (c + 1) % 3 === 0 && c !== 8 ? "border-r-2 border-r-heading" : "border-r border-r-border";

          return (
            <button
              key={`${r}-${c}`}
              onClick={() => onSelect(r, c)}
              className={`aspect-square flex items-center justify-center text-sm font-medium select-none transition-colors
                ${borderR} ${borderC}
                ${isSelected ? "bg-accent text-white" : ""}
                ${isError && !isSelected ? "bg-red-500/20 text-red-500" : ""}
                ${highlighted && !isSelected && !isError ? "bg-accent-soft" : ""}
                ${!isSelected && !isError && !highlighted ? "bg-card-bg" : ""}
                ${isOriginal ? "font-bold text-heading" : "text-accent"}
                ${!isOriginal && !isSelected ? "hover:bg-accent-soft" : ""}
              `}
            >
              {val !== 0 ? val : ""}
            </button>
          );
        })
      )}
    </div>
  );
}
