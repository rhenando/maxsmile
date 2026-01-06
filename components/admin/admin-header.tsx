"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { BRANCHES } from "@/lib/branches";

const LOGO_SRC = "/logo.png";
const LOGO_ALT = "MaxSmile Dental Clinic";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

function getBranchList(): any[] {
  return Array.isArray(BRANCHES) ? BRANCHES : Object.values(BRANCHES as any);
}

function getBranchNameBySlug(slug?: string) {
  if (!slug) return "All Branches";

  const list = getBranchList();
  const found =
    list.find((b) => b?.slug === slug) ??
    list.find((b) => b?.id === slug) ??
    list.find((b) => b?.key === slug);

  return found?.name || found?.label || slug;
}

export default function AdminHeader({ branchSlug }: { branchSlug?: string }) {
  const router = useRouter();
  const branchName = getBranchNameBySlug(branchSlug);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur'>
      {/* slim luxury accent line */}
      <div className='h-0.5 w-full' style={{ backgroundColor: GOLD }} />

      <div className='mx-auto w-full max-w-7xl px-4 py-3'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <Link href='/admin' className='flex items-center gap-3'>
            <Image
              src={LOGO_SRC}
              alt={LOGO_ALT}
              width={150}
              height={40}
              priority
              className='h-9 w-auto'
            />

            <div className='hidden md:block'>
              <p className='text-sm font-semibold text-black tracking-tight'>
                Admin Dashboard
              </p>
              <p className='text-xs text-black/55'>
                Manage appointments & requests
              </p>
            </div>
          </Link>

          <div className='flex items-center gap-2'>
            <span className='hidden text-xs text-black/50 sm:inline'>
              Branch:
            </span>

            <span className='inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium text-black/80 shadow-sm'>
              <span
                className='mr-2 inline-block h-2 w-2 rounded-full'
                style={{ backgroundColor: GOLD_DARK }}
              />
              {branchName}
            </span>

            <Button
              type='button'
              onClick={handleLogout}
              variant='outline'
              className='rounded-2xl border-black/10 bg-white hover:bg-white'
            >
              <LogOut className='mr-2 h-4 w-4' />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
