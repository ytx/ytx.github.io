import { expect, test } from "vitest";
import { t, formatDate, otherLang, LANGS, DEFAULT_LANG, SHOW_UNTRANSLATED } from "../../src/i18n";
import { ja } from "../../src/i18n/ja";
import { en } from "../../src/i18n/en";

test("t returns per language", () => {
  expect(t("ja", "action.try")).toBe("使ってみる");
  expect(t("en", "action.try")).toBe("Try it");
});
test("every key exists in both", () => expect(Object.keys(en).sort()).toEqual(Object.keys(ja).sort()));
test("formatDate", () => {
  const d = new Date("2026-10-22");
  expect(formatDate(d, "ja")).toBe("2026.10.22");
  expect(formatDate(d, "en")).toBe("Oct 22, 2026");
});
test("formatDate zero-pads in ja", () => {
  expect(formatDate(new Date("2026-03-05"), "ja")).toBe("2026.03.05");
  expect(formatDate(new Date("2026-03-05"), "en")).toBe("Mar 5, 2026");
});
test("otherLang and constants", () => {
  expect(otherLang("ja")).toBe("en");
  expect(otherLang("en")).toBe("ja");
  expect(LANGS).toEqual(["ja", "en"]);
  expect(DEFAULT_LANG).toBe("ja");
  expect(SHOW_UNTRANSLATED).toBe(true);
});
test("lang.switch labels the other language", () => {
  expect(t("ja", "lang.switch")).toBe("EN");
  expect(t("en", "lang.switch")).toBe("日本語");
});
