"use client";

import { useMemo, useState } from "react";
import { deleteRole, duplicateRole, saveRole, setRolePermissions } from "@/actions/users";
import { AutoSlug, Field, inputClass } from "@/components/easy-fields";
import {
  ACTION_LABELS,
  ACTIONS,
  ALL_PERMISSION_KEYS,
  PERMISSION_GROUPS,
  RESOURCE_LABELS,
  ROLE_COLORS,
} from "@/lib/rbac-constants";

type RoleRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
};

export function RoleBuilder({
  roles,
  canCreate,
  canEdit,
  canDelete,
  canManage,
  founder,
}: {
  roles: RoleRecord[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
  founder?: boolean;
}) {
  return (
    <div className="space-y-10">
      {canCreate ? (
        <form action={saveRole} className="grid gap-4 border border-steel bg-obsidian p-6">
          <p className="font-display text-[10px] tracking-[0.22em] text-blood uppercase">
            New role
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <AutoSlug titleName="name" slugName="slug" titleLabel="Name" />
            <div className="md:col-span-2">
              <Field label="What this role can do">
                <input name="description" required className={inputClass} />
              </Field>
            </div>
            <ColorField name="color" defaultValue="#c4a574" />
          </div>
          {canManage ? <PermissionFields initial={[]} /> : null}
          <button className="h-11 w-fit border border-blood bg-blood px-4 font-display text-[11px] tracking-[0.18em] text-bone uppercase">
            Create role
          </button>
        </form>
      ) : null}

      {roles.map((role) => {
        const locked = role.slug === "founder" || role.slug === "developer";
        return (
          <article key={role.id} className="border border-steel bg-obsidian p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 border border-steel" style={{ background: role.color }} />
                  <h2 className="font-display text-2xl uppercase text-bone">{role.name}</h2>
                </div>
                <p className="mt-2 text-sm text-ash">
                  {role.description} · {role.userCount} {role.userCount === 1 ? "user" : "users"}
                </p>
                <p className="mt-2 text-xs text-mist">
                  {locked ? "This role already has every door open." : `${role.permissions.length} permissions`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {canCreate ? (
                  <form action={duplicateRole.bind(null, role.id)}>
                    <button className="border border-steel px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-mist">
                      Duplicate
                    </button>
                  </form>
                ) : null}
                {canDelete &&
                role.slug !== "founder" &&
                role.slug !== "developer" &&
                role.slug !== "band-member" &&
                role.slug !== "fan" &&
                (!role.isSystem || founder) ? (
                  <form action={deleteRole.bind(null, role.id)}>
                    <button className="border border-steel px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-ember">
                      Delete
                    </button>
                  </form>
                ) : null}
              </div>
            </div>

            {canEdit ? (
              <form action={saveRole} className="mt-6 grid gap-4 md:grid-cols-2">
                <input type="hidden" name="id" value={role.id} />
                <input type="hidden" name="slug" value={role.slug} />
                <Field label="Name">
                  <input name="name" defaultValue={role.name} className={inputClass} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="What this role can do">
                    <input name="description" defaultValue={role.description} className={inputClass} />
                  </Field>
                </div>
                <ColorField name="color" defaultValue={role.color} />
                <button className="h-11 border border-blood px-4 text-[11px] uppercase tracking-[0.16em]">
                  Save role
                </button>
              </form>
            ) : null}

            {locked ? (
              <PermissionFields initial={[...ALL_PERMISSION_KEYS]} readOnly />
            ) : canManage ? (
              <PermissionEditor roleId={role.id} initial={role.permissions} fanLocked={role.slug === "fan"} />
            ) : (
              <PermissionFields initial={role.permissions} readOnly />
            )}
          </article>
        );
      })}
    </div>
  );
}

function ColorField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [color, setColor] = useState(defaultValue);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input type="hidden" name={name} value={color} />
      <input
        type="color"
        value={color}
        onChange={(event) => setColor(event.target.value)}
        className="h-11 w-14 cursor-pointer border border-steel bg-void"
        aria-label="Role color"
      />
      {ROLE_COLORS.map((swatch) => (
        <button
          key={swatch}
          type="button"
          onClick={() => setColor(swatch)}
          className={`h-11 w-11 border sm:h-8 sm:w-8 ${color === swatch ? "border-bone" : "border-steel"}`}
          style={{ background: swatch }}
          aria-label={swatch}
        />
      ))}
    </div>
  );
}

function PermissionFields({
  initial,
  readOnly,
}: {
  initial: string[];
  readOnly?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const keys = useMemo(() => new Set(selected), [selected]);

  function toggle(key: string) {
    if (readOnly) return;
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }

  return (
    <div className="md:col-span-2">
      {!readOnly ? <input type="hidden" name="permissionsSet" value="1" /> : null}
      <PermissionTables
        selected={keys}
        readOnly={readOnly}
        onToggle={toggle}
        onGrantAll={readOnly ? undefined : () => setSelected([...ALL_PERMISSION_KEYS])}
        onClear={readOnly ? undefined : () => setSelected([])}
      />
      {!readOnly
        ? selected.map((entry) => <input key={entry} type="hidden" name="permissions" value={entry} />)
        : null}
    </div>
  );
}

function PermissionEditor({
  roleId,
  initial,
  fanLocked,
}: {
  roleId: string;
  initial: string[];
  fanLocked: boolean;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [status, setStatus] = useState<string | null>(null);
  const keys = useMemo(() => new Set(selected), [selected]);

  function toggle(key: string) {
    if (fanLocked && key.startsWith("studio:")) return;
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }

  return (
    <div className="mt-8">
      <PermissionTables
        selected={keys}
        fanLocked={fanLocked}
        onToggle={toggle}
        onGrantAll={() =>
          setSelected(ALL_PERMISSION_KEYS.filter((key) => !(fanLocked && key.startsWith("studio:"))))
        }
        onClear={() => setSelected([])}
      />
      <button
        type="button"
        onClick={async () => {
          const result = await setRolePermissions(roleId, selected);
          setStatus(result.ok ? "Permissions saved" : result.error ?? "Denied");
        }}
        className="mt-6 border border-blood bg-blood px-4 py-2 font-display text-[10px] tracking-[0.2em] text-bone uppercase"
      >
        Save permissions
      </button>
      {status ? <p className="mt-3 text-sm text-ash">{status}</p> : null}
    </div>
  );
}

function PermissionTables({
  selected,
  readOnly,
  fanLocked,
  onToggle,
  onGrantAll,
  onClear,
}: {
  selected: Set<string>;
  readOnly?: boolean;
  fanLocked?: boolean;
  onToggle: (key: string) => void;
  onGrantAll?: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="mt-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[10px] tracking-[0.22em] text-blood uppercase">
          {readOnly ? "Every permission this role has" : "Tick the pages this role may use"}
        </p>
        {onGrantAll || onClear ? (
          <div className="flex gap-3">
            {onGrantAll ? (
              <button type="button" onClick={onGrantAll} className="text-[10px] uppercase tracking-[0.16em] text-mist">
                Grant all
              </button>
            ) : null}
            {onClear ? (
              <button type="button" onClick={onClear} className="text-[10px] uppercase tracking-[0.16em] text-ash">
                Clear
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {PERMISSION_GROUPS.map((group) => (
        <section key={group.id}>
          <p className="mb-3 font-display text-[10px] tracking-[0.22em] text-ash uppercase">
            {group.label}
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr>
                  <th className="p-2 text-ash">Page</th>
                  {ACTIONS.map((action) => (
                    <th key={action} className="p-2 text-ash">
                      {ACTION_LABELS[action]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.resources.map((resource) => (
                  <tr key={resource} className="border-t border-steel">
                    <td className="p-2 text-bone">{RESOURCE_LABELS[resource]}</td>
                    {ACTIONS.map((action) => {
                      const key = `${resource}:${action}`;
                      const blocked = Boolean(fanLocked && resource === "studio");
                      return (
                        <td key={key} className="p-2">
                          <input
                            type="checkbox"
                            checked={selected.has(key)}
                            disabled={readOnly || blocked}
                            onChange={() => onToggle(key)}
                            aria-label={`${RESOURCE_LABELS[resource]} ${ACTION_LABELS[action]}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
