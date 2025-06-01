
export type GameState = 'intro' | 'levelSelect' | 'playing';

export interface Level {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple-choice' | 'drag-drop' | 'code-arrangement' | 'terminal';
  xpReward: number;
  badge?: string;
  prereq?: string[];
}

export interface PlayerProgress {
  xp: number;
  level: number;
  badges: string[];
  completedLevels: string[];
}

export interface Character {
  name: string;
  role: string;
  avatar: string;
  dialogue: string[];
}
