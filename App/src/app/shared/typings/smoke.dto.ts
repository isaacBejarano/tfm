// Response
type DtoResponse<T> = {
  items: T[];
  msg: string;
  count: number;
};

// Dto (~models)
type DtoId = { id: string };

export type { DtoId, DtoResponse };
