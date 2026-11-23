import test from "node:test";
import assert from "node:assert/strict";
import { creatures } from "../src/catalog.js";
import { filterCreatures, buildParty, calculatePower } from "../src/core.js";

test("catalogue has 30 unique specimens",()=>{assert.equal(creatures.length,30);assert.equal(new Set(creatures.map(x=>x.id)).size,30);});
test("search matches name and story",()=>{assert.equal(filterCreatures(creatures,"MOSS GUARDIAN")[0].id,"morrow");});
test("habitat and rarity filters combine",()=>{assert.deepEqual(filterCreatures(creatures,"","forest","common").map(x=>x.id),["morrow","mossbit","petal"]);});
test("favorites form a strict subset",()=>{assert.deepEqual(filterCreatures(creatures,"","all","all",new Set(["flare","volt"])).map(x=>x.id),["volt","flare"]);});
test("party builder selects unique members",()=>{const p=buildParty(creatures,4,()=>0);assert.equal(p.length,4);assert.equal(new Set(p.map(x=>x.id)).size,4);});
test("party size is bounded by available records",()=>{assert.equal(buildParty(creatures,100,()=>0).length,30);assert.equal(buildParty([],4).length,0);});
test("average power handles empty and populated parties",()=>{assert.equal(calculatePower([]),0);assert.equal(calculatePower([creatures[0],creatures[1]]),75);});
