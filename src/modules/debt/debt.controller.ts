import { Controller } from "@nestjs/common";
import { DebtService } from "./debt.service";

@Controller("/debt")
export class DebtController {
  constructor(private readonly banksService: DebtService) {}
}