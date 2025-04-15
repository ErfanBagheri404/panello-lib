
import { useGoogleLogin } from "@react-oauth/google";

export const useGoogleAuth = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch(`/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.access_token }),
        });

        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  return { googleLogin };
};
