import { UsersResponseDto } from "../users.response.dto";

export type UsersResult = {
  users: UsersResponseDto[];
  page: number;
  limit: number;
  totalCount: number;
};
