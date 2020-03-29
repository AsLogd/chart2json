#! /usr/bin/env node
const fs = require("fs")
const path = require("path")
const glob = require("glob")
const Parser = require("../lib/index").default
const Log = require("../lib/Log").default


const outputIndex = process.argv.indexOf("-o")
let output = "./"
let fileNames
if (outputIndex > -1) {
	fileNames = process.argv.slice(2, outputIndex)
	output = process.argv.slice(outputIndex)[1] + "/"
} else {
	fileNames = process.argv.slice(2)
}

const files = fileNames
	.map(x => glob.sync(x))
	.reduce((pre, current) => pre.concat(current))

Log.info("Input files:")
files.map(x => console.log('-'+x))

Log.info("Parsing...")
Log.info("ble")
let parsed = 0
files.map(filePath => {
	Log.info("ble2"+filePath)
	const content = fs.readFileSync(filePath, 'utf8')
	Log.info("ble3"+content)
	const result = Parser.parse(content)
	Log.info("ble4")
	Log.dump(result)
	const baseName = path.basename(filePath, path.extname(filePath))
	switch(result.tag) {
		case "success":
			fs.writeFileSync(output + baseName + ".json", JSON.stringify(result.value))
			Log.ok(`	- ${filePath} - OK`)
			parsed += 1
			break
		case "failure":
			Log.error(`	- ${filePath} - KO`)
			Log.dump(result.reason.error)
			break
	}
})

const msg = `Parsed ${parsed}/${files.length} files`

if (files.length === parsed) {
	Log.ok(msg)
} else {
	Log.error(msg)
}