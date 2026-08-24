"use client";

import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User, SupabaseClient } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "member" | "admin";
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  supabase: SupabaseClient | null;
  isLoading: boolean;
  isAvailable: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a mock/fallback auth context for when Supabase is not configured
const mockAuthContext: AuthContextType = {
  user: null,
  profile: null,
  supabase: null,
  isLoading: false,
  isAvailable: false,
  signIn: async () => ({ error: "Authentication is not configured. Please contact the administrator." }),
  signUp: async () => ({ error: "Authentication is not configured. Please contact the administrator." }),
  signOut: async () => {},
  resetPassword: async () => ({ error: "Authentication is not configured. Please contact the administrator." }),
};

function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn("[CoPublika] Supabase environment variables are not set. Auth features will be disabled.");
    return null;
  }

  try {
    return createBrowserClient(url, key);
  } catch (error) {
    console.warn("[CoPublika] Failed to create Supabase client:", error);
    return null;
  }
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAvailable: boolean;
    client: SupabaseClient | null;
  }>({
    user: null,
    profile: null,
    isLoading: true,
    isAvailable: false,
    client: null,
  });

  // Initialize auth on mount
  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const init = async () => {
      const client = createSupabaseClient();

      if (!mounted) return;

      if (!client) {
        setAuthState({ user: null, profile: null, isLoading: false, isAvailable: false, client: null });
        return;
      }

      const loadProfile = async (userId: string) => {
        if (!mounted) return;
        try {
          const { data } = await client
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
          if (mounted) {
            setAuthState(prev => ({ ...prev, profile: data }));
          }
        } catch {
          if (mounted) {
            setAuthState(prev => ({ ...prev, profile: null }));
          }
        }
      };

      try {
        const { data: { session } } = await client.auth.getSession();
        if (!mounted) return;
        
        const currentUser = session?.user ?? null;
        
        if (mounted) {
          setAuthState({
            user: currentUser,
            profile: null,
            isLoading: currentUser !== null, // Still loading if we need to load profile
            isAvailable: true,
            client,
          });
        }

        if (currentUser) {
          await loadProfile(currentUser.id);
          if (mounted) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error) {
        console.warn("[CoPublika] Auth initialization failed:", error);
        if (mounted) {
          setAuthState({ user: null, profile: null, isLoading: false, isAvailable: true, client });
        }
      }

      // Subscribe to auth state changes
      try {
        const { data: { subscription: sub } } = client.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          const newUser = session?.user ?? null;
          setAuthState(prev => ({ ...prev, user: newUser }));
          
          if (newUser) {
            await loadProfile(newUser.id);
          } else if (mounted) {
            setAuthState(prev => ({ ...prev, profile: null }));
          }
        });
        subscription = sub;
      } catch (error) {
        console.warn("[CoPublika] Auth state change listener failed:", error);
      }
    };

    init();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const { user, profile, isLoading, isAvailable, client: supabaseClient } = authState;

  // If Supabase is not available, return mock context
  if (!isAvailable || !supabaseClient) {
    return (
      <AuthContext.Provider value={mockAuthContext}>
        {children}
      </AuthContext.Provider>
    );
  }

  // At this point supabaseClient is guaranteed to be non-null
  const client = supabaseClient;

  async function signIn(email: string, password: string) {
    const { error } = await client.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (!error && data.user) {
      await client.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "member",
      });
    }

    return { error: error?.message ?? null };
  }

  async function signOut() {
    await client.auth.signOut();
    setAuthState(prev => ({ ...prev, user: null, profile: null }));
  }

  async function resetPassword(email: string) {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    return { error: error?.message ?? null };
  }

  return (
    <AuthContext.Provider value={{ user, profile, supabase: client, isLoading, isAvailable, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within SupabaseAuthProvider");
  return ctx;
}
