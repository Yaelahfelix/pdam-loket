"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import React from "react";

function BreadcrumbsComponent() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Administrator</BreadcrumbItem>
      <BreadcrumbItem>User Akses</BreadcrumbItem>
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;
