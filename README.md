# chart2json

Parse the custom guitar hero songs .chart format as .json.  

## Examples
Terminal:
```
chart2json -i *.chart -o output
```
Script:
```
import Parser from "chart2json"
const file = "... chart file contents ..."
const result = Parser.parse(file)
if(result.ok){
    console.log(result.value)
} else {
    console.log(result.reason)
}
```

### Installing

For terminal usage:
```
npm install -g chart2json
```

To use it in a project:
```
npm install chart2json
-or-
yarn add chart2json
```

## Running the tests

```
npm test
-or-
yarn test
```
The tests run in two stages:
 * First, the defined grammar and semantics are checked using the files found in the folders `tests/valid` (should be accepted by grammar an semantics) and `tests/invalid` (should error).
 * Then, the binary is tested by generating jsons from `tests/parse` and `tests/parseRaw` and checking against an expected output.

## Built With

* [Typescript](https://github.com/Microsoft/TypeScript)
* [Nearley](https://github.com/kach/nearley) - Parsing toolkit
* [Moo](https://github.com/no-context/moo) - Tokenizer/lexer

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

This project is licensed under the MIT License

## Acknowledgments

 * Thanks to [FireFox](https://github.com/FireFox2000000) for providing me with a draft of the `.chart` file specification
 * Thanks to the charters that made the charts that are used to test the tool (authors found in the `Charter` field of each chart)

