import fetch from "node-fetch";

const baseUrl = "api.pathofexile.com";
const emptyTree = "c";

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
  console.log(account, league, realm);
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

    console.log("res", res);

    return res.headers.get("location");
  } catch (e) {
    console.error(e);
  }
};

const fetchCharacters = async (account, realm) => {
  try {
    const res = await fetch(
      "https://www.pathofexile.com/character-window/get-characters",
      {
        credentials: "include",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "en-GB,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
        referrer: `https://www.pathofexile.com/account/view-profile/${account}/characters`,
        body: `accountName=${account}&realm=${realm}`,
        method: "POST",
        mode: "cors",
      }
    );

    const body = await res.json();

    return body;
  } catch (e) {
    console.error("error when fetching characters", e);
  }

  return [];
};

export const fetchAllAtlastSkillTrees = async (accounts, _leagues, realm) => {
  const data = [];
  for (const account of accounts) {
    const trees = [];

    console.log("(account, realm)", account, realm);
    const characters = await fetchCharacters(account, realm);
    const temp = characters
      .map((c) => c.league || "Standard")
      .filter(
        (l) =>
          !["Standard", "SSF Standard", "Hardcore", "SSF Hardcore"].includes(l)
      );
    const leagues = [...new Set(temp)];
    console.log(leagues);
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
