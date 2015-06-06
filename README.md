# sahana-config-parser
Parses the Sahana Eden config.py file into a CSV, which can then be imported into a human-readable spreadsheet.

Output can be viewed here: https://docs.google.com/spreadsheets/d/1uRI--NMhUAe9SzdbAZW3RZsTdqD1cP6lUrsW26NhndA/edit

### Setup

1. Install [Node.js](https://nodejs.org/)
2. `git clone git@github.com:etli/sahana-config-parser.git`
3. `cd sahana-config-parser`
4. `node parse`

### TODO

- Support multi-line descriptions
- Call the latest config.py rather than manually updating it
- Parse modules
- Output to a format that can be used for UI development
