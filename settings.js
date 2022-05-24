import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import YAML from "yaml";

const settingsFile = resolve(".", "settings.yml");

const defaultSettings = {
  accounts: ["example_1", "example_2"],
  leagues: ["Standard", "SSF Hardcore"],
  realm: "pc",
  refreshMS: 30 * 60 * 1000,
};

export const readSettings = () => {
  try {
    const a = readFileSync(settingsFile).toString();

    return YAML.parse(a);
  } catch (e) {
    writeFileSync(settingsFile, YAML.stringify(defaultSettings));
  }

  return defaultSettings;
};
