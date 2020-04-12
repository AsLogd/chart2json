const fs = require('fs')
const path = require('path')
const glob = require("glob")
const nearley = require("nearley")
const grammar = require("../lib/grammar.js")
const Log = require("../lib/Log.js").default
const semanticCheck = require("../lib/Semantic.js").default
const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;

const validFolder = path.join(__dirname, './valid/')
const invalidFolder = path.join(__dirname, './invalid/')
const rawInputFolder = path.join(__dirname, './parseRaw/')
const rawOutputFolder = path.join(__dirname, './output/parseRaw/')
const inputFolder = path.join(__dirname, './parse/')
const outputFolder = path.join(__dirname, './output/parse/')
function dumpTest(path, results) {
	Log.info("Results for ("+path+"):")
	Log.dump(results)
}

Log.info("========================")
Log.info("--grammar and semantic--")

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

Log.info("==============")
Log.info("--executable--")
{
	if (fs.existsSync(rawOutputFolder)) {
		Log.info(`Removing existing output folder "${rawOutputFolder}"...`)
		execSync(`rm -rf ${rawOutputFolder}`)
	}
	Log.info("Testing raw export:")
	const command = `chart2json.js -r -i ${rawInputFolder}*.in -o ${rawOutputFolder} -p '    '`
	Log.info(`Executing "${command}"...`, )
	Log.info( execSync(`./bin/${command}`).toString() )
	Log.info("Results:")
	const rawOutFiles = glob.sync(`${rawInputFolder}*.out`)
	for (const file of rawOutFiles) {
		const fileNamePath = file.split(".").slice(0, -1).join(".")
		const fileName = fileNamePath.split("/").pop()
		const expectedOutput = fs.readFileSync(`${fileNamePath}.out`, 'utf8');
		const actualOutput = fs.readFileSync(`${rawOutputFolder}${fileName}.json`, 'utf8');
		if (expectedOutput !== actualOutput) {
			Log.error(`\t- ${fileName} - KO:`)
			spawn("diff", [
				`${fileNamePath}.out`,
				`${rawOutputFolder}${fileName}.json`
			], { stdio: 'inherit' })
			break
		} else {
			Log.ok(`\t- ${fileName} - OK`)
		}
	}
}
{
	if (fs.existsSync(outputFolder)) {
		Log.info(`Removing existing output folder "${outputFolder}"...`)
		execSync(`rm -rf ${outputFolder}`)
	}
	Log.info("Testing export:")
	const command = `chart2json.js -i ${inputFolder}*.in -o ${outputFolder} -p '    '`
	Log.info(`Executing "${command}"...`, )
	Log.info( execSync(`./bin/${command}`).toString() )
	Log.info("Results:")
	const outFiles = glob.sync(`${inputFolder}*.out`)
	for (const file of outFiles) {
		const fileNamePath = file.split(".").slice(0, -1).join(".")
		const fileName = fileNamePath.split("/").pop()
		const expectedOutput = fs.readFileSync(`${fileNamePath}.out`, 'utf8');
		const actualOutput = fs.readFileSync(`${outputFolder}${fileName}.json`, 'utf8');
		if (expectedOutput !== actualOutput) {
			Log.error(`\t- ${fileName} - KO:`)
			spawn("diff", [
				`${fileNamePath}.out`,
				`${outputFolder}${fileName}.json`
			], { stdio: 'inherit' })
			break
		} else {
			Log.ok(`\t- ${fileName} - OK`)
		}
	}

}