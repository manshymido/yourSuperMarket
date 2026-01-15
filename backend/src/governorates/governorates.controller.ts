import { Controller, Get } from '@nestjs/common';
import { GovernoratesService } from './governorates.service';

@Controller('governorates')
export class GovernoratesController {
  constructor(private readonly governoratesService: GovernoratesService) {}

  @Get()
  findAll() {
    return this.governoratesService.findAll();
  }
}
