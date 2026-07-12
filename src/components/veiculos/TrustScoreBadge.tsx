import { trustColor } from "@/core/trust-score";
import { cn } from "@/lib/utils";

export function TrustScoreBadge({
  score,
  size = "sm",
}: {
  score: number | null;
  size?: "sm" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border-2 font-display font-semibold",
        size === "sm" ? "h-12 w-12 text-xs" : "h-28 w-28 border-4 text-3xl",
        trustColor(score)
      )}
      title="Trust Score"
    >
      {score === null ? "—" : `${score}%`}
    </div>
  );
}
