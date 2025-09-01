"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRefreshTokenMutation } from "@/lib/service/authApi";
import { useGetOrganizationsQuery } from "@/lib/service/api";

interface DecodedToken {
  exp: number;
  jti: string;
  token_type: string;
  user_id: number;
}

const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [refreshToken] = useRefreshTokenMutation();
  const { error: meError, refetch: refetchMe } = useGetOrganizationsQuery({});

  // Workshop routes uchun auth logic yo'q
  if (pathname.startsWith('/workshop')) {
    return null;
  }

  const clearAuthAndRedirect = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    // Faqat admin routes uchun
    if (pathname.startsWith('/workshop') || pathname === "/login") {
      return;
    }

    // GetMe dan 401 error kelganda
    if (meError && "status" in meError && meError.status === 401) {
      clearAuthAndRedirect();
      return;
    }
  }, [meError, router, pathname]);

  useEffect(() => {
    // Workshop va login sahifalarida auth tekshirmaslik
    if (pathname.startsWith('/workshop') || pathname === "/login") {
      return;
    }

    const accessToken = localStorage.getItem("access");
    const refreshTokenStr = localStorage.getItem("refresh");

    if (!accessToken || !refreshTokenStr) {
      clearAuthAndRedirect();
      return;
    }

    let decodedToken: DecodedToken;

    try {
      decodedToken = jwtDecode<DecodedToken>(accessToken);
    } catch (error) {
      console.error("Error decoding token:", error);
      clearAuthAndRedirect();
      return;
    }

    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

    const verifyAndRefresh = async () => {
      try {
        await refetchMe().unwrap();
      } catch (error: any) {
        if (error?.status === 401) {
          try {
            const refreshResponse = await refreshToken({
              refreshToken: refreshTokenStr,
            }).unwrap();

            if (refreshResponse?.accessToken) {
              localStorage.setItem("access", refreshResponse.accessToken);
              await refetchMe().unwrap();
            } else {
              throw new Error("Invalid refresh response");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            clearAuthAndRedirect();
          }
        } else {
          console.error("User data fetch failed:", error);
          clearAuthAndRedirect();
        }
      }
    };

    if (isTokenExpired) {
      verifyAndRefresh();
    } else {
      refetchMe();
    }
  }, [refetchMe, refreshToken, router, pathname]);

  return null;
};

export default useAuth;