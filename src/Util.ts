// Groups a list of objects by the value of a given key
export function groupBy<T extends any>(list: T[], key: string): {[key: string]: T[]} {
	const groups:{[key: string]: T[]} = {}
	list.forEach(e => {
		if(!groups[e[key]]) {
			groups[e[key]] = [e]
		} else {
			groups[e[key]].push(e)
		}
	})
	return groups
}
export function extractQuotes(str: string) {
	if(str[0] !== '"')
		return str
	return str.substr(1, str.length-2)
}