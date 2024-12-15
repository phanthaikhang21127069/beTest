import { Body, Controller, Get, Header, HttpCode, HttpException, HttpStatus, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { CreateAccountDto, ForgetPasswordDto, ChangePasswordDto, SignInDto, VerifyForgetPasswordOtpDto, UpdateInfoDto } from "src/dtos/account.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { AccountInfo } from "src/schemas/account_info.schema";
import { AccessAuthGuard } from "src/auth/access.guard";
import { Role } from "src/utils/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/role.guard";
import { RefreshAuthGuard } from "src/auth/refresh.guard";
import { Request } from "express";
import { PaymentAccount } from "src/schemas/payment_account.schema";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("accounts")
@Controller("/accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

//   @Get()
//   async getAll(): Promise<string | AccountInfo[]> {
//     const tasks = await this.accountsService.logIn();
  
//     if (tasks.length > 0) return tasks
//     return "No task data in DB"
//   }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string, refresh_token: string }> {
        return this.accountsService.signIn(signInDto);
    }

    @UseGuards(RefreshAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.CUSTOMER, Role.EMPLOYEE)
    @HttpCode(HttpStatus.OK)
    @Post('refresh-auth')
    async refresh(@Req() request: Request)
    {   
        const token = request['refresh_token']
        return this.accountsService.refreshTokens(token)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('forget-password')
    async forgetPassword(@Query('email') email: string): Promise<boolean> {
        return this.accountsService.sendForgetPasswordOTP(email)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('verify-password-otp')
    async verifyForgetPasswordOtp(@Body() verifyForgetPasswordOtp: VerifyForgetPasswordOtpDto): Promise<{ success: boolean, message: string, token: string }> {
        return this.accountsService.verifyForgetPasswordOTP(verifyForgetPasswordOtp)
    }

    @UseGuards(AccessAuthGuard, RolesGuard)
    @Roles(Role.CUSTOMER)
    @HttpCode(HttpStatus.CREATED)
    @Post('change-password')
    async changePassword(@Body() changePasswordOtp: ChangePasswordDto): Promise<AccountInfo> {
        return this.accountsService.changePassword(changePasswordOtp)
    }

    @UseGuards(AccessAuthGuard, RolesGuard)
    @Roles(Role.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    @Get('payment-account')
    async getPaymentAccount(@Req() req: Request): Promise<PaymentAccount> {
        return this.accountsService.getPaymentAccountInfo(req['user'].sub)
    }

    @UseGuards(AccessAuthGuard, RolesGuard)
    @Roles(Role.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    @Put('update-info')
    async updateInfo(@Req() req: Request, @Body() updateInfoDto: UpdateInfoDto): Promise<boolean> {
        return this.accountsService.updateInfo(req['user'].sub, updateInfoDto)
    }

    // TODO: MOVE THIS TO EMPLOYEE'S API AND RESTRICT ACCESS
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() body: CreateAccountDto): Promise<string | AccountInfo> {
        const newTask = await this.accountsService.create(body)

        if (newTask)
            return newTask
        return "Failed to insert new task"
    }
}