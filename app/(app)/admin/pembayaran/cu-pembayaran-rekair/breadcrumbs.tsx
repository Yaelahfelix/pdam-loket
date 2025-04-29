"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import React from "react";

function BreadcrumbsComponent() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Pembayaran</BreadcrumbItem>
      <BreadcrumbItem>CU Pembayaran Rek Air</BreadcrumbItem>
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;
