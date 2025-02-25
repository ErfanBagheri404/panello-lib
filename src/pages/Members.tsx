import { useState } from "react";
import grid from "../assets/Grid.svg";
import logo from "../assets/logo.svg";
import MembersList from "../components/MembersList";
import RolesList from "../components/RolesList";
import InviteMemberModal from "../components/InviteMemberModal";

const Members = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5">
      <div className="absolute inset-0 z-0">
        <img className="w-full h-full object-cover" draggable="false" src={grid} alt="" />
      </div>

      {/* Invite Members Section */}
      <div
        className="p-7 z-10 rounded-xl text-white flex flex-col lg:flex-row justify-between"
        style={{ background: "linear-gradient(92deg, #756CDF 1.33%, #FFF 216.44%)" }}
      >
        <div>
          <h2 className="text-xl font-medium text-white">
            Want to have a new member for your group? Invite them through a few steps!
          </h2>
          <p className="text-sm my-3 text-white">
            (Make sure you have already set the roles for your group and have the member’s email)
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 bg-white text-black rounded-full px-3 py-1"
          >
            + Invite Members
          </button>
        </div>
        <img src={logo} className="-scale-x-100" width={70} height={70} alt="Flipped Logo" />
      </div>

      <MembersList />
      <RolesList />

      {/* Invite Member Modal */}
      <InviteMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};

export default Members;
