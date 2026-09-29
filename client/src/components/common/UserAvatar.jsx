import { useState } from 'react';

export const UserAvatar = ({ user, className = "profile-avatar" }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = (user?.name || "?").trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return user?.profilePicture && !imageFailed
    ? <img className={className} src={user.profilePicture} alt="" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />
    : <div className={className} aria-label={`${user?.name || "User"} avatar`}>{initials}</div>;
};
