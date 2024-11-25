import { EventEmitter } from 'events';

class AppState extends EventEmitter {
  private idleTimeoutHandle?: NodeJS.Timeout;
  public state = '';
  private idleTimeout: number;

  constructor(initialTimeout = 60 * 1000) {
    super();
    this.idleTimeout = initialTimeout;
    this.set('initial');
  }

  /**
   * App states: initial -> active -> inactive -> idle
   * Opening UI switches state to active. Closing UI switches state to inactive.
   * After being inactive for a certain amount of time, switch to idle.
   * @param {string} nextState
   */

  set(nextState: string): void {
    if (nextState !== 'inactive') {
      if (this.idleTimeoutHandle) {
        clearTimeout(this.idleTimeoutHandle);
      }
    }
    if (this.state !== nextState && nextState === 'inactive') {
      if (this.idleTimeoutHandle) {
        clearTimeout(this.idleTimeoutHandle);
      }
      this.idleTimeoutHandle = setTimeout(() => {
        this.set('idle');
      }, this.idleTimeout);
    }
    if (this.state !== nextState) {
      console.log(`[state] ${this.state} -> ${nextState}`);
    }
    this.state = nextState;
    this.emit('change', nextState);
    this.emit(nextState);
  }

  updateIdleTimeout(newTimeout: number): void {
    this.idleTimeout = newTimeout;

    if (this.state === 'inactive') {
      if (this.idleTimeoutHandle) {
        clearTimeout(this.idleTimeoutHandle);
      }
      this.idleTimeoutHandle = setTimeout(() => {
        this.set('idle');
      }, this.idleTimeout);
    }
  }
}

export default AppState;
