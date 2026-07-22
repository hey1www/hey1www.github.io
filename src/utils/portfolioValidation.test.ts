import assert from "node:assert/strict";
import test from "node:test";
import { defaultPortfolio } from "../data/defaultPortfolio";
import { validatePortfolio } from "./portfolioValidation";

function clonePortfolio() {
  return structuredClone(defaultPortfolio);
}

test("accepts the featured FYP data and its three-locale metrics", () => {
  const result = validatePortfolio(defaultPortfolio);
  assert.equal(result.ok, true);

  const fyp = defaultPortfolio.cards.find((card) => card.id === "project-uav-fyp");
  assert.ok(fyp?.featuredProject);
  assert.equal(fyp.title.en, "Communication Aware UAV Path Planning");
  assert.equal(fyp.featuredProject.cardMetrics.length, 3);
  assert.equal(fyp.featuredProject.detailMetrics.length, 4);
  assert.ok(fyp.skills.length > fyp.featuredProject.featuredSkillIds.length);
  assert.deepEqual(
    fyp.skills.filter((id) => !fyp.featuredProject?.featuredSkillIds.includes(id)),
    ["python", "numpy", "networkx", "matplotlib", "jupyter", "imitation", "rl"]
  );
  assert.deepEqual(fyp.details.links, [
    {
      label: { en: "GitHub Repository", zhHans: "Github仓库", zhHant: "Github倉庫" },
      url: "http://portal.heyi-direct.site/",
    },
  ]);

  const sushiro = defaultPortfolio.cards.find((card) => card.id === "project-sushiro");
  assert.deepEqual(sushiro?.details.links?.map((link) => link.url), [
    "https://hey1www.github.io/SushiroQueuePrediction/#/",
    "https://github.com/hey1www/SushiroQueuePrediction",
  ]);
  assert.equal(sushiro?.details.sections?.find((section) => section.id === "stack")?.links, undefined);
});

test("rejects a featured metric with incomplete locale text", () => {
  const portfolio = clonePortfolio();
  const fyp = portfolio.cards.find((card) => card.id === "project-uav-fyp");
  assert.ok(fyp?.featuredProject);
  fyp.featuredProject.cardMetrics[0].label.zhHant = "";

  const result = validatePortfolio(portfolio);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /invalid project metric/);
});

test("rejects unknown featured skill ids", () => {
  const portfolio = clonePortfolio();
  const fyp = portfolio.cards.find((card) => card.id === "project-uav-fyp");
  assert.ok(fyp?.featuredProject);
  fyp.featuredProject.featuredSkillIds[0] = "missing-skill";

  const result = validatePortfolio(portfolio);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /references unknown skill/);
});
