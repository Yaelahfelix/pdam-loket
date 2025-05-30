"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import React from "react";

function BreadcrumbsComponent() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Tim Penagihan</BreadcrumbItem>
      <BreadcrumbItem>DRD Tim Penagihan</BreadcrumbItem>
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;
