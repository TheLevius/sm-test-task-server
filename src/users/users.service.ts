import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "./users.entity";
import { Repository } from "typeorm";
import { UsersResult } from "./interfaces/users-result.interface";
import { UsersResponseDto } from "./users.response.dto";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(page: number, limit: number): Promise<UsersResult> {
    limit = [20, 40, 100, 1500].includes(limit) ? limit : 20; // constraints to prevent heavy request
    const options = {
      skip: limit * (page - 1),
      take: limit,
    };

    const [users, totalCount] = await this.usersRepo.findAndCount(options).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    });

    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages) {
      throw new NotFoundException(`Request page: ${page} bigger than total pages: ${totalPages}`);
    }

    return {
      users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      page,
      limit,
      totalCount,
    };
  }
}
