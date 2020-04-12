export type Success<T> = {
	ok: true
	value: T
}

export type Failure<E> = {
	ok: false
	reason: E
}

export function Success<T>(value: T): Success<T> {
	return {
		ok: true as true,
		value
	}
}

export function Failure<E>(reason: E): Failure<E> {
	return {
		ok: false as false,
		reason
	}
}

export type Failable<T, E> = Failure<E> | Success<T>