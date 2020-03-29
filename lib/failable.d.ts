export declare type Success<T> = {
    tag: "success";
    value: T;
};
export declare type Failure<E> = {
    tag: "failure";
    reason: E;
};
export declare function Success<T>(value: T): Success<T>;
export declare function Failure<E>(reason: E): Failure<E>;
export declare type Failable<T, E> = Failure<E> | Success<T>;
