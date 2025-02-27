import React, { useState } from "react";
import { Role } from "../../pages/Members";
interface RolesListProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RolesList = ({ roles, setRoles }: RolesListProps) => {
  const [allChecked, setAllChecked] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState<Set<number>>(new Set());
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
    roleId: number
  ) => {
    const isChecked = event.target.checked;
    const updatedCheckedRoles = new Set(checkedRoles);
    isChecked
      ? updatedCheckedRoles.add(roleId)
      : updatedCheckedRoles.delete(roleId);
    setCheckedRoles(updatedCheckedRoles);
    setAllChecked(updatedCheckedRoles.size === roles.length);
  };

  const handleActionApply = () => {
    if (!selectedAction || checkedRoles.size === 0) return;

    switch (selectedAction) {
      case "Delete":
        setRoles((prev) => prev.filter((role) => !checkedRoles.has(role.id)));
        break;

      case "Edit":
        checkedRoles.forEach((roleId) => {
          const role = roles.find((r) => r.id === roleId);
          if (role) {
            const newName = prompt("Edit role name:", role.name);
            const newDesc = prompt("Edit role description:", role.description);
            if (newName && newDesc) {
              setRoles((prev) =>
                prev.map((r) =>
                  r.id === roleId
                    ? { ...r, name: newName, description: newDesc }
                    : r
                )
              );
            }
          }
        });
        break;

      case "Duplicate":
        checkedRoles.forEach((roleId) => {
          const role = roles.find((r) => r.id === roleId);
          if (role) {
            setRoles((prev) => [
              ...prev,
              {
                ...role,
                id: Math.max(...prev.map((r) => r.id)) + 1,
                name: `${role.name} (Copy)`,
              },
            ]);
          }
        });
        break;
    }

    setCheckedRoles(new Set());
    setAllChecked(false);
  };

  return (
    <div className="z-10 my-5">
      <h3 className="text-lg font-semibold mb-2">Roles</h3>
      <div className="bg-white w-full rounded-xl border border-black/30 overflow-hidden p-3">
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="text-left bg-[#CCCCCC]">
              <tr className="rounded-xl">
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
                    roles.indexOf(role) !== 0 ? "border-t border-gray-200" : ""
                  } hover:bg-gray-50`}
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

      {/* Actions Section */}

      <div className="flex lg:flex-row flex-col items-center mt-3 gap-2 text-center">
        <span>Actions for selected roles:</span>
        <div className="flex flex-row justify-between w-full lg:w-fit lg:gap-2">
          <select
            className="border border-black/30 rounded-md p-1"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="">Options</option>
            <option>Delete</option>
            <option>Edit</option>
            <option>Duplicate</option>
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

export default RolesList;
