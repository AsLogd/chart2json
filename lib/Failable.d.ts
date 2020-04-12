export declare type Success<T> = {
    ok: true;
    value: T;
};
export declare type Failure<E> = {
    ok: false;
    reason: E;
};
export declare function Success<T>(value: T): Success<T>;
export declare function Failure<E>(reason: E): Failure<E>;
export declare type Failable<T, E> = Failure<E> | Success<T>;
