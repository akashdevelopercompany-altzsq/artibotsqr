import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        };
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        };
    }>;
    logout(res: Response): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    private setCookies;
}
