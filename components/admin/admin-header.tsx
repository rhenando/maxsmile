"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { BRANCHES, type BranchSlug } from "@/lib/branches";

const LOGO_SRC = "/logo.png";
const LOGO_ALT = "MaxSmile Dental Clinic";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

function getBranchNameBySlug(slug?: string) {
  if (!slug) return "All Branches";

  return BRANCHES[slug as BranchSlug]?.name ?? slug;
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
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Link href='/admin' className='flex min-w-0 items-center gap-3'>
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

          <div className='flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end'>
            <span className='hidden text-xs text-black/50 sm:inline'>
              Branch:
            </span>

            <span className='inline-flex max-w-full items-center rounded-full border uppercase border-black/10 bg-white px-3 py-1 text-sm font-medium text-black/80 shadow-sm'>
              <span
                className='mr-2 inline-block h-2 w-2 rounded-full'
                style={{ backgroundColor: GOLD_DARK }}
              />
              <span className='truncate'>{branchName}</span>
            </span>

            <Button
              type='button'
              onClick={handleLogout}
              variant='outline'
              className='ml-auto rounded-xl border-black/10 bg-white hover:bg-white sm:ml-0'
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
