"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white px-4 py-3 flex justify-between items-center z-50 shadow-md">
      <div className="text-xl font-bold">App</div>
      <div className="hidden md:flex items-center space-x-4">
        {session ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="rounded-full bg-gray-800 px-4 py-2"
            >
              {session.user?.name || "Profile"}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg flex flex-col">
                <Link href="/profile" className="px-4 py-2 hover:bg-gray-700">
                  My Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-left hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/api/auth/signin"
            className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Login
          </Link>
        )}
      </div>
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-2 rounded-md bg-gray-800"
        >
          Menu
        </button>
        {open && (
          <div className="absolute right-4 top-16 w-40 bg-gray-800 rounded shadow-lg flex flex-col md:hidden">
            {session ? (
              <>

                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-left hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/api/auth/signin" className="px-4 py-2 hover:bg-gray-700">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}