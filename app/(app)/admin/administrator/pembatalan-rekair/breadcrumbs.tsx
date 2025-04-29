"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import React from "react";

function BreadcrumbsComponent() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Administrator</BreadcrumbItem>

      <BreadcrumbItem>Pembatalan Rek AIr</BreadcrumbItem>
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;
