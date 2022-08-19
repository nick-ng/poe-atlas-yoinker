import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import YAML from "yaml";
import dayjs from "dayjs";

import { readSettings } from "./settings.js";
import { fetchAllAtlastSkillTrees } from "./grinding-gear-games.js";
import { sendToNickNg, sendToWebsite } from "./send-atlas-tree.js";

const args = process.argv.slice(2);
const mode = args[0];

const atlasSkillTreeFile = resolve(".", "atlas-skill-trees.yml");
const dateFormat = "D MMM YYYY HH:mm";

const { refreshMS } = readSettings();

const main = async () => {
  console.time("main");
  const settings = readSettings();

  const allTrees = await fetchAllAtlastSkillTrees(
    settings.accounts,
    settings.leagues,
    settings.realm
  );

  let existingTrees = {};
  let oldTreesYAML = "";

  try {
    oldTreesYAML = readFileSync(atlasSkillTreeFile).toString();
    if (oldTreesYAML) {
      existingTrees = YAML.parse(oldTreesYAML);
    }
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.error(e);
    }
  }

  const now = Date.now();
  const formattedDate = dayjs().format(dateFormat);

  for (const data of allTrees) {
    const { account, trees } = data;
    if (!existingTrees[account]) {
      existingTrees[account] = {};
    }
    for (const tree of trees) {
      const { league, location } = tree;
      if (!existingTrees[account][league]) {
        existingTrees[account][league] = [];
      }
      const temp = [...existingTrees[account][league]];
      const treeUrl = `https://www.pathofexile.com${location}`;

      if (temp.length === 0 || temp.pop().tree !== treeUrl) {
        existingTrees[account][league].push({
          timestamp: now,
          date: formattedDate,
          tree: treeUrl,
        });
      }
    }
  }

  const newTreesYAML = YAML.stringify(existingTrees);

  if (oldTreesYAML !== newTreesYAML) {
    writeFileSync(atlasSkillTreeFile, newTreesYAML);
    // sendToNickNg(existingTrees);
    sendToWebsite(existingTrees);
  } else {
    console.info("No change in atlas skill trees.");
  }

  console.timeEnd("main");
};

switch (mode) {
  case "--continuous":
    const nextTimeout = async () => {
      await main();
      console.info(dayjs().format(dateFormat));
      setTimeout(() => {
        nextTimeout();
      }, refreshMS);
    };

    nextTimeout();
    break;
  default:
    main();
}
