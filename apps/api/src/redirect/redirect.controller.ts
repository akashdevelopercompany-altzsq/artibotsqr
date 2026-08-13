import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { RedirectService } from './redirect.service';

@Controller('q')
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const destinationUrl = await this.redirectService.resolveShortCode(shortCode);
    
    // Perform 302 Found redirect
    // (We use 302 rather than 301 to ensure the browser doesn't cache the redirect permanently,
    // otherwise if the dynamic QR destination changes, the browser won't fetch the new URL)
    res.redirect(302, destinationUrl);
  }
}
