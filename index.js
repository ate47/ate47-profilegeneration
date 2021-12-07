const Mustache = require("mustache");
const { fetchstats, mods } = require("./statsfetcher");
const path = require("path");
const fs = require("fs");
const fsextra = require("fs-extra");

const fail = (e) => {
  console.error(e);
  process.exit(-1);
}

const templates = JSON.parse(fs.readFileSync("templates.json"));

/**
 * render a file into another
 * @param {fs.PathLike} fileIn the file to read
 * @param {fs.PathLike} fileOut the file to write
 * @param {any} view the view of the engine
 */
const renderTemplate = (fileIn, fileOut, view) => {
  console.log("Write " + fileIn + " into " + fileOut);
  const raw = fs.readFileSync(fileIn).toString();
  const output = Mustache.render(raw, view);
  fs.writeFileSync(fileOut, output);
};

/**
 * render all the files recursivly to another directory
 * @param {fs.PathLike} completePath the path to read
 * @param {fs.PathLike} outputPath the path to write
 * @param {any} view the view of the engine
 */
const renderTemplates = (inputPath, outputPath, view) => {
  console.log("Reading path " + inputPath);
  fs.mkdir(outputPath, { recursive: true }, (err) => {
    if (err) {
      return fail("Unable to mkdir future directory: " + err);
    }
    fs.readdir(inputPath, function (err, files) {
      if (err) {
        return fail("Unable to scan directory: " + err);
      }
      files.forEach((file) => {
        const finputPath = path.join(inputPath, file);
        const foutputPath = path.join(outputPath, file);
        fs.stat(finputPath, function (err, stat) {
          if (err) {
            return fail("Unable to scan directory: " + err);
          }
          if (stat.isDirectory()) {
            renderTemplates(finputPath, foutputPath, view);
          } else {
            renderTemplate(finputPath, foutputPath, view);
          }
        });
      });
    });
  });
};

(async () => {
  const stats = await fetchstats();

  const view = {
    download: {
      curseforge: stats.downloadCF,
      modrinth: stats.downloadMR,
      total: stats.downloads,
    },
    mods,
    global: templates.global,
  };
  fsextra.copy(
    "public",
    templates.output,
    {
      recursive: true,
    },
    (err) => {
      if (err) {
        return fail("Unable to clone directory: " + err);
      }
      renderTemplates(templates.templates, templates.output, view);
    }
  );
})()
  .then(console.log)
  .catch(fail);
