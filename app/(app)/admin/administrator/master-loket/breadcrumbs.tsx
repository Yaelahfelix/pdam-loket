"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import React from "react";

function BreadcrumbsComponent() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Administrator</BreadcrumbItem>
      <BreadcrumbItem>Master Loket</BreadcrumbItem>
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;
