export namespace AuthenticationActions {

    export class Login {
        static type = "[AuthState] Login";
        constructor(public payload: {
            email: string,
            hashedPassword: string
        }){}
    }

    export class Logout {
        static type = "[AuthState] Logout";
    }
}