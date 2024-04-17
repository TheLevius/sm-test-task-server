import { UserService } from './users.service';
import {
	Controller,
	DefaultValuePipe,
	Get,
	Logger,
	ParseIntPipe,
	Query,
} from '@nestjs/common';
@Controller('users')
export class UserController {
	private readonly logger = new Logger(UserController.name);
	constructor(private userService: UserService) {}

	@Get()
	async getAllUsers(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
	) {
		this.logger.log('Get all users');
		const result = await this.userService.findAll(page, limit);
		return result;
	}
}
