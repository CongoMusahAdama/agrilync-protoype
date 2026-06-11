const PLACEHOLDER_AVATAR_MARKERS = [
  'lovable-uploads/profile.png',
  'images.unsplash.com',
  'ui-avatars.com',
  'placeholder',
];

/** True only when the user uploaded or set a real profile photo */
export const isCustomAvatar = (avatar?: string | null): boolean => {
  if (!avatar?.trim()) return false;
  const lower = avatar.toLowerCase();
  return !PLACEHOLDER_AVATAR_MARKERS.some((marker) => lower.includes(marker));
};
