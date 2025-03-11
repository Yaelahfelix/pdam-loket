import { NextRequest, NextResponse } from "next/server";
import { Pool } from "mysql2/promise";
import { RowDataPacket } from "mysql2";

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function getPaginationParams(
  request: Request | NextRequest
): PaginationParams {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (isNaN(page) || page < 1) {
    throw new Error("Invalid page parameter. Must be a positive integer.");
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new Error("Invalid limit parameter. Must be between 1 and 100.");
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export async function getPaginatedData<T extends RowDataPacket>(
  db: Pool,
  baseQuery: string,
  countQuery: string = `SELECT COUNT(*) as total FROM (${baseQuery}) as countTable`,
  params: any[] = [],
  paginationParams: PaginationParams
): Promise<PaginatedResult<T>> {
  const paginatedQuery = `${baseQuery} LIMIT ? OFFSET ?`;
  const allParams = [
    ...params,
    paginationParams.limit,
    paginationParams.offset,
  ];

  const [countResult] = await db.query<RowDataPacket[]>(countQuery, params);
  const [dataResult] = await db.query<T[]>(paginatedQuery, allParams);

  const totalRecords = countResult[0].total;
  const totalPages = Math.ceil(totalRecords / paginationParams.limit);

  const paginationMeta: PaginationMeta = {
    currentPage: paginationParams.page,
    totalPages,
    limit: paginationParams.limit,
    totalRecords,
    hasNextPage: paginationParams.page < totalPages,
    hasPrevPage: paginationParams.page > 1,
  };

  return {
    data: dataResult as T[],
    pagination: paginationMeta,
  };
}

export async function withPagination<T extends RowDataPacket>(
  request: Request | NextRequest,
  dataCallback: (
    db: Pool,
    params: PaginationParams
  ) => Promise<PaginatedResult<T>>
) {
  try {
    const paginationParams = getPaginationParams(request);

    const result = await dataCallback(
      await import("@/lib/db").then((m) => m.default()),
      paginationParams
    );

    return NextResponse.json({
      status: 200,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        status: error.status || 500,
        message: error.message || "Internal server error",
      },
      { status: error.status || 500 }
    );
  }
}
