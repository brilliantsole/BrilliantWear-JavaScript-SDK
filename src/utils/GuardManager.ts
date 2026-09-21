import { createConsole } from "./Console.ts";

const _console = createConsole("GuardManager");

export type Guard<TArgs extends unknown[]> = (...args: TArgs) => boolean;

export type GuardManagerOptions = {
  signal?: AbortSignal;
};
export const DefaultGuardManagerOptions: GuardManagerOptions = {};

export type GuardManagerObject<TArgs extends unknown[]> = {
  guard: Guard<TArgs>;
  signalAbortController?: AbortController;
} & GuardManagerOptions;

class GuardManager<TArgs extends unknown[]> {
  #guardObjects: GuardManagerObject<TArgs>[] = [];
  #findGuardObjectByGuard(guard: Guard<TArgs>) {
    return this.#guardObjects.find((guardObject) => guardObject.guard == guard);
  }

  add(
    guard: Guard<TArgs>,
    options: GuardManagerOptions = structuredClone(DefaultGuardManagerOptions),
  ): void {
    if (this.#findGuardObjectByGuard(guard)) {
      _console.log("already added guard", guard);
      return;
    }
    let signalAbortController: AbortController | undefined;
    if (options?.signal) {
      signalAbortController = new AbortController();
      options.signal.addEventListener(
        "abort",
        () => {
          this.remove(guard);
        },
        { once: true, signal: signalAbortController.signal },
      );
    }
    const { signal } = options;
    this.#guardObjects.push({ guard, signal, signalAbortController });
  }

  remove(guard: Guard<TArgs>): void {
    const guardObject = this.#findGuardObjectByGuard(guard);
    if (!guardObject) {
      return;
    }
    guardObject.signalAbortController?.abort();
    this.#guardObjects.splice(this.#guardObjects.indexOf(guardObject), 1);
  }

  evaluate(...args: TArgs): boolean {
    return this.#guardObjects.every((guardObjects) =>
      guardObjects.guard(...args),
    );
  }

  clear() {
    this.#guardObjects.forEach((guardObject) => {
      this.remove(guardObject.guard);
    });
  }

  get length() {
    return this.#guardObjects.length;
  }
  get isEmpty() {
    return this.length == 0;
  }
}

export default GuardManager;
