const fs = require('fs')
const path = require('path')
const nearley = require("nearley")
const grammar = require("../lib/chart.js")
const Log = require("../lib/Log.js").default


const validFolder = path.join(__dirname, './valid/')
const invalidFolder = path.join(__dirname, './invalid/')

function dumpTest(path, data, results) {
	Log.info("Input dump ("+path+"):")
	Log.dump(data)
	Log.info("Results:")
	Log.dump(results)
}

Log.info("Testing valid inputs:")
fs.readdirSync(validFolder).forEach(file => {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	const testName = file.split(".").slice(0, -1).join(".")
	const path =validFolder+file
	const data = fs.readFileSync(path, 'utf8');
	try {
		parser.feed(data);
	} catch (err) {
		Log.error(err);
		dumpTest(path, data, parser.results)
	}

	if (parser.results.length === 1) {
		Log.ok(testName+" - OK")
	} else if(parser.results.length > 1){
		Log.warn(testName+" - Ambiguous!")
		dumpTest(path, data, parser.results)
	} else {
		Log.error(testName+" - KO")
		dumpTest(path, data, parser.results)
	}
});

Log.info("Testing invalid inputs:")
fs.readdirSync(invalidFolder).forEach(file => {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	const testName = file.split(".").slice(0, -1).join(".")
	const path =invalidFolder+file
	const data = fs.readFileSync(path, 'utf8');
	try {
		parser.feed(data);
	} catch (err) {
		Log.error(err);
		dumpTest(path, data, parser.results)
	}

	if (parser.results.length === 0) {
		Log.ok(testName+" - OK")
	} else {
		Log.error(testName+" - KO")
		dumpTest(path, data, parser.results)
	}
});