import assert from "node:assert/strict";
import test from "node:test";
import { detectLocale, localeFromLanguageTag, PAGE_TITLES } from "./locale";

test("provides the requested page title for every supported locale", () => {
  assert.deepEqual(PAGE_TITLES, {
    en: "Interactive Resume - Zouheyi WANG",
    zhHans: "互动式主页 - 王邹鹤仪",
    zhHant: "互動式主頁 - 王鄒鶴儀",
  });
});

test("maps English browser language tags to English", () => {
  assert.equal(localeFromLanguageTag("en-US"), "en");
  assert.equal(localeFromLanguageTag("en-GB"), "en");
});

test("maps Simplified Chinese scripts and regions", () => {
  assert.equal(localeFromLanguageTag("zh-Hans"), "zhHans");
  assert.equal(localeFromLanguageTag("zh-CN"), "zhHans");
  assert.equal(localeFromLanguageTag("zh_SG"), "zhHans");
  assert.equal(localeFromLanguageTag("zh"), "zhHans");
});

test("maps Traditional Chinese scripts and regions", () => {
  assert.equal(localeFromLanguageTag("zh-Hant"), "zhHant");
  assert.equal(localeFromLanguageTag("zh-Hant-HK"), "zhHant");
  assert.equal(localeFromLanguageTag("zh-TW"), "zhHant");
  assert.equal(localeFromLanguageTag("zh_HK"), "zhHant");
  assert.equal(localeFromLanguageTag("zh-MO"), "zhHant");
});

test("honours the visitor's ordered language preferences", () => {
  assert.equal(detectLocale(["zh-CN", "zh-TW"]), "zhHans");
  assert.equal(detectLocale(["en-US", "zh-HK"]), "en");
  assert.equal(detectLocale(["fr-FR", "zh-HK"]), "zhHant");
});

test("falls back to English when no preference is supported", () => {
  assert.equal(localeFromLanguageTag("fr-FR"), null);
  assert.equal(detectLocale(["fr-FR", "de-DE"]), "en");
  assert.equal(detectLocale([]), "en");
});
