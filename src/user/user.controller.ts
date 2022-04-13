import {Body, Controller, Logger, Post } from '@nestjs/common';
import {UserService} from "./user.service";
import {Register, UserInfo, Login} from "./user.type";
import {loginSchema, registerSchema} from "./user.schema";
import {ResponseMessage, Response} from "../util/response.util";
import {ValidationError} from "joi";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("register")
    public async addUser(@Body() register: Register): Promise<Response> {
        try {
            const { value, error }: {
                value: Register,
                error?: ValidationError;
            } = registerSchema.validate(register);

            if(error){
                Logger.error(error);
                return new ResponseMessage().error(999).body("Parameter Error").build();
            }

            const user: UserInfo = await this.userService.addUser(value);
            return new ResponseMessage().success().body(user).build();
        } catch (err){
            Logger.error(err);
        }
    }

    @Post('login')
    public async login(@Body() login: Login): Promise<Response> {
        const { value, error }: {
            value: Login,
            error?: ValidationError;
        } = loginSchema.validate(login);

        if (error) {
            Logger.error(error);
            return new ResponseMessage().error(999).body("Parameter Error").build();
        }

        const user = await this.userService.login(value);

        if(!user) return new ResponseMessage().error(999, "Login Error").build();

        return new ResponseMessage().success().body(user).build();
    }

}
