import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

export async function loginUser() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!user) throw new Error("No user returned from Firebase.");

  const isAdmin = user.email === adminEmail;
  const token = await user.getIdToken();

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        isAdmin,
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      console.error("❌ Failed to parse JSON from response");
      throw new Error("Invalid JSON from server");
    }

    if (!res.ok) {
      console.error("❌ Server responded with error:", data);
      throw new Error(data.error || "Failed to save user");
    }

    console.log("[✅ User login success]", data);
  } catch (err) {
    console.error("🔥 Error saving user:", err);
  }

  return { user, isAdmin };
}
