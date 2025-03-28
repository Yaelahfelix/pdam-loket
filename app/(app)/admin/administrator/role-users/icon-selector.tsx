import { useState } from "react";

import { icons } from "@/lib/icons";
import { SidebarIcon } from "@/types/settings";

export default function IconSelector({
  menu,
  onIconSelect,
}: {
  menu: SidebarIcon;
}) {
  const [selectedIcon, setSelectedIcon] = useState(menu.icon || null);
  const [isOpen, setIsOpen] = useState(false);

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    setIsOpen(false);
    onIconSelect(menu.id, iconName);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-3 py-2 text-sm bg-white border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <div className="flex items-center gap-2">
          {selectedIcon ? (
            <>
              {icons.find((icon) => icon.name === selectedIcon)?.component}
              <span>{selectedIcon}</span>
            </>
          ) : (
            <span>Pilih Icon</span>
          )}
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-64 p-2 mt-1 bg-white border rounded-md shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {icons.map((icon) => (
              <div
                key={icon.name}
                onClick={() => handleIconSelect(icon.name)}
                className="flex flex-col items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
              >
                {icon.component}
                <span className="mt-1 text-xs text-center">{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
