// DTO Response
type ResponseDto<T> = {
  items: T[];
  msg: string;
  count: number;
};

export type { ResponseDto };
