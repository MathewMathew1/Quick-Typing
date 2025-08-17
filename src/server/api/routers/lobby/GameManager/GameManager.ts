import { EventEmitter } from "events";
import { QuoteService } from "../Quote/QuoteService";
import { LobbyEvents } from "../LobbyEvents";
import type { Quote } from "../Quote/Quote";

export class GameLoop {
  private quoteService: QuoteService;
  private emitter: EventEmitter | null = null;
  private preGameDurationMs: number;
  private loopTimeout?: NodeJS.Timeout;
  private gameIsTurnOff: boolean;
  public currentQuote: Quote | null = null;

  constructor(preGameDurationMs = 10000) {
    this.quoteService = new QuoteService();
    this.preGameDurationMs = preGameDurationMs;
    this.gameIsTurnOff = false;
  }

  initEmitter(emitter: EventEmitter) {
    this.emitter = emitter;
    this.startLoop();
  }

  setGameOnOff(flag: boolean) {
    this.gameIsTurnOff = !flag;
    if (flag) this.startLoop();
  }

  private runNextRound() {
    if (!this.emitter || this.gameIsTurnOff) return;

    this.currentQuote = this.quoteService.getQuote();

    const now = Date.now();

    this.emitter.emit(LobbyEvents.PRE_GAME, {
      quote: this.currentQuote.text,
      endsAt: now + this.preGameDurationMs,
    });


    this.loopTimeout = setTimeout(() => {
      this.emitter?.emit(LobbyEvents.START_GAME, {
        quote: this.currentQuote!.text,
        durationMs: this.currentQuote!.time * 1000,
      });


     
    }, this.preGameDurationMs);
    this.loopTimeout = setTimeout(() => {
      this.runNextRound();
    }, this.currentQuote.time * 1000)
     
  }

  startLoop() {
    if (this.loopTimeout || !this.emitter) return;
    this.runNextRound();
  }

  stopLoop() {
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = undefined;
    }
  }
}
