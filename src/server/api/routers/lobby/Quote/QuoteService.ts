import { readFileSync } from "fs";
import path from "path";
import type { Quote } from "./Quote";

export class QuoteService {
  private quotes: Quote[];
  private lastUsed: Quote[] = [];
  private static readonly HISTORY_LIMIT = 10 as const;

  constructor(datasetPath: string = path.join(__dirname, "dataset.json")) {
    const raw = readFileSync(datasetPath, "utf-8");
    this.quotes = JSON.parse(raw) as Quote[];
    if (this.quotes.length === 0) {
      throw new Error("Dataset is empty.");
    }
  }

  public getQuote(): Quote {
    const available = this.quotes.filter((q) => !this.lastUsed.includes(q));

    if (available.length === 0) {
      this.lastUsed = [];
      return this.getQuote();
    }

    const idx = Math.floor(Math.random() * available.length);
    const chosen = available[idx]!; // dirty fix 

    this.lastUsed.push(chosen);
    if (this.lastUsed.length > QuoteService.HISTORY_LIMIT) {
      this.lastUsed.shift();
    }

    return chosen;
  }
}
