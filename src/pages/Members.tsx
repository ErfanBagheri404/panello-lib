import React, { useState } from "react";
import grid from "../assets/Grid.svg";
import logo from "../assets/logo.svg";
import { IoEllipse } from "react-icons/io5";

interface Member {
  id: number;
  name: string;
  role: string;
  dateAdded: string;
  status: string;
  accountState: string;
  avatar: string;
}

const members: Member[] = [
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
  const [allChecked, setAllChecked] = useState(false);
  const [checkedMembers, setCheckedMembers] = useState<Set<number>>(new Set());

  const handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setAllChecked(isChecked);
    if (isChecked) {
      setCheckedMembers(new Set(members.map((member) => member.id)));
    } else {
      setCheckedMembers(new Set());
    }
  };

  const handleSingleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    memberId: number
  ) => {
    const isChecked = event.target.checked;
    const updatedCheckedMembers = new Set(checkedMembers);
    if (isChecked) {
      updatedCheckedMembers.add(memberId);
    } else {
      updatedCheckedMembers.delete(memberId);
    }
    setCheckedMembers(updatedCheckedMembers);
    setAllChecked(updatedCheckedMembers.size === members.length);
  };

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          draggable="false"
          src={grid}
          alt=""
        />
      </div>
      {/* Invite Members Section */}
      <div
        className="p-7 z-10 rounded-xl text-white flex flex-col lg:flex-row justify-between"
        style={{
          background: "linear-gradient(92deg, #756CDF 1.33%, #FFF 216.44%)",
        }}
      >
        <div>
          <h2 className="text-xl font-medium">
            Want to have a new member for your group? Invite them through few
            steps!
          </h2>
          <p className="text-sm my-3">
            (Make sure you have already set the roles for your group and have
            the member’s email)
          </p>
          <button className="mt-5 bg-white text-black rounded-full px-3 py-1">
            + Invite Members
          </button>
        </div>
        <img
          src={logo}
          className="-scale-x-100"
          width={70}
          height={70}
          alt="Flipped Logo"
        />
      </div>
      {/* Members Table */}
      <div className="z-10 my-5">
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        <div className="bg-white w-full rounded-xl border border-black/30 overflow-hidden p-3">
          <table className="w-full text-sm">
            <thead className="text-left bg-[#CCCCCC]">
              <tr className="rounded-xl">
                <th className="p-3 rounded-tl-xl rounded-bl-xl items-center">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleAllCheck}
                  />
                </th>
                <th className="p-3">Member</th>
                <th className="p-3">Role</th>
                <th className="p-3">Date added</th>
                <th className="p-3">Activity status</th>
                <th className="p-3 rounded-tr-xl rounded-br-xl">
                  Account state
                </th>
              </tr>
            </thead>
            <tbody className="">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className={`${
                    members.indexOf(member) !== 0
                      ? "border-t border-gray-200"
                      : ""
                  } hover:bg-gray-50`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={checkedMembers.has(member.id)}
                      onChange={(event) => handleSingleCheck(event, member.id)}
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {member.name}
                  </td>
                  <td className="p-3">{member.role}</td>
                  <td className="p-3">{member.dateAdded}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <IoEllipse
                        className={`${
                          member.status === "Online"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      {member.status}
                    </div>
                  </td>
                  <td
                    className={`p-3 ${
                      member.accountState.includes("Deactivated")
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {member.accountState}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Actions Section */}
        <div className="flex items-center mt-3 gap-2">
          <span>Actions to do with selected users:</span>
          <select className="border border-black/30 rounded-md p-1">
            <option>Options</option>
            <option>Ban</option>
            <option>Change Role</option>
            <option>Remove</option>
          </select>
          <button className="px-3 py-1 bg-black text-white rounded-md text-md">
            Apply
          </button>
        </div>
      </div>
    </main>
  );
};

export default Members;
