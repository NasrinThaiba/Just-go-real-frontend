import logoImage from "@/assets/logo.png";

import {
  getAuthUser,
  getProfileByPhone,
  type UserRole,
} from "@/utils/authStorage";

import type { AuthorRole, PostAuthor } from "@/types/news";

function formatAuthorRole(role?: UserRole): AuthorRole {
  const roleMap: Record<UserRole, AuthorRole> = {
    admin: "Admin",
    reportor: "Reportor",
    contributor: "Contributor",
    guest: "Guest",
  };

  return role ? roleMap[role] : "Guest";
}

export function getCurrentAuthor(): PostAuthor {
  const authUser = getAuthUser();

  if (!authUser?.phone) {
    return {
      name: "Guest User",
      role: "Guest",
      avatar: logoImage,
    };
  }

  const profile = getProfileByPhone(authUser.phone);

  if (!profile) {
    return {
      name: "Guest User",
      role: "Guest",
      avatar: logoImage,
      phone: authUser.phone,
    };
  }

  return {
    name: profile.name || "Guest User",
    role: formatAuthorRole(profile.role),
    avatar: profile.profileImage || logoImage,
    phone: profile.phone,
  };
}