import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export const sendToWebsite = async (newTrees) => {
  let htmlString = `<div>${new Date().toString()}</div>
`;
  const accounts = Object.keys(newTrees);
  accounts.forEach((account) => {
    const leagues = newTrees[account];
    const leagueNames = Object.keys(leagues);
    htmlString += `<details><summary>${account} (${leagueNames.length} leagues)</summary>`;

    leagueNames.forEach((leagueName) => {
      const leagueTrees = leagues[leagueName];
      htmlString += `<details><summary>${leagueName} (${leagueTrees.length} trees)</summary><ul>`;

      leagueTrees.forEach((tree) => {
        htmlString += `<li><a href="${tree.tree}" target="_blank">${tree.date}</a></li>`;
      });

      htmlString += "</ul></details>";
    });

    htmlString += "</details>";

    const templateString = fs
      .readFileSync(path.resolve(".", "templates", "index.html"))
      .toString();

    const newHtml = templateString.replace(
      "<!-- Content goes here -->",
      htmlString
    );

    fs.writeFileSync(path.resolve(".", "static", "index.html"), newHtml);
  });
};

export const sendToNickNg = async (newTrees) => {
  let markdownString = `${new Date().toString()}
`;
  const accounts = Object.keys(newTrees);
  accounts.forEach((account) => {
    markdownString += `- ${account}
`;
    const leagues = newTrees[account];
    const leagueNames = Object.keys(leagues);

    leagueNames.forEach((leagueName) => {
      markdownString += `  - ${leagueName}
`;
      const leagueTrees = leagues[leagueName];
      leagueTrees.forEach((tree) => {
        markdownString += `    - [${tree.date}](${tree.tree})
`;
      });
    });
  });

  await fetch("https://nick.ng/api/markdown-document/id/65", {
    credentials: "omit",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "x-admin-key": "3JFxpSELdHiSMVfgDVL08yW7v3XVOPwHdhaV",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      title: "poe - Yoinked Atlas Skill Trees",
      content: markdownString,
      status: "unlisted",
      publishAt: "2022-04-28",
      uri: "poe-yoinked-atlas-skill-trees",
    }),
    method: "PUT",
    mode: "cors",
  });
};

export const sendToNickNg2 = async (text) => {
  await fetch("https://nick.ng/api/markdown-document/id/66", {
    credentials: "omit",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "x-admin-key": "3JFxpSELdHiSMVfgDVL08yW7v3XVOPwHdhaV",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      title: "poe - Debugger",
      content: text,
      status: "note",
      publishAt: "2022-04-28",
      uri: "aaee5d5a-6541-492d-82fe-a53c56a09f14",
    }),
    method: "PUT",
    mode: "cors",
  });
};
