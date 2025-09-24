// Application configuration types
export interface AppConfig {
  inviteUrl: string;
  githubUrl: string;
  docsUrl: string;
  presetGuildId: string | null;
}

// Discord widget data types
export interface DiscordWidgetData {
  online: number | null;
  presenceCount: number | null;
  guildId: string | null;
  widgetUrl: string;
  isLoading: boolean;
  error: string | null;
}

// Theme types
export interface Theme {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
}

// Application state types
export interface AppState {
  config: AppConfig;
  discord: DiscordWidgetData;
  theme: Theme;
  isLoading: boolean;
  error: string | null;
}

// Action types for reducer
export type AppAction =
  | { type: 'SET_DISCORD_DATA'; payload: Partial<DiscordWidgetData> }
  | { type: 'SET_GUILD_ID'; payload: string | null }
  | { type: 'SET_THEME'; payload: Partial<Theme> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_DISCORD_DATA' };

// Context types
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateGuildId: (guildId: string | null) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  refreshDiscordData: () => Promise<void>;
}
