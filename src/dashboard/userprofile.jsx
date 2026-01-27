import { MailIcon, User } from "lucide-react";
import "./userprofile.css";

const UserProfile = ({ user }) => {
  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <>
      <div className="userProfileSection">
        <p>
          <User size={20} className="userProfileIcons" /> {user.name}
        </p>
        <p>
          <MailIcon size={20} className="userProfileIcons" /> {user.email}
        </p>
      </div>
    </>
  );
};

export default UserProfile;
