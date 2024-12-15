import { ApiProperty } from "@nestjs/swagger"

export class SignInDto {
    @ApiProperty()
    email: string
    
    @ApiProperty()
    password: string
}

export class CreateAccountDto {
    @ApiProperty()
    role: string
    
    @ApiProperty()
    username: string
    
    @ApiProperty()
    password: string
    name: string
    
    @ApiProperty()
    email: string
    
    @ApiProperty()
    phone: string
}

export class ForgetPasswordDto {
    @ApiProperty()
    email: string
}

export class VerifyForgetPasswordOtpDto {
    @ApiProperty()
    email: string
    
    @ApiProperty()
    otp: string
}

export class ChangePasswordDto {
    @ApiProperty()
    email: string
    
    @ApiProperty()
    hashed_password: string
}

export class UpdateInfoDto {
    @ApiProperty()
    name?: string | null
    
    @ApiProperty()
    email?: string | null
    
    @ApiProperty()
    phone?: string | null
}