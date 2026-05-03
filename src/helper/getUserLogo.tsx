export const getUserLogo = (logo?: string) => {
  return (
    logo ||
    "https://ui-avatars.com/api/?name=User&background=random"
  );
};