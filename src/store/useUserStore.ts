import { create } from "zustand";
import { persist } from "zustand/middleware";

type Session = {
  access_token: string;
  user: {
    id: string;
    email?: string;
    user_metadata: {
      fullName?: string;
    };
  };
};

type UserStore = {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      session: null,
      loading: true,
      setSession: (session) => set({ session, loading: false }),

      clearUser: () =>
        set({
          session: null,
          loading: false,
        }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        session: state.session?.access_token
          ? {
              access_token: state.session.access_token,
              user: state.session.user,
            }
          : null,
      }),
    },
  ),
);
