import React, { useState } from "react";
import { IoEllipse } from "react-icons/io5";
import { useTheme } from "../theme-provider";
import { useLanguage } from "../language-provider"; // Add this import
import translations from "../../data/translations";
import { MembersListProps } from "../../types";

const MembersList = ({ members, setMembers, roles }: MembersListProps) => {
  const { language } = useLanguage(); // Added hook
  const { theme } = useTheme();
  const [allChecked, setAllChecked] = useState(false);
  const [checkedMembers, setCheckedMembers] = useState<Set<string>>(new Set());
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
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
    memberId: string
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

  const handleRoleChange = (memberId: string, newRole: string) => {
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
      case translations[language].banAction:
        setMembers((prev) =>
          prev.map((member) =>
            checkedMembers.has(member.id)
              ? {
                  ...member,
                  accountState: translations[language].deactivatedBanned,
                }
              : member
          )
        );
        break;
      case translations[language].removeAction:
        setMembers((prev) =>
          prev.filter((member) => !checkedMembers.has(member.id))
        );
        break;
      case translations[language].changeRoleAction:
        const newRole = prompt(translations[language].promptChangeRole);
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
    <div
      className={`z-10 my-5 ${
        theme === "dark" ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">
        {translations[language].membersListHeader} {/* Members header */}
      </h3>
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-black/30"
        } w-full rounded-xl border overflow-hidden p-3`}
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full text-sm"
            dir={language === "fa" ? "rtl" : "ltr"}
          >
            <thead
              className={`text-left rtl:text-right ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-300"
              }`}
              style={{ textAlign: "left" }}
            >
              <tr>
                <th
                  className={`p-3 rtl:text-right ${
                    language === "fa"
                      ? "rounded-tr-xl rounded-br-xl"
                      : "rounded-tl-xl rounded-bl-xl"
                  } whitespace-nowrap w-[50px]`}
                >
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleAllCheck}
                  />
                </th>
                <th className="p-3 whitespace-nowrap rtl:text-right min-w-[200px]">
                  {translations[language].memberHeader} {/* Member */}
                </th>
                <th className="p-3 whitespace-nowrap rtl:text-right min-w-[150px]">
                  {translations[language].roleHeader} {/* Role */}
                </th>
                <th className="p-3 whitespace-nowrap rtl:text-right min-w-[150px]">
                  {translations[language].dateAddedHeader} {/* Date added */}
                </th>
                <th className="p-3 whitespace-nowrap rtl:text-right min-w-[150px]">
                  {translations[language].activityStatusHeader}{" "}
                  {/* Activity status */}
                </th>
                <th
                  className={`p-3 rtl:text-right ${
                    language === "fa"
                      ? "rounded-tl-xl rounded-bl-xl"
                      : "rounded-tr-xl rounded-br-xl"
                  } whitespace-nowrap min-w-[200px]`}
                >
                  {translations[language].accountStateHeader}{" "}
                  {/* Account state */}
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className={`${
                    members.indexOf(member) !== 0
                      ? "border-t " +
                        (theme === "dark"
                          ? "border-gray-600"
                          : "border-gray-200")
                      : ""
                  } ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
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
                        className="w-8 h-8 rounded-full object-cover"
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
                        className={`border rounded-md p-1 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-black/30"
                        }`}
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
                      member.accountState.includes(
                        translations[language].deactivatedBanned
                      )
                        ? theme === "dark"
                          ? "text-red-400"
                          : "text-red-500"
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
      <div className="flex lg:flex-row flex-col items-center mt-3 gap-2 text-center">
        <span>{translations[language].actionsSelectedUsers}</span>{" "}
        {/* Actions message */}
        <div className="flex flex-row justify-between w-full lg:w-fit lg:gap-2">
          <select
            className={`border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-black/30 text-gray-900"
            } rounded-md p-1`}
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="">{translations[language].actionOptions}</option>{" "}
            {/* Options placeholder */}
            <option>{translations[language].banAction}</option> {/* Ban */}
            <option>{translations[language].changeRoleAction}</option>{" "}
            {/* Change Role */}
            <option>{translations[language].removeAction}</option>{" "}
            {/* Remove */}
          </select>
          <button
            className={`px-3 py-1 rounded-md text-md ${
              theme === "dark"
                ? "bg-gray-200 text-gray-800"
                : "bg-black text-white"
            }`}
            onClick={handleActionApply}
          >
            {translations[language].applyAction} {/* Apply */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersList;
