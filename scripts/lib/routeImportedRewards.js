import { parse } from "acorn";

// Source portals ship local SDK stand-ins which award purchases for free.
// Keep their game callbacks, but require the site's ad result for a reward.
export function routeImportedRewards(source) {
  let ast;
  try {
    ast = parse(source, { ecmaVersion: "latest", sourceType: "script" });
  } catch {
    return source;
  }
  const edits = [];
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === 'FunctionDeclaration' && node.id?.name === 'RewardedShow' && node.params[0]?.type === 'Identifier') {
      const body = source.slice(node.body.start, node.body.end);
      if (/myGameInstance\.SendMessage\(['"]YandexGame['"],\s*['"]RewardVideo['"]/.test(body)) {
        const id = node.params[0].name;
        edits.push([node.body.start, node.body.end, `{ if (!myGameInstance) return; return window.GMSImportedAds.yandex({ callbacks: { onOpen: () => myGameInstance.SendMessage('YandexGame', 'OpenVideo'), onRewarded: () => myGameInstance.SendMessage('YandexGame', 'RewardVideo', ${id}), onClose: () => myGameInstance.SendMessage('YandexGame', 'CloseVideo') } }); }`]);
        return;
      }
    }
    if (
      node.type === "Property" &&
      (node.key.name || node.key.value) === "showRewardedVideo"
    ) {
      const fn = node.value;
      if (
        ["FunctionExpression", "ArrowFunctionExpression"].includes(fn.type) &&
        fn.params[0]?.type === "Identifier"
      ) {
        edits.push([
          fn.body.start,
          fn.body.end,
          `{ return window.GMSImportedAds.yandex(${fn.params[0].name}); }`,
        ]);
        return;
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object") visit(value);
    }
  }
  visit(ast);
  for (const [start, end, text] of edits.sort((a, b) => b[0] - a[0]))
    source = source.slice(0, start) + text + source.slice(end);
  return source;
}
