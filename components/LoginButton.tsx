"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return <button className="btn secondary" onClick={() => signOut()}>Logout</button>;
  }

  return <button className="btn secondary" onClick={() => signIn("google")}>Login Google</button>;
}
