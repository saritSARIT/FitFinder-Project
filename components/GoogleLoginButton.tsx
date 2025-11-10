"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleLoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <button disabled>Loading...</button>;

  if (session?.user) {
    return (
      <div>
        <p>שלום, {session.user.name}</p>
        <button onClick={() => signOut()}>התנתק</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("google")}>
      התחבר עם Google
    </button>
  );
}
