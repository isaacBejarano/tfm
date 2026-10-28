import { User } from '@user/user-model.type';

// Response
type DtoResponse<T> = {
  items: T[];
  msg: string;
  count: number;
};

// Dto
type DtoUser = Omit<User, 'password'>;

export type { DtoResponse, DtoUser };
