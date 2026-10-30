import { User } from '@user/user-model.type';

// DTO Response
type ResponseDto<T> = {
  items: T[];
  msg: string;
  count: number;
};

// DTO item T
type UserDto = Omit<User, 'password'>;
type UserPatch = Pick<User, 'name'> & { password: string | null };

export type { ResponseDto, UserDto, UserPatch };
