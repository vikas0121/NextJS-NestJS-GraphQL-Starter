import { AuthGuard } from '@auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@user/user.schema';
import { UserService } from '@user/user.service';
import deepClean from 'deep-clean';
import { get } from 'lodash';
import { GetUserInput, UpdateUserInput } from './user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) { }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput, @Context() context) {
    const userId = get(context, 'req.user._id');
    return this.userService.updateById({ userId, input: deepClean(input) });
  }

  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  async me(@Context() context) {
    return this.userService.findOne({ _id: context.req.user });
  }

  @Query(() => User, { nullable: true })
  async user(@Args('input') input: GetUserInput) {
    return this.userService.findOne({ permalink: input.userPermalink });
  }
}
