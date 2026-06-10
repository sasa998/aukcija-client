"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { FormAlert } from "@/components/ui/FormAlert";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email je obavezan")
    .email("Neispravna email adresa"),
  password: z.string().min(1, "Lozinka je obavezna"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  const serverError =
    error &&
    ((error as { response?: { data?: { message?: string } } }).response?.data
      ?.message ??
      "Došlo je do greške. Pokušajte ponovo.");

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_24px_rgba(0,0,0,0.08)] px-8 py-10">
          <h1 className="text-[#191919] text-2xl font-semibold mb-2 leading-tight">
            Prijava
          </h1>
          <p className="text-[#666666] text-sm mb-6">
            Dobrodošli nazad. Ulogujte se na vaš nalog.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {serverError && <FormAlert message={serverError} />}

            <FormInput
              id="email"
              type="email"
              label="Email adresa"
              autoComplete="email"
              placeholder="Email adresa"
              error={errors.email?.message}
              {...register("email")}
            />

            <PasswordInput
              id="password"
              label="Lozinka"
              autoComplete="current-password"
              placeholder="Lozinka"
              error={errors.password?.message}
              labelRight={
                <Link
                  href="/zaboravljena-lozinka"
                  className="text-sm font-semibold text-[#0a66c2] hover:underline"
                >
                  Zaboravili ste lozinku?
                </Link>
              }
              {...register("password")}
            />

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#004182] active:bg-[#004182] text-white font-semibold py-3 px-4 rounded-full text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Prijavljujem se…" : "Prijavi se"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e0e0]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#999]">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-[#191919]">
            Nemate nalog?{" "}
            <Link
              href="/register"
              className="text-[#0a66c2] font-semibold hover:underline"
            >
              Registrujte se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
