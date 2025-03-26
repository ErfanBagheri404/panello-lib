import React, { useState } from "react";
import { Role } from "../../pages/Members";
import { useTheme } from "../theme-provider";
import axios from "axios";

interface RolesListProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RolesList = ({ roles, setRoles }: RolesListProps) => {
  const { theme } = useTheme();
  const [allChecked, setAllChecked] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [selectedAction, setSelectedAction] = useState<string>("");

  const handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setAllChecked(isChecked);
    setCheckedRoles(
      isChecked ? new Set(roles.map((role) => role.id)) : new Set()
    );
  };

  const handleSingleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    roleId: string
  ) => {
    const isChecked = event.target.checked;
    const updatedCheckedRoles = new Set(checkedRoles);
    isChecked
      ? updatedCheckedRoles.add(roleId)
      : updatedCheckedRoles.delete(roleId);
    setCheckedRoles(updatedCheckedRoles);
    setAllChecked(updatedCheckedRoles.size === roles.length);
  };

  const handleActionApply = async () => {
    if (!selectedAction || checkedRoles.size === 0) return;

    switch (selectedAction) {
      case "Delete":
        await Promise.all(
          Array.from(checkedRoles).map(async (roleId) => {
            await axios.delete(`/api/roles/${roleId}`);
          })
        );
        break;
        case "Duplicate":
          checkedRoles.forEach((roleId) => {
            const role = roles.find((r) => r.id === roleId);
            if (role) {
              setRoles((prev) => [
                ...prev,
                {
                  ...role,
                  id: Math.max(...prev.map((r) => parseInt(r.id))) + 1 + "", 
                  name: `${role.name} (Copy)`,
                },
              ]);
            }
          });
          break;
    }

   
    setRoles((prevRoles) =>
      prevRoles.filter((role) => !checkedRoles.has(role.id))
    );
    setCheckedRoles(new Set());
    setAllChecked(false);
  };

  return (
    <div
      className={`z-10 my-5 ${
        theme === "dark" ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">Roles</h3>
      <div
        className={`w-full rounded-xl border overflow-hidden p-3 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-black/30"
        }`}
      >
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="w-full text-sm min-w-[600px]">
            <thead
              className={`text-left ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <tr>
                <th className="p-3 rounded-tl-xl rounded-bl-xl items-center">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleAllCheck}
                  />
                </th>
                <th className="p-3">Role</th>
                <th className="p-3 rounded-tr-xl rounded-br-xl">Description</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className={`${
                    roles.indexOf(role) !== 0
                      ? "border-t " +
                        (theme === "dark"
                          ? "border-gray-600"
                          : "border-gray-200")
                      : ""
                  } ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={checkedRoles.has(role.id)}
                      onChange={(e) => handleSingleCheck(e, role.id)}
                    />
                  </td>
                  <td className="p-3">{role.name}</td>
                  <td className="p-3">{role.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col items-center mt-3 gap-2 text-center">
        <span>Actions for selected roles:</span>
        <div className="flex flex-row justify-between w-full lg:w-fit lg:gap-2">
          <select
            className={`border rounded-md p-1 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-black/30 text-gray-900"
            }`}
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="">Options</option>
            <option>Delete</option>
            <option>Edit</option>
            <option>Duplicate</option>
          </select>
          <button
            className={`px-3 py-1 rounded-md text-md ${
              theme === "dark"
                ? "bg-gray-200 text-gray-800"
                : "bg-black text-white"
            }`}
            onClick={handleActionApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolesList;
