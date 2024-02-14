import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { AbilityBuilder, InferSubjects, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { PureAbility } from "@casl/ability";

export enum Action {
    Manage = 'manage', // manage is a special keyword in CASL which represents "any" action.
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
  }

export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
    defineAbility(user: User) {
        const {can, cannot, build} = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>);

        if(user.isAdmin) {
            can(Action.Read, 'all');
            can(Action.Create, 'all');

            // The below condition is not working & we need to debug it as it is an important check for matching an admin's organization ID to the user's organization ID so that the admin of a different organization cannot manage the user of any different organization.

            // can(Action.Manage, User, { orgId: user.orgId } );
        } else {
            can(Action.Read, 'all');
        }

        return build({
            detectSubjectType: (item) =>
            item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
