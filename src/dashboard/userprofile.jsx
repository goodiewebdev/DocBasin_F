import { MailIcon, User } from "lucide-react";
import Spinner from "../utils/spinner.jsx";
import "./userprofile.css";

const UserProfile = ({ user }) => {
  if (!user) {
    return <Spinner />;
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
