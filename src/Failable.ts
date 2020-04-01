export type Success<T> = {
	tag: "success"
	value: T
}

export type Failure<E> = {
	tag: "failure"
	reason: E
}

export function Success<T>(value: T): Success<T> {
	return {
		tag: "success",
		value
	}
}

export function Failure<E>(reason: E): Failure<E> {
	return {
		tag: "failure",
		reason
	}
}

export type Failable<T, E> = Failure<E> | Success<T>