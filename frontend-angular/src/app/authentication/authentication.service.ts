import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../_models/user.model";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    constructor(private http: HttpClient) {}

    login(email: string, hashedPassword: string): Observable<User>{
        return this.http.post<User>("", {email, hashedPassword})
    }
}