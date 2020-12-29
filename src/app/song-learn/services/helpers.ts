interface LevenshteinCosts {
  replace?: number;
  replaceCase?: number;
  insert?: number;
  remove?: number;
}
/**
 * @param {string} s1 Исходная строка
 * @param {string} s2 Сравниваемая строка
 * @param {object} [costs] Веса операций { [replace], [replaceCase], [insert], [remove] }
 * @return {number} Расстояние Левенштейна
 */
 export function levenshtein(s1: string, s2: string, costs: LevenshteinCosts = {}): number {
  let i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
  l1 = s1.length;
  l2 = s2.length;

  let cr = costs.replace || 1;
  let cri = costs.replaceCase || costs.replace || 1;
  let ci = costs.insert || 1;
  let cd = costs.remove || 1;

  cutHalf = flip = Math.max(l1, l2);

  let minCost = Math.min(cd, ci, cr);
  let minD = Math.max(minCost, (l1 - l2) * cd);
  let minI = Math.max(minCost, (l2 - l1) * ci);
  let buf = new Array((cutHalf * 2) - 1);

  for (i = 0; i <= l2; ++i) {
    buf[i] = i * minD;
  }

  for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
    ch = s1[i];
    chl = ch.toLowerCase();

    buf[flip] = (i + 1) * minI;

    ii = flip;
    ii2 = cutHalf - flip;

    for (j = 0; j < l2; ++j, ++ii, ++ii2) {
      cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
      buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
    }
  }
  return buf[l2 + cutHalf - flip];
}
