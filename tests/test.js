const fs = require('fs')
const path = require('path')
const nearley = require("nearley")
const grammar = require("../lib/grammar.js")
const Log = require("../lib/Log.js").default
const semanticCheck = require("../lib/Semantic.js").default

const validFolder = path.join(__dirname, './valid/')
const invalidFolder = path.join(__dirname, './invalid/')

function dumpTest(path, results) {
	Log.info("Results for ("+path+"):")
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
		Log.error(" - "+testName+"- KO")
		Log.info("The parser gave the following error:")
		Log.error(err);
		return
	}
	if (parser.results.length > 1) {
		Log.warn(" - "+testName+" - Ambiguous!")
		dumpTest(path, parser.results)
		return
	}
	if (parser.results.length === 0) {
		Log.error(" - "+testName+" - KO (No matching)")
		dumpTest(path, parser.results)
		return
	}

	const semanticError = semanticCheck(parser.results[0])
	if (semanticError) {
		Log.error(" - "+testName+" - KO (semantic)")
		Log.error("Error:")
		Log.error(semanticError.reason)
		Log.info("--------------------------")
		return
	}

	Log.ok(" - "+testName+" - OK")
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
		Log.ok(" - "+testName+" - OK")
		return
	}

	if (parser.results && parser.results.length === 0) {
		Log.ok(" - "+testName+" - OK")
		return
	}

	const semanticError = semanticCheck(parser.results[0])
	if (semanticError) {
		Log.ok(" - "+testName+" - OK")
		return
	}

	Log.error(" - "+testName+" - KO")
	dumpTest(path, parser.results)
});