"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, Check } from "lucide-react";
import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { FormAlert } from "@/components/ui/FormAlert";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Ime je obavezno").max(50),
    lastName: z.string().min(1, "Prezime je obavezno").max(50),
    email: z
      .string()
      .min(1, "Email je obavezan")
      .email("Neispravna email adresa"),
    password: z
      .string()
      .min(8, "Lozinka mora imati najmanje 8 karaktera")
      .regex(/[A-Z]/, "Mora sadržavati veliko slovo")
      .regex(/[0-9]/, "Mora sadržavati broj"),
    confirmPassword: z.string().min(1, "Potvrdite lozinku"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const passwordRequirements = [
  { label: "Najmanje 8 karaktera", test: (v: string) => v.length >= 8 },
  { label: "Jedno veliko slovo", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Jedan broj", test: (v: string) => /[0-9]/.test(v) },
];

export default function RegisterPage() {
  const { mutate: register, isPending, error } = useRegister();
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = ({ ...values }: RegisterFormValues) => {
    const { confirmPassword, ...payload } = values;

    register(payload);
  };

  const serverError =
    error &&
    ((error as { response?: { data?: { message?: string } } }).response?.data
      ?.message ??
      "Došlo je do greške. Pokušajte ponovo.");

  return (
    <main className="flex-1 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_24px_rgba(0,0,0,0.08)] px-8 py-10">
          <h1 className="text-[#191919] text-2xl font-semibold mb-1 leading-tight">
            Kreirajte nalog
          </h1>
          <p className="text-[#666666] text-sm mb-6">
            Pridružite se aukcija platformi danas.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {serverError && <FormAlert message={serverError} />}

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                id="firstName"
                type="text"
                label="Ime"
                autoComplete="given-name"
                placeholder="Ime"
                error={errors.firstName?.message}
                {...formRegister("firstName")}
              />
              <FormInput
                id="lastName"
                type="text"
                label="Prezime"
                autoComplete="family-name"
                placeholder="Prezime"
                error={errors.lastName?.message}
                {...formRegister("lastName")}
              />
            </div>

            <FormInput
              id="email"
              type="email"
              label="Email adresa"
              autoComplete="email"
              placeholder="Email adresa"
              error={errors.email?.message}
              {...formRegister("email")}
            />

            <div className="space-y-1">
              <PasswordInput
                id="password"
                label="Lozinka (8+ karaktera)"
                autoComplete="new-password"
                placeholder="Lozinka"
                error={errors.password?.message}
                {...formRegister("password", {
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
              />
              {passwordValue.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {passwordRequirements.map(({ label, test }) => {
                    const met = test(passwordValue);
                    return (
                      <li
                        key={label}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          met ? "text-[#057642]" : "text-[#666]"
                        }`}
                      >
                        <Check
                          size={12}
                          className={met ? "opacity-100" : "opacity-30"}
                        />
                        {label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <PasswordInput
              id="confirmPassword"
              label="Potvrdite lozinku"
              autoComplete="new-password"
              placeholder="Potvrdite lozinku"
              error={errors.confirmPassword?.message}
              {...formRegister("confirmPassword")}
            />

            <p className="text-xs text-[#666] leading-relaxed">
              Klikom na Prihvati i registruj se, slažete se sa aukcija{" "}
              <Link
                href="/uslovi"
                className="text-[#0a66c2] hover:underline font-medium"
              >
                Korisničkim uslovima
              </Link>
              ,{" "}
              <Link
                href="/privatnost"
                className="text-[#0a66c2] hover:underline font-medium"
              >
                Politikom privatnosti
              </Link>{" "}
              i{" "}
              <Link
                href="/kolacici"
                className="text-[#0a66c2] hover:underline font-medium"
              >
                Politikom kolačića
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#004182] active:bg-[#004182] text-white font-semibold py-3 px-4 rounded-full text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Kreiram nalog…" : "Prihvati i registruj se"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e0e0]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#999]">
                Već imate nalog?
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full text-center border border-[#0a66c2] text-[#0a66c2] font-semibold py-3 px-4 rounded-full text-sm hover:bg-[#eef3fb] transition-colors"
          >
            Prijavi se
          </Link>
        </div>
      </div>
    </main>
  );
}
