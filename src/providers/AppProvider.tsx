import { createContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { AppState, AppAction, AppContextType, AppConfig, Theme } from '../types';

// Initial state
const initialState: AppState = {
  config: {
    inviteUrl: "https://discord.gg/YC7wBqabxA",
    githubUrl: "https://github.com/OpenKotOR",
    docsUrl: "https://docs.openkotor.com",
    presetGuildId: "739590575359262792"
  },
  discord: {
    online: null,
    presenceCount: null,
    guildId: "739590575359262792",
    widgetUrl: "https://discord.com/api/guilds/739590575359262792/widget.json",
    isLoading: false,
    error: null
  },
  theme: {
    mode: 'auto',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6'
  },
  isLoading: false,
  error: null
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DISCORD_DATA':
      return {
        ...state,
        discord: {
          ...state.discord,
          ...action.payload
        }
      };
    
    case 'SET_GUILD_ID':
      const newGuildId = action.payload;
      return {
        ...state,
        discord: {
          ...state.discord,
          guildId: newGuildId,
          widgetUrl: newGuildId 
            ? `https://discord.com/api/guilds/${newGuildId}/widget.json`
            : "https://discord.com/api/guilds/—/widget.json",
          online: null,
          presenceCount: null,
          error: null
        }
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: {
          ...state.theme,
          ...action.payload
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'RESET_DISCORD_DATA':
      return {
        ...state,
        discord: {
          ...state.discord,
          online: null,
          presenceCount: null,
          error: null,
          isLoading: false
        }
      };
    
    default:
      return state;
  }
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
  config?: Partial<AppConfig>;
}

export function AppProvider({ children, config }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    config: { ...initialState.config, ...config }
  });

  // Fetch Discord widget data
  const fetchDiscordData = useCallback(async () => {
    const { guildId } = state.discord;
    
    if (!guildId || typeof fetch === "undefined") {
      dispatch({ type: 'RESET_DISCORD_DATA' });
      return;
    }

    dispatch({ type: 'SET_DISCORD_DATA', payload: { isLoading: true, error: null } });

    try {
      const response = await fetch(
        `https://discord.com/api/guilds/${guildId}/widget.json`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Widget disabled or invalid Guild ID");
      }

      const data = await response.json();
      const onlineNow = Array.isArray(data.members) 
        ? data.members.length 
        : (data.presence_count || 0);

      dispatch({
        type: 'SET_DISCORD_DATA',
        payload: {
          online: onlineNow,
          presenceCount: typeof data.presence_count === "number" ? data.presence_count : null,
          isLoading: false,
          error: null
        }
      });

      // Update document title if we have guild name
      if (typeof document !== "undefined" && data.name) {
        document.title = `${data.name} — OpenKotOR`;
      }
    } catch (error) {
      dispatch({
        type: 'SET_DISCORD_DATA',
        payload: {
          online: null,
          presenceCount: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch Discord data'
        }
      });
    }
  }, [state.discord.guildId]);

  // Update guild ID
  const updateGuildId = useCallback((guildId: string | null) => {
    dispatch({ type: 'SET_GUILD_ID', payload: guildId });
  }, []);

  // Update theme
  const updateTheme = useCallback((theme: Partial<Theme>) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  // Refresh Discord data
  const refreshDiscordData = useCallback(async () => {
    await fetchDiscordData();
  }, [fetchDiscordData]);

  // Set up Discord data fetching
  useEffect(() => {
    fetchDiscordData();
  }, [fetchDiscordData]);

  // Set up document title
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "OpenKotOR — Modding & Reverse‑Engineering Hub";
    }
  }, []);

  // Set up theme handling
  useEffect(() => {
    const { mode } = state.theme;
    
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      
      if (mode === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (mode === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        // Auto mode - use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
      }
    }
  }, [state.theme.mode]);

  const contextValue: AppContextType = {
    state,
    dispatch,
    updateGuildId,
    updateTheme,
    refreshDiscordData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Export context for use in other components
export { AppContext };
