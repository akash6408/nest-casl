import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';
import { ForbiddenError } from '@casl/ability';
import { RequiredRole } from './ability.decorator';
import { CHECK_ABILITY } from './ability.decorator';
import { currentUser } from './current-user';

@Injectable()
export class AbilityGuard implements CanActivate {
    constructor(private reflector: Reflector, private abilityFactory: AbilityFactory) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const rules = this.reflector.get<RequiredRole[]>(CHECK_ABILITY, context.getHandler())

        const user = currentUser;
        const ability = this.abilityFactory.defineAbility(user);

        try{
            rules.forEach((rule) => {
                ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
            })

            return true;
        }
        catch(error) {
            if(error instanceof ForbiddenError){
                throw new ForbiddenException(error.message);
            }
        }
    }
}