
const Reset = "\x1b[0m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgWhite = "\x1b[37m"

export default class Log {

	static info(msg: string) {
		console.info(FgWhite, msg, Reset)
	}

	static ok(msg: string) {
		console.info(FgGreen,msg,Reset)
	}

	static warn(msg: string) {
		console.info(FgYellow, msg, Reset)
	}

	static error(msg: string) {
		console.info(FgRed, msg, Reset)
	}

	static dump(obj: any) {
		console.info(obj)
	}
}