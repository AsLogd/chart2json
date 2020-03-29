export default class Log {
    static info(msg: string): void;
    static ok(msg: string): void;
    static warn(msg: string): void;
    static error(msg: string): void;
    static dump(obj: any): void;
}
