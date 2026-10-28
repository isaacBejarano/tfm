import { User } from '@user/user-model.type';

// DTO Response
type DtoResponse<T> = {
  items: T[];
  msg: string;
  count: number;
};

// DTO item T
type DtoUser = Omit<User, 'password'>;

export type { DtoResponse, DtoUser };
