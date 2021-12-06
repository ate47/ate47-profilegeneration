const fs = require("fs");
const curseforge = require("./minecraft/curseforge");
const modrinth = require("./minecraft/modrinth");

const mods = JSON.parse(fs.readFileSync("minecraft/mods.json")).mods;

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

exports.fetchstats = async () => {
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

  return {
    downloadCF: prettyNumber(downloadCountCF),
    downloadMR: prettyNumber(downloadCountMR),
    downloads: prettyNumber(totalDownloads),
  };
};
