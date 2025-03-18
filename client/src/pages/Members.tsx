import { useEffect, useState } from "react";
import grid from "../assets/Grid.svg";
import logo from "../assets/logo.svg";
import MembersList from "../components/Members/MembersList";
import RolesList from "../components/Members/RolesList";
import InviteMemberModal from "../features/InviteMemberModal";
import { useTheme } from "../components/theme-provider";
import axios from "axios";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  dateAdded: string;
  status: string;
  accountState: string;
  avatar: string;
}

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Tyrell Wellick",
    role: "Owner",
    dateAdded: "Apr 19, 08:01 AM",
    status: "Online",
    accountState: "Active",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    name: "Tyrell Wellick",
    role: "Co-Owner",
    dateAdded: "Apr 19, 08:01 AM",
    status: "Offline",
    accountState: "Deactivated (Banned)",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    name: "Tyrell Wellick",
    role: "Administration",
    dateAdded: "Apr 19, 08:01 AM",
    status: "Online",
    accountState: "Active",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 4,
    name: "Tyrell Wellick",
    role: "Administration",
    dateAdded: "Apr 19, 08:01 AM",
    status: "Online",
    accountState: "Active",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
];


const Members = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/api/roles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <main
      className={`relative border ${
        theme === "dark" ? "border-white/30" : "border-black/30"
      } h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5`}
    >
      <div className="absolute inset-0 z-0">
        <img
          className={`w-full h-full object-cover ${
            theme === "dark" ? "invert  " : ""
          }`}
          draggable="false"
          src={grid}
          alt="grid background"
        />
      </div>

      {/* Invite Members Section */}
      <div
        className="p-7 z-10 rounded-xl text-white flex flex-col lg:flex-row justify-between items-center"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(138deg, #4B48A6 0%, #333 138.83%)"
              : "linear-gradient(138deg, #7D71E2 0%, #FFF 138.83%)",
        }}
      >
        <div>
          <h2 className="text-lg lg:text-xl font-medium text-white">
            Want to have a new member for your group? Invite them through a few
            steps!
          </h2>
          <p className="text-xs lg:text-sm my-3 text-white">
            (Make sure you have already set the roles for your group and have
            the member’s email)
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="lg:text-md text-sm w-full lg:w-fit  mt-5 bg-white text-black rounded-full px-3 py-1"
          >
            + Invite Members
          </button>
        </div>
        <img
          src={logo}
          className="-scale-x-100 hidden lg:block"
          width={70}
          height={70}
          alt="Flipped Logo"
        />
      </div>

      <MembersList members={members} setMembers={setMembers} roles={roles} />
      <RolesList
        roles={roles}
        setRoles={setRoles} // Already correct in your code
      />

      <InviteMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roles={roles} // Already correct in your code
      />
    </main>
  );
};

export default Members;
