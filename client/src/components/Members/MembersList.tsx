import React, { useState } from "react";
import { IoEllipse } from "react-icons/io5";
import { Member, Role } from "../../pages/Members";

interface MembersListProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  roles: Role[];
}

const MembersList = ({ members, setMembers, roles }: MembersListProps) => {
  const [allChecked, setAllChecked] = useState(false);
  const [checkedMembers, setCheckedMembers] = useState<Set<number>>(new Set());
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("");

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
  const handleRoleChange = (memberId: number, newRole: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    setEditingMemberId(null);
  };
  const handleActionApply = () => {
    if (!selectedAction || checkedMembers.size === 0) return;

    switch (selectedAction) {
      case "Ban":
        setMembers((prev) =>
          prev.map((member) =>
            checkedMembers.has(member.id)
              ? { ...member, accountState: "Deactivated (Banned)" }
              : member
          )
        );
        break;

      case "Remove":
        setMembers((prev) =>
          prev.filter((member) => !checkedMembers.has(member.id))
        );
        break;

      case "Change Role":
        // Implement role change modal or direct selection
        const newRole = prompt("Enter new role:");
        if (newRole) {
          setMembers((prev) =>
            prev.map((member) =>
              checkedMembers.has(member.id)
                ? { ...member, role: newRole }
                : member
            )
          );
        }
        break;
    }

    setCheckedMembers(new Set());
    setAllChecked(false);
  };

  return (
    <div className="z-10 my-5">
      <h3 className="text-lg font-semibold mb-2">Members</h3>
      <div className="bg-white w-full rounded-xl border border-black/30 overflow-hidden p-3">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left bg-[#CCCCCC]">
              <tr className="rounded-xl">
                <th className="p-3 rounded-tl-xl rounded-bl-xl whitespace-nowrap w-[50px]">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleAllCheck}
                  />
                </th>
                <th className="p-3 whitespace-nowrap min-w-[200px]">Member</th>
                <th className="p-3 whitespace-nowrap min-w-[150px]">Role</th>
                <th className="p-3 whitespace-nowrap min-w-[150px]">
                  Date added
                </th>
                <th className="p-3 whitespace-nowrap min-w-[150px]">
                  Activity status
                </th>
                <th className="p-3 rounded-tr-xl rounded-br-xl whitespace-nowrap min-w-[200px]">
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
                  <td className="p-3 whitespace-nowrap w-[50px]">
                    <input
                      type="checkbox"
                      checked={checkedMembers.has(member.id)}
                      onChange={(event) => handleSingleCheck(event, member.id)}
                    />
                  </td>
                  <td className="p-3 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="whitespace-nowrap">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-3 min-w-[150px] whitespace-nowrap">
                    {editingMemberId === member.id ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.id, e.target.value)
                        }
                        autoFocus
                        onBlur={() => setEditingMemberId(null)}
                        className="border rounded-md p-1"
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        onClick={() => setEditingMemberId(member.id)}
                        className="cursor-pointer hover:underline"
                      >
                        {member.role}
                      </span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">{member.dateAdded}</td>
                  <td className="p-3 whitespace-nowrap">
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
                    className={`p-3 whitespace-nowrap ${
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
      </div>
      {/* Keep actions section the same */}
      <div className="flex lg:flex-row flex-col items-center mt-3 gap-2 text-center">
    <span>Actions to do with selected users:</span>
    <div className="flex flex-row justify-between w-full lg:w-fit lg:gap-2">
      <select 
        className="border border-black/30 rounded-md p-1"
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
      >
        <option value="">Options</option>
        <option>Ban</option>
        <option>Change Role</option>
        <option>Remove</option>
      </select>
      <button 
        className="px-3 py-1 bg-black text-white rounded-md text-md"
        onClick={handleActionApply}
      >
        Apply
      </button>
    </div>
  </div>
    </div>
  );
};

export default MembersList;
