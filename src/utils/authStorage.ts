export type UserRole = "admin" | "reportor" | "contributor" | "guest";

export type UserProfile = {
  phone: string;
  profileImage: string;
  name: string;
  role: UserRole;
  location: string;
  language: "en" | "ta";
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  phone: string;
  profileCompleted: boolean;
  loggedInAt: string;
};

const AUTH_USER_KEY = "jgr_auth_user";
const USER_PROFILES_KEY = "jgr_user_profiles";

export function getUserProfiles(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(USER_PROFILES_KEY);

    if (!raw) return {};

    return JSON.parse(raw) as Record<string, UserProfile>;
  } catch {
    return {};
  }
}

export function getProfileByPhone(phone: string): UserProfile | null {
  const profiles = getUserProfiles();

  return profiles[phone] ?? null;
}

export function saveUserProfile(profile: UserProfile) {
  const profiles = getUserProfiles();

  const updatedProfiles = {
    ...profiles,
    [profile.phone]: profile,
  };

  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(updatedProfiles));
}

export function setAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function updateAuthProfileCompleted() {
  const user = getAuthUser();

  if (!user) return;

  setAuthUser({
    ...user,
    profileCompleted: true,
  });
}

export function logoutUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}