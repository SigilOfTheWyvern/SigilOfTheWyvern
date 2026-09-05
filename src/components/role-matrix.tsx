"use client";

import { useState } from "react";
import { setRolePermissions } from "@/actions/users";
import { ACTIONS, RESOURCES } from "@/lib/rbac-constants";

export function RoleMatrix({
  roleId,
  initial,
}: {
  roleId: string;
  initial: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [status, setStatus] = useState<string | null>(null);

  function toggle(key: string) {
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-xs">
        <thead>
          <tr>
            <th className="p-2 text-ash">Resource</th>
            {ACTIONS.map((action) => (
              <th key={action} className="p-2 text-ash">{action}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RESOURCES.map((resource) => (
            <tr key={resource} className="border-t border-steel">
              <td className="p-2 text-bone">{resource}</td>
              {ACTIONS.map((action) => {
                const key = `${resource}:${action}`;
                return (
                  <td key={key} className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(key)}
                      onChange={() => toggle(key)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={async () => {
          const result = await setRolePermissions(roleId, selected);
          setStatus(result.ok ? "Saved" : "Denied");
        }}
        className="mt-4 border border-blood px-4 py-2 font-display text-[10px] tracking-[0.2em] uppercase"
      >
        Save permissions
      </button>
      {status ? <p className="mt-2 text-ash">{status}</p> : null}
    </div>
  );
}
