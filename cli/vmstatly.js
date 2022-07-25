/*
 * @Author: Henrique Deodato
 * @Date: 2022-07-25 12:43:16
 * @Last Modified by: Francisco Deodato
 * @Last Modified time: 2022-07-25 14:05:27
 *
 * Creates a CLI to generate a report from vmstat
 */

const path = require("path");
const fs = require("fs-extra");
const vmstatly = require("../js/vmstatly.js");
const vmstatlyCharts = require("../js/vmstatly.charts.js");

const cliArgs = process.argv.slice(2);

const inputFile = cliArgs[0];
const outputDestination = cliArgs[1];

// validate if the input file exists
if (!fs.existsSync(inputFile)) {
  console.log("Input file does not exist");
  return;
}

// the output path is valid ?
if (!fs.existsSync(outputDestination)) {
  // create the folder...
  console.log("-- Destination folder does not exist, creating...");
  try {
    fs.mkdirSync(outputDestination);
    // internal folders...
    fs.mkdirSync(path.resolve(outputDestination, "json"));
    fs.mkdirSync(path.resolve(outputDestination, "lib"));
    fs.mkdirSync(path.resolve(outputDestination, "js"));
    fs.mkdirSync(path.resolve(outputDestination, "css"));
    fs.mkdirSync(path.resolve(outputDestination, "img"));
  } catch (err) {
    console.log(
      "---- Error - We are not able to create the folder, please check the permisions or create the folder before running the script"
    );
    return;
  }
}

// copy the final needed files
fs.copy(path.resolve("../lib"), path.resolve(outputDestination, "lib"));

fs.copy(
  path.resolve("../index-cli.html"),
  path.resolve(outputDestination, "index.html")
);

fs.copy(
  path.resolve("../js/vmstatly.charts.js"),
  path.resolve(outputDestination, "js", "vmstatly.charts.js")
);

fs.copy(
  path.resolve("../css/vmstatly.css"),
  path.resolve(outputDestination, "css", "vmstatly.css")
);

fs.copy(
  path.resolve("../img/github.png"),
  path.resolve(outputDestination, "img", "github.png")
);

//console.log(vmstatly);
// everything is ok, so lets parse the info
const fileContent = fs.readFileSync(inputFile, "utf8");
const parsedContent = `const timeseries = ${JSON.stringify(
  vmstatly.parse(fileContent)
)};`;

fs.writeFileSync(
  path.resolve(outputDestination, "json", "timeseries.js"),
  parsedContent
);
