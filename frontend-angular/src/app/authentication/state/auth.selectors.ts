import { Selector } from "@ngxs/store";
import { AuthState, AuthStateModel } from "./auth.state";
import { User } from "src/app/_models/user.model";

export class AuthStateSelectors {

    @Selector([AuthState])
    static user(state: AuthStateModel): User | null {
        return structuredClone(state.user);
    }

    @Selector([AuthStateSelectors.user])
    static isAuthenticated(user: User): boolean {
        return !!user;
    }

    @Selector([AuthStateSelectors.user])
    static isAdmin(user: User): boolean {
        return user?.isAdmin;
    }


}