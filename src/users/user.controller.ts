import { UserService } from "./users.service";
import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ParseIntWithDefault } from "./pipes/parse-int-with-default.pipe";

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query("page", new ParseIntWithDefault(1)) page: number,
    @Query("limit", new ParseIntWithDefault(20)) limit: number,
  ) {
    this.logger.log("Get all users");
    const result = await this.userService.findAll(page, limit);
    return result;
  }
}
