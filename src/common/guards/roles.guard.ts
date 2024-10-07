import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "../decoraters/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector) { }
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const user = request.currentUser

         if (!user || !user.roles) {
      return false;  // Deny access if no user or roles found
    }
        // console.log("usr", user)
                return user.roles.some(role => roles.includes(role));

    }
}