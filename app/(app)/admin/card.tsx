import CountUp from "@/components/ui/CountUp/CountUp";
import { Card, CardBody } from "@heroui/react";
import React from "react";

type Props = { value: number; title: string };

const CardStatus = ({ value, title }: Props) => {
  return (
    <Card className="bg-background border border-border w-full">
      <CardBody className="p-5">
        <div className="flex flex-col gap-3">
          <p>{title}</p>
          <CountUp
            from={0}
            to={value}
            separator=","
            direction="up"
            duration={0.3}
            className="text-xl font-bold"
            //   className="count-up-text"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default CardStatus;
