const path = require("path");
const merger = require("json-merger");
const fs = require("fs");
const glob = require("glob");

const PATTERN = path.join(__dirname, 'resources/messages/*.json');
const OUTPUT = path.join(__dirname, 'resources/lang/en.json');

const result = merger.mergeFiles(glob.sync(PATTERN));

fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), "utf-8");