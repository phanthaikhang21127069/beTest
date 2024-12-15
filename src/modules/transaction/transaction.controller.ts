import { Controller } from "@nestjs/common";
import { TransactionService } from "./transaction.service";

@Controller("/debt")
export class TransactionController {
  constructor(private readonly banksService: TransactionService) {}
}