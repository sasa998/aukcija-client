"use client";

import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  return (
    <div>
      <div>
        <button onClick={() => logout()}>Logout</button>
      </div>

      <div>
        <h1>Dobrodošli, {user ? user.firstName : "Gost"}!</h1>
      </div>
    </div>
  );
}
