const fs = require("fs");
const curseforge = require("./minecraft/curseforge");
const modrinth = require("./minecraft/modrinth");

const mods = JSON.parse(fs.readFileSync("minecraft/mods.json")).mods;
const templates = JSON.parse(fs.readFileSync("templates.json")).templates;

const prettyNumberBase = ["", "K", "M", "B"];

const prettyNumber = (n) => {
  let i = 0;
  while (n / 1000 >= 1 && i < prettyNumberBase.length - 1) {
    n /= 1000;
    i++;
  }
  return Math.floor(n) + prettyNumberBase[i];
};

const fail = (msg) => (e) => {
  console.error(msg);
  console.error(e);
};

(async () => {
  const curseIds = mods.filter((m) => m.curseforge).map((m) => m.curseforge.id);
  const modsCF = await curseforge
    .getMods(curseIds)
    .catch(fail("Can't fetch curseforge mods"));

  const modrinthIds = mods.filter((m) => m.modrinth).map((m) => m.modrinth.id);

  const modsMR = await modrinth
    .getMods(modrinthIds)
    .catch(fail("Can't fetch modrinth mods"));

  //   .then((m) => m.map((mod) => mod.downloadCount))
  //   .then((m) => m.map((mod) => mod.downloads))

  const downloadCountMR = modsMR
    .map((c) => c.downloads)
    .reduce((a, b) => a + b);
  const downloadCountCF = modsCF
    .map((c) => c.downloadCount)
    .reduce((a, b) => a + b);

  const totalDownloads = downloadCountCF + downloadCountMR;

  const templateData = {
    TEMPLATE_downloadCF: prettyNumber(downloadCountCF),
    TEMPLATE_downloadMR: prettyNumber(downloadCountMR),
    TEMPLATE_downloads: prettyNumber(totalDownloads),
  };
  const templateDataRegex = Object.keys(templateData).map((d) => ({
    regex: new RegExp(d),
    data: templateData[d],
  }));

  templates.forEach((template) => {
    console.log(
      "Writing template " +
        template.fileIn +
        " into " +
        template.fileOut +
        "..."
    );
    let text = fs.readFileSync(template.fileIn).toString();
    templateDataRegex.forEach((k) => {
      text = text.replace(k.regex, k.data);
    });
    fs.writeFileSync(template.fileOut, text);
  });
})()
  .then(console.log)
  .catch(console.error);
