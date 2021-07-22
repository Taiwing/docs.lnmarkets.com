"use strict";

const fs = require("fs/promises");
const path = require("path");
const yaml = require("yaml");
const converter = require("widdershins");
const SwaggerParser = require("@apidevtools/swagger-parser");

const apiPath = path.join(__dirname, "./spec/index.yaml");
const slateFile = path.join(__dirname, "./_api.md");
const JSONFile = path.join(__dirname, "./dist/openapi.json");

const openApiToSlate = async () => {
  try {
    const options = {
      codeSamples: true,
      resolve: true,
      source: apiPath,
      omitHeader: true,
      httpsnippet: true,
      tocSummary: true,
      user_templates: "./template",
      language_tabs: [
        { python: "Python" },
        { "javascript--node": "Node.js" },
        { shell: "Shell" },
      ],
      language_clients: [
        { shell: "curl" },
        { "javascript--node": "request" },
        { python: "requests" },
      ],
    };

    const raw = await fs.readFile(apiPath, "utf-8");
    const parsed = yaml.parse(raw);
    const data = await converter.convert(parsed, options);
    await fs.writeFile(slateFile, data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const openApiToJSON = async () => {
  try {
    const parser = new SwaggerParser();
    const apiSpec = await parser.validate(apiPath);
    await fs.mkdir(path.join(__dirname, "dist")).catch((error) => {
      if (error.code !== "EEXIST") {
        return Promise.reject(error);
      }
      return Promise.resolve();
    });
    await fs.writeFile(JSONFile, JSON.stringify(apiSpec, null, 2));
    return apiSpec;
  } catch (error) {
    return Promise.reject(error);
  }
};

const main = async () => {
  try {
    await openApiToJSON();
    await openApiToSlate();
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
};

main();
