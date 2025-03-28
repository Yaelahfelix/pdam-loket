"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import React from "react";

function BreadcrumbsComponent() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Laporan</BreadcrumbItem>
      <BreadcrumbItem>LPP Rek Air</BreadcrumbItem>
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;
