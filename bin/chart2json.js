#! /usr/bin/env node
const fs = require("fs")
const path = require("path")
const glob = require("glob")
const Parser = require("../lib/index").default
const Log = require("../lib/Log").default
var ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
  version: '0.0.1',
  prog: "chart2json",
  addHelp:true,
  description: "Example:\nchart2json -i 'folder/**/*.chart' -o result/"
});
parser.addArgument(
  [ '-i', '--input' ],
  {
    help: 'Input files (glob format)',
    required: true
  },
);
parser.addArgument(
  [ '-o', '--output' ],
  {
    help: 'Output folder. Defaults to current directory',
    defaultValue: "."
  },
);
parser.addArgument(
  [ '-r', '--raw' ],
  {
    help: 'Output with raw format. Basically an array of titles and contents',
    defaultValue: false,
    action: "storeTrue"
  }
);
parser.addArgument(
  [ '-s', '--skip' ],
  {
    help: 'Used with --raw, skips the semantic check (skip checking types for known sections and keys)',
    defaultValue: false,
    action: "storeTrue"
  }
);
parser.addArgument(
  [ '-p', '--prettify' ],
  {
    help: 'String used to prettify the JSON. If not set, no prettifycation is performed'
  }
);
var args = parser.parseArgs();

if (!args.raw && args.skip) {
	console.error("Skip may only be used with --raw")
	return
}

const files = glob.sync(args.input)

Log.info("Input files:")
files.map(x => console.log('-'+x))

Log.info("Parsing...")
let parsed = 0
files.forEach(filePath => {
	const content = fs.readFileSync(filePath, 'utf8')
	const parser = args.raw ? Parser.parseRaw : Parser.parse
	const check = !args.skip
	const result = parser(content, check)
	const baseName = path.basename(filePath, path.extname(filePath))
	switch(result.ok) {
		case true:
			fs.mkdirSync(args.output, {recursive: true})
			const outputPath = path.join(args.output, `${baseName}.json`)
			const output = args.prettify
				? JSON.stringify(result.value, null, args.prettify)
				: JSON.stringify(result.value)
			fs.writeFileSync(outputPath, output)
			Log.ok(`	- ${filePath} - OK`)
			parsed += 1
			break
		case false:
			Log.error(`	- ${filePath} - KO`)
			Log.error(result.reason.error.reason)
			break
	}
})

const msg = `Parsed ${parsed}/${files.length} files`

if (files.length === parsed) {
	Log.ok(msg)
} else {
	Log.error(msg)
}