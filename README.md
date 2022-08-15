# Profile generation reposition

Part of the repo where I do weird stuff to produce [my beautiful Github page](https://github.com/ate47/).

## How to setup

First of all, why? This is a internal repository for my Github account.

### Config

The [mods.json](minecraft/mods.json) file to select which mods to get for the stats. The Json spec are:

```json
[
  {
    "curseforge": {
      "id": 1234,
      "url": "url"
    },
    "modrinth": {
      "id": "string",
      "url": "url"
    },
    "github": {
      "url": "url"
    },
    "title": "string",
    "img": "url"
  }
]
```

You can get then configs the markdown templates in the `templates/` directory, for static files, you have the `public/` directory.

### Run for command line usage

Otherwise, you need to set 2 env variables:

- `APIKEY_CURSEFORGE` - The CurseForge's apikey to get the mods information, [you can get one here](https://docs.curseforge.com/#getting-started).
- `APIKEY_MODRINTH` - The Modrinth's apikey to get the mods information (not used anymore), [you can get one here](https://modrinth.com/settings/security).

Then run this command

```powershell
npm i
node index.js
```

### Run for Github actions

- `APIKEY_CURSEFORGE` - The CurseForge's apikey to get the mods information, [you can get one here](https://docs.curseforge.com/#getting-started).
- `APIKEY_MODRINTH` - The Modrinth's apikey to get the mods information (not used anymore), [you can get one here](https://modrinth.com/settings/security).
- `GH_PAT` - The Github token to publish the page, [you can get one here](https://github.com/settings/tokens), select only the repo permission. if you want to publish directly to another branch, replace in the [node.js.yml](.github/workflows/node.js.yml) file every `GH_PAT` to `GITHUB_TOKEN`, no env variable

Then run the action
