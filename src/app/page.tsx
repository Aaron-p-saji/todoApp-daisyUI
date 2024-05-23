"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import backend from "@/provider/backend";
import { AuthenticationContext } from "@/provider/AuthContext";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Link href="/notes">
            <button className="btn btn-active btn-neutral">Create Note</button>
          </Link>
        </>
      ) : (
        <div className="space-x-[0.5vw]">
          <button className="btn btn-active btn-primary bg-[#272123] border-0 text-white">
            Login
          </button>
          <button className="btn btn-active btn-primary bg-transparent border-[0.12vw] border-[#272123]">
            Register
          </button>
        </div>
      )}
    </div>
  );
}
