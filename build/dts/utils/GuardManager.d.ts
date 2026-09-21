export type Guard<TArgs extends unknown[]> = (...args: TArgs) => boolean;
export type GuardManagerOptions = {
    signal?: AbortSignal;
};
export declare const DefaultGuardManagerOptions: GuardManagerOptions;
export type GuardManagerObject<TArgs extends unknown[]> = {
    guard: Guard<TArgs>;
    signalAbortController?: AbortController;
} & GuardManagerOptions;
declare class GuardManager<TArgs extends unknown[]> {
    #private;
    add(guard: Guard<TArgs>, options?: GuardManagerOptions): void;
    remove(guard: Guard<TArgs>): void;
    evaluate(...args: TArgs): boolean;
    clear(): void;
    get length(): number;
    get isEmpty(): boolean;
}
export default GuardManager;
