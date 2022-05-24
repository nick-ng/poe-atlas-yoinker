import fetch from "node-fetch";

export const sendToNickNg = async (newTrees) => {
  let markdownString = `${(new Date()).toString()}
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
