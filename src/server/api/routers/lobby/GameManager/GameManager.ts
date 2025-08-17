import { EventEmitter } from "events";
import { QuoteService } from "../Quote/QuoteService";
import { LobbyEvents } from "../LobbyEvents";

export class GameLoop {
  private quoteService: QuoteService;
  private emitter: EventEmitter | null = null;
  private preGameDurationMs: number;
  private loopTimeout?: NodeJS.Timeout;
  private gameIsTurnOff: boolean;

  constructor(preGameDurationMs = 10000) {
    this.quoteService = new QuoteService();
    this.preGameDurationMs = preGameDurationMs;
    this.gameIsTurnOff = false;
  }

  initEmitter(emitter: EventEmitter) {
    this.emitter = emitter;
    this.startLoop()
  }

  setGameOnOff(flag: boolean) {
    this.gameIsTurnOff = !flag;
    if(flag) this.startLoop()
  }

  private runNextRound() {
    if (!this.emitter || this.gameIsTurnOff) return;

    const preQuote = this.quoteService.getQuote();
    this.emitter.emit(LobbyEvents.PRE_GAME, {
      quote: preQuote.text,
      endsAt: Date.now() + this.preGameDurationMs,
    });

    this.loopTimeout = setTimeout(() => {
      const gameQuote = this.quoteService.getQuote();
      this.emitter?.emit(LobbyEvents.START_GAME, {
        quote: gameQuote.text,
        durationMs: gameQuote.time,
      });

      this.loopTimeout = setTimeout(() => {
        this.runNextRound();
      }, gameQuote.time);
    }, this.preGameDurationMs);
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
