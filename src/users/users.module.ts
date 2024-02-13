import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [AbilityModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
