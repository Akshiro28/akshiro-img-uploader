import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { loginUser } from "./loginUser";
import { useState } from "react";

function Navbar() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSignIn = async () => {
    try {
      const { isAdmin } = await loginUser();
      setIsAdmin(isAdmin);
      console.log("Logged in as", isAdmin ? "admin" : "user");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setIsAdmin(false);
  };

  return (
    <nav className="w-full border-b border-b-[var(--white-08)] bg-[rgba(var(--background),0.5)] fixed top-0 h-16 z-50 backdrop-blur">
      <div className="container mx-auto w-full h-full flex items-center justify-between p-4">
        <a href="/" className="flex items-center">
          <img src="/logo/logo_AK.png" alt="Logo" className="h-8 pe-4" />
          <p>Akshiro Image Uploader</p>
        </a>

        {user ? (
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL || ""}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <p className="hidden sm:block">{user.displayName}</p>

            {isAdmin && (
              <span className="text-red-400 font-semibold">
                [Admin]
              </span>
            )}

            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-500 px-4 py-1 rounded-full cursor-pointer"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded-full cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
