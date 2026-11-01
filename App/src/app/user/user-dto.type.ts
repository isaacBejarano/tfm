import { User } from '@user/user-model.type';

type UserPayloadSignup = Pick<User, 'email' | 'password'> & { name: string | null };
type UserPayloadLogin = Pick<User, 'email' | 'password'>;
type UserPayloadEdit = { password: string | null; name: string | null };

type UserDto = Omit<User, 'password'>;

export type { UserDto, UserPayloadEdit, UserPayloadLogin, UserPayloadSignup };
