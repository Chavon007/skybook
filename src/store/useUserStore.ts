
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
  setSession: (session: Session | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),

      clearUser: () =>
        set({
          session: null,
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
