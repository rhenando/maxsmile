"use client";

import { FormEvent, Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`}
    />
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#FAF7F1]" />}>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const unauthorized = params.get("error") === "unauthorized";
  const trimmedEmail = email.trim();
  const locked = lockedUntil !== null && Date.now() < lockedUntil;

  const lockSeconds = lockedUntil
    ? Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000))
    : 0;

  const canSubmit =
    isValidEmail(trimmedEmail) &&
    password.length >= 6 &&
    !submitting &&
    !locked;

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setError("");
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) throw signInError;

      setAttempts(0);
      router.push("/admin");
      router.refresh();
    } catch {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError("Invalid email or password.");

      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setAttempts(0);
        window.setTimeout(() => setLockedUntil(null), LOCKOUT_MS);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#FAF7F1] px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: GOLD }} />

      <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden border-r border-black/10 bg-[#FAF7F1] p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <Image
                src="/logo.png"
                alt="MaxSmile Dental Clinic"
                width={170}
                height={48}
                priority
                className="h-12 w-auto"
              />

              <div className="mt-10">
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-white"
                  style={{ color: GOLD_DARK }}
                >
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-black">
                  Secure branch access
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-black/65">
                  Sign in with your assigned admin account to manage appointment
                  requests and walk-in records.
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-black/50">
              Access is restricted to authorized branch staff.
            </p>
          </aside>

          <Card className="border-0 bg-white shadow-none">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="mb-8 lg:hidden">
                <Image
                  src="/logo.png"
                  alt="MaxSmile Dental Clinic"
                  width={150}
                  height={42}
                  priority
                  className="h-11 w-auto"
                />
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10"
                  style={{ backgroundColor: "rgba(218,197,131,0.16)", color: GOLD_DARK }}
                >
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-black">
                    Admin Login
                  </h2>
                  <p className="mt-1 text-sm text-black/60">
                    Manage branch appointments from your secure dashboard.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="mt-7 space-y-4">
                {unauthorized ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    This account is not allowed to access the admin dashboard.
                  </p>
                ) : null}

                {error ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}

                {locked ? (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    Too many attempts. Try again in {lockSeconds || 30} seconds.
                  </p>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="admin@maxsmile.com"
                    className="h-11 rounded-xl"
                    inputMode="email"
                    autoComplete="email"
                    disabled={submitting || locked}
                    aria-invalid={email.length > 0 && !isValidEmail(trimmedEmail)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      type={showPassword ? "text" : "password"}
                      className="h-11 rounded-xl pr-11"
                      autoComplete="current-password"
                      disabled={submitting || locked}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-black/55 hover:bg-black/5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-12 w-full rounded-xl text-white"
                  style={{ backgroundColor: canSubmit ? GOLD_DARK : "#cbbf9a" }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
