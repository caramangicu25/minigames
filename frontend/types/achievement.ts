export interface AchievementDto {
  key: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export type AchievementProgress = { achievementId: number; current: number; target: number; };
