import { User } from '@user/user-model.type';

// DTO Response
type ResponseDto<T> = {
  items: T[];
  msg: string;
  count: number;
};

// DTO item T
type UserDto = Omit<User, 'password'>;

export type { ResponseDto, UserDto };
