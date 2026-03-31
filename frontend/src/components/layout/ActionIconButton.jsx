import { Edit2, Trash2 } from "lucide-react";

function joinClassNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

const toneClassNames = {
  light:
    "border-white/55 bg-white/72 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur-md",
  dark: "border-[#ffe1b0]/28 bg-[rgba(255,214,145,0.16)] backdrop-blur-md",
};

const intentClassNames = {
  edit: {
    light: "text-blue-700 hover:bg-blue-50 hover:text-blue-800",
    dark: "text-blue-100 hover:bg-blue-500/28 hover:text-white",
  },
  delete: {
    light: "text-red-700 hover:bg-red-50 hover:text-red-800",
    dark: "text-red-100 hover:bg-red-500/28 hover:text-white",
  },
};

export default function ActionIconButton({
  icon: Icon,
  label,
  onClick,
  tone = "light",
  intent = "edit",
  className = "",
  stopPropagation = false,
}) {
  const handleClick = (event) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    onClick?.(event);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={joinClassNames(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623]",
        toneClassNames[tone] || toneClassNames.light,
        intentClassNames[intent]?.[tone] || intentClassNames.edit.light,
        className,
      )}
      aria-label={label}
      title={label}
    >
      {Icon ? <Icon size={18} /> : null}
    </button>
  );
}

export function EditActionButton({
  label = "Upravit",
  tone = "light",
  onClick,
  className = "",
  stopPropagation = false,
}) {
  return (
    <ActionIconButton
      icon={Edit2}
      label={label}
      tone={tone}
      onClick={onClick}
      className={className}
      stopPropagation={stopPropagation}
    />
  );
}

export function DeleteActionButton({
  label = "Smazat",
  tone = "light",
  onClick,
  className = "",
  stopPropagation = false,
}) {
  return (
    <ActionIconButton
      icon={Trash2}
      label={label}
      tone={tone}
      intent="delete"
      onClick={onClick}
      className={className}
      stopPropagation={stopPropagation}
    />
  );
}
