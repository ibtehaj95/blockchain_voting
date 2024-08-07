import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthStateSelectors } from "../authentication/state/auth.selectors";

@Injectable({
    providedIn: "root"
})
export class IsAdminGuard {
    constructor(private store: Store) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.store.select(AuthStateSelectors.isAdmin);
    }
    
}