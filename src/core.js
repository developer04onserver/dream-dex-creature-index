export function filterCreatures(items, query="", habitat="all", rarity="all", favorites=null) {
  const term = query.trim().toLocaleLowerCase();
  return items.filter(item => {
    const text = (item.name+" "+item.habitat+" "+item.rarity+" "+item.story).toLocaleLowerCase();
    return (!term || text.includes(term))
      && (habitat === "all" || item.habitat === habitat)
      && (rarity === "all" || item.rarity === rarity)
      && (favorites === null || favorites.has(item.id));
  });
}

export function buildParty(items, size=4, random=Math.random) {
  const pool = [...items];
  const party = [];
  const take = Math.min(Math.max(0,size),pool.length);
  while (party.length < take) {
    const index = Math.min(pool.length-1,Math.floor(random()*pool.length));
    party.push(pool.splice(index,1)[0]);
  }
  return party;
}

export function calculatePower(party) {
  if (!party.length) return 0;
  return Math.round(party.reduce((sum,item)=>sum+item.power,0)/party.length);
}
