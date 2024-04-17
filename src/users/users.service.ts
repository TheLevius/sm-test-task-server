import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UsersResult } from './interfaces/users-result.interface';
import { UsersResponseDto } from './users.response.dto';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	private readonly queryDefaults = {
		page: 1,
		limit: 20,
	};

	constructor(
		@InjectRepository(UsersEntity)
		private usersRepo: Repository<UsersEntity>
	) {}

	// get list of all users
	async findAll(
		queryPage: string | undefined,
		queryLimit: string | undefined
	): Promise<UsersResult> {
		const page = this.isQueryRight(queryPage)
			? parseInt(queryPage, 10)
			: this.queryDefaults.page;
		let limit = this.isQueryRight(queryPage)
			? parseInt(queryLimit, 10)
			: this.queryDefaults.limit;
		limit = [20, 40, 100, 1500].includes(limit)
			? limit
			: this.queryDefaults.limit; // constraints to prevent heavy request
		const options = {
			skip: limit * (page - 1),
			take: limit,
		};

		const [users, totalCount] = await this.usersRepo
			.findAndCount(options)
			.catch((err) => {
				this.logger.error(err);
				throw new InternalServerErrorException(err);
			});

		return {
			users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
			page,
			limit,
			totalCount,
		};
	}
	private isQueryRight(query: unknown): boolean {
		return typeof query === 'string' && !isNaN(parseInt(query, 10));
	}
}
