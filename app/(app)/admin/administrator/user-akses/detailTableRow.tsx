"use client";

import { User } from "@/types/user";
import { Accordion, AccordionItem, Alert, Divider } from "@heroui/react";

export const tableDetail = (user: User) => {
  return (
    <div className="p-4">
      <div>
        <h4 className="font-semibold">Detail Loket User</h4>
      </div>
      <Divider className="my-3" />
      <div className="flex gap-3 flex-wrap">
        {user.loket_array?.map((loket) => (
          <Alert
            color="primary"
            title={`${loket.loket}`}
            hideIcon
            className="max-w-fit"
          />
        ))}
      </div>
    </div>
  );
};

export const canTableDetail = (user: User) => {
  return user.loket_array?.length !== 0 && user.loket_array !== null;
};
