export type ThemeColor =
  | 'aqua'
  | 'aurora'
  | 'ocean'
  | 'sunset'
  | 'smoke'
  | 'win7_blue'
  | 'graphite';

export type SoundTheme = 'calm' | 'aqua' | 'vista' | 'y2k';

export type AngleMode = 'deg' | 'rad';

export type BackgroundThemeId =
  | 'photorealistic_aquarium'
  | 'win7_aurora'
  | 'frutiger_aero'
  | 'animated_aquarium'
  | 'animated_rain'
  | 'animated_aurora'
  | 'custom_gif';

export interface BackgroundTheme {
  id: BackgroundThemeId;
  name: string;
  type: 'image' | 'animated' | 'custom';
  thumbnailText: string;
  url?: string;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface SoundConfig {
  enabled: boolean;
  volume: number; // 0 to 1
  theme: SoundTheme;
}

export type CalcMode = 'standard' | 'scientific';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  isCustom?: boolean;
}
