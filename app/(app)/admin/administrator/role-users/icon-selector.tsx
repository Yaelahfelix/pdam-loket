import { useState } from "react";

import { icons } from "@/lib/icons";
import { SidebarIcon } from "@/types/settings";
import { Button } from "@heroui/react";
import { ChevronDown } from "lucide-react";

export default function IconSelector({
  menu,
  onIconSelect,
}: {
  menu: SidebarIcon;
  onIconSelect: any;
}) {
  const [selectedIcon, setSelectedIcon] = useState(menu.icon || null);
  const [isOpen, setIsOpen] = useState(false);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setIsOpen(false);
    onIconSelect(menu.id, iconName);
  };

  return (
    <div className="relative">
      <Button
        className="w-48"
        variant="bordered"
        endContent={<ChevronDown />}
        onPress={() => setIsOpen(!isOpen)}
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
      </Button>

      {isOpen && (
        <div className="absolute z-10 w-64 p-2 mt-1 bg-white dark:bg-slate-900 border rounded-md shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {icons.map((icon) => (
              <div
                key={icon.name}
                onClick={() => handleIconSelect(icon.name)}
                className="flex flex-col items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
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
