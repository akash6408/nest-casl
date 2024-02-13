import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/ability.factory';
import { User } from './entities/user.entity';
import { ForbiddenError } from '@casl/ability';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private abilityFactory: AbilityFactory) { }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   const user = {id: 1 , isAdmin: true};

  //   const ability = this.abilityFactory.defineAbility(user);
  //   const isAllowed = ability.can(Action.Create, User);

  //   if(!isAllowed) throw new ForbiddenException('Only admin can create a new user.');

  //   return this.usersService.create(createUserDto);
  // }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = { id: 1, isAdmin: false };

    const ability = this.abilityFactory.defineAbility(user);

    try {
      ForbiddenError.from(ability).setMessage('ony admin').throwUnlessCan(Action.Create, user)

      return this.usersService.create(createUserDto);

    } catch (error) {
      if (error instanceof ForbiddenError) throw new ForbiddenException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
