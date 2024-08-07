import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { User } from "src/app/_models/user.model";
import { AuthenticationService } from "../authentication.service";
import { AuthenticationActions } from "./auth.action";
import { tap } from "rxjs";

export interface AuthStateModel {
    user: User | null
}

@State<AuthStateModel>({
    name: "auth",
    defaults: {
        user: null
    }
})
@Injectable()
export class AuthState {
    constructor(private authService: AuthenticationService) {}

    @Action(AuthenticationActions.Login)
    login(ctx: StateContext<AuthStateModel>, { payload }: AuthenticationActions.Login){
        const { email, hashedPassword } = payload;
        return this.authService.login(email, hashedPassword)
        .pipe(
            tap(user => {
                ctx.patchState({
                    user
                })
            })
        )
    }
}