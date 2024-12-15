import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateAccountDto, SignInDto } from "src/dtos/account.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { AccountInfo } from "src/schemas/account_info.schema";

@Controller("/customers")
export class CustomersController {
  constructor(private readonly accountsService: CustomersService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto) {
        return this.accountsService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    test() {
        return "fasdfd";
    }
}