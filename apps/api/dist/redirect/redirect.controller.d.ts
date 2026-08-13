import type { Response, Request } from 'express';
import { RedirectService } from './redirect.service';
export declare class RedirectController {
    private readonly redirectService;
    constructor(redirectService: RedirectService);
    redirect(shortCode: string, res: Response, req: Request): Promise<void>;
}
