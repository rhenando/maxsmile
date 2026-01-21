"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

const GOLD_DARK = "#B19552";

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden='true'
      className={`inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin ${className}`}
    />
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className='min-h-svh bg-[#FAF7F1]' />}>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const unauthorized = params.get("error") === "unauthorized";

  async function handleLogin() {
    if (submitting) return; // prevents double-click
    setError("");
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className='relative min-h-svh bg-[#FAF7F1] flex items-center justify-center px-4 py-10'>
      {/* Optional: full-page loading overlay */}
      {submitting ? (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-[#FAF7F1]/70 backdrop-blur-sm'>
          <div className='flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm'>
            <span className='inline-block h-5 w-5 rounded-full border-2 border-black/20 border-t-black animate-spin' />
            <p className='text-sm text-black/70'>Signing you in…</p>
          </div>
        </div>
      ) : null}

      <Card className='w-full max-w-md rounded-3xl border-black/10 bg-white'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg'>Admin Login</CardTitle>
          <p className='mt-1 text-sm text-black/60'>
            Sign in to manage branch appointments.
          </p>
        </CardHeader>

        <CardContent className='space-y-4'>
          {unauthorized ? (
            <p className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              This account is not allowed to access the admin dashboard.
            </p>
          ) : null}

          {error ? (
            <p className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {error}
            </p>
          ) : null}

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='admin@maxsmile.com'
              className='h-11 rounded-xl'
              inputMode='email'
              disabled={submitting}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='pass'>Password</Label>
            <Input
              id='pass'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              className='h-11 rounded-xl'
              disabled={submitting}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>

          <Button
            type='button'
            onClick={handleLogin}
            disabled={!email || !password || submitting}
            className='h-12 w-full rounded-2xl text-white'
            style={{ backgroundColor: GOLD_DARK }}
          >
            {submitting ? (
              <span className='flex items-center justify-center gap-2'>
                <Spinner />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
