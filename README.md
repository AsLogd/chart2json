# chart2json

Parse the custom guitar hero songs .chart format as .json.  
## Usage
```
usage: chart2json [-h] [-v] -i INPUT [-o OUTPUT] [-r] [-s] [-p PRETTIFY]

Example: chart2json -i 'folder/**/*.chart' -o result/

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -i INPUT, --input INPUT
                        Input files (glob format)
  -o OUTPUT, --output OUTPUT
                        Output folder. Defaults to current directory
  -r, --raw             Output with raw format. Basically an array of titles 
                        and contents
  -s, --skip            Used with --raw, skips the semantic check (skip 
                        checking types for known sections and keys)
  -p PRETTIFY, --prettify PRETTIFY
                        String used to prettify the JSON. If not set, no 
                        prettifycation is performed

```
## Installing

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

## Examples
Terminal:
```
chart2json -i '*.chart' -o output
```
Script:
```javascript
import Parser from "chart2json"
const file = "... chart file contents ..."
const result = Parser.parse(file)
if(result.ok){
    console.log(result.value)
} else {
    console.log(result.reason)
}
```
### Output example
Input .chart:
```
[Song]
{
  Resolution = 192
}
[SyncTrack]
{
  0 = TS 4
  0 = B 120000
  3072 = B 83000
  9984=TS 2
  9984 = B 186000
  10368 = TS 4
}
[Events]
{
  768 = E "section Intro"
  1152 = E "phrase_start"
  1200 = E "lyric lyric"
  1320 = E "phrase_end"
}
[ExpertSingle]
{
  3744 = N 2 0
  3744 = N 6 0
  3792 = N 1 0
  3792 = N 2 0
  3792 = N 6 0
  3840 = N 7 0
  3840 = N 5 0
  3936 = N 7 0
  4032 = N 7 0
}
```
Output .json:
```json
{
    "song":
    {
        "resolution": 192,
        "audioStreams": {}
    },
    "syncTrack":
    {
        "0": [{"kind":1,"signature":{"numerator":4,"denominator":4}},{"kind":0,"bpm":120}],
        "3072": [{"kind":0,"bpm":83}],
        "9984": [{"kind":1,"signature":{"numerator":2,"denominator":4}},{"kind":0,"bpm":186}],
        "10368": [{"kind":1,"signature":{"numerator":4,"denominator":4}}]
    },
    "difficulties":
    {
        "Expert":
        {
            "Single":
            {
                "3744":
                [
                    {
                        "lanes":
                        [
                            {"lane":3,"sustain":0}
                        ],
                        "forced": false,
                        "tap": true
                    }
                ],
                "3792":
                [
                    {
                        "lanes":
                        [
                            {"lane":2,"sustain":0},
                            {"lane":3,"sustain":0}
                        ],
                        "forced": false,
                        "tap": true
                    }
                ],
                "3840":
                [
                    {
                        "lanes":
                        [
                            {"lane":0,"sustain":0}
                        ],
                        "forced": true,
                        "tap": false
                    }
                ],
                "3936":
                [
                    {
                        "lanes":
                        [
                            {"lane":0,"sustain":0}
                        ],
                        "forced": false,
                        "tap": false
                    }
                ],
                "4032":
                [
                    {
                        "lanes":
                        [
                            {"lane":0,"sustain":0}
                        ],
                        "forced": false,
                        "tap": false
                    }
                ]
            }
        },
    "events":
    {
        "768": [{"kind":0,"name":"Intro"}],
        "1152": [{"kind":1}],
        "1200": [{"kind":2,"lyric":"lyric"}],
        "1320": [{"kind":3}]
    }
}
```
`kind` and `lane` are enums and do not correspond to the same values in the .chart. These enums are labeled according to the instrument they are in, so, for example, in a normal guitar you have `LANE_1` or `OPEN` and in a Guitar Hero Live guitar you have `WHITE_1` or `BLACK_1`. In the future, there may be a flag to write these enum values as strings.

## Errors
The parser checks the semantic of the known values. For example, a note event in a track should contain two numbers for the chart to be valid. If supplied a chart with missing required properties or with wrong types, the parser will generate an error:
```
... parsing chart with sustain missing in a note event (0 = N 1) ...
Unexpected type found at line { 16 } (section: EasySingle key: 0)
- Expected:
        Tuple<[Number, Number]>
- Found:
        Number 
```
To avoid the semantic check, use the `--raw` and `--skip` options, which generates a much more basic json by only parsing the basic `.chart` syntax.

## Running the tests

```
npm test
-or-
yarn test
```
The tests run in two stages:
 * First, the defined grammar and semantics are checked using the files found in the folders `tests/valid` (should be accepted by grammar an semantics) and `tests/invalid` (should error).
 * Then, the binary is tested by generating jsons using both modes (normal and raw) and checking the results against an expected output.

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

