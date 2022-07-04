const jsdoc2md = require("jsdoc-to-markdown");
const fs = require("fs");
const path = require("path");

async function walk(dir) {
  let results = [];
  for (const file of await fs.readdirSync(dir)) {
    const filePath = path.resolve(__dirname, dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = [...results, ...(await walk(filePath))];
    } else {
      results = [...results, path.resolve(__dirname, dir, file)];
    }
  }
  return results;
}

async function getFiles() {
  const startPath = path.resolve(__dirname, "../../dist");
  const results = await walk(startPath);
  return results;
}

async function generateDocs() {
  const inputFile = await getFiles();
  const outputDir = path.resolve(__dirname, "../../docs");
  console.log(inputFile);

  /* get template data */
  const templateData = jsdoc2md.getTemplateDataSync({ files: inputFile });

  /* reduce templateData to an array of class names */
  const classNames = templateData.reduce((classNames, identifier) => {
    if (identifier.kind === "class") classNames.push(identifier.name);
    return classNames;
  }, []);

  let output = "";

  /* create a documentation file for each class */
  for (const className of classNames) {
    const template = `{{#class name="${className}"}}{{>docs}}{{/class}}`;
    console.log(`rendering ${className}, template: ${template}`);
    output +=
      "\n" +
      jsdoc2md.renderSync({
        data: templateData,
        template: template,
      });
  }

  fs.writeFileSync(path.resolve(outputDir, `api-ref.md`), output);
}

generateDocs();
