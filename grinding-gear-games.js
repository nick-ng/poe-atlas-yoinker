import fetch from "node-fetch";

const baseUrl = "api.pathofexile.com";
const emptyTree = "/fullscreen-atlas-skill-tree/AAAABgAAAAAA";

export const fetchLeagues = async (userAgent) => {
  console.log("userAgent", userAgent);

  const res = await fetch("https://api.pathofexile.com/league", {
    credentials: "include",
    headers: {
      "User-Agent": userAgent,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-GB,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    method: "GET",
    mode: "cors",
  });

  const data = await res.text();
  return data;
};

export const fetchAtlasSkillTree = async (account, league, realm) => {
  const urlSearch = new URLSearchParams();
  urlSearch.set("accountName", account);
  urlSearch.set("league", league);
  urlSearch.set("realm", realm);
  try {
    const res = await fetch(
      `https://www.pathofexile.com/character-window/view-atlas-skill-tree?${urlSearch.toString()}`,
      {
        redirect: "manual",
      }
    );

    return res.headers.get("location");
  } catch (e) {
    console.error(e);
  }
};

export const fetchAllAtlastSkillTrees = async (accounts, leagues, realm) => {
  const data = [];
  for (const account of accounts) {
    const trees = [];
    for (const league of leagues) {
      try {
        const location = await fetchAtlasSkillTree(account, league, realm);
        if (location && location !== emptyTree) {
          console.info("Fetched", account, league);
          trees.push({
            league,
            location,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    data.push({
      account,
      realm,
      trees,
    });
  }
  return data;
};
