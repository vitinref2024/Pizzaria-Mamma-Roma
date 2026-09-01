import { ProductItem } from '../types';

/**
 * Normalizes text for search comparison:
 * - Lowercase
 * - Strips accents / diacritics
 * - Normalizes common pizza terms & alternate spellings
 * - Trims extra whitespace
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes word stems for common Portuguese culinary singular/plural and synonyms
 */
export function stemWord(word: string): string {
  const normalized = normalizeSearchText(word);
  if (!normalized) return '';

  // Synonyms and aliases
  if (['mucarela', 'mussarela', 'mozarela', 'mozzarella', 'muzarela'].includes(normalized)) {
    return 'mussarela';
  }
  if (['berinjela', 'beringela'].includes(normalized)) {
    return 'beringela';
  }
  if (['margherita', 'marguerita'].includes(normalized)) {
    return 'marguerita';
  }
  if (['catupiry', 'catupiri', 'katupiry'].includes(normalized)) {
    return 'catupiry';
  }
  if (['4', 'quatro'].includes(normalized)) {
    return 'quatro';
  }
  if (['2', 'dois', 'duas'].includes(normalized)) {
    return 'dois';
  }

  // Simple Portuguese plural stemming
  if (normalized.endsWith('oes')) {
    return normalized.slice(0, -3) + 'ao';
  }
  if (normalized.endsWith('res') || normalized.endsWith('zes') || normalized.endsWith('nes')) {
    return normalized.slice(0, -2);
  }
  if (normalized.endsWith('is')) {
    return normalized.slice(0, -2) + 'l';
  }
  if (normalized.endsWith('s') && normalized.length > 3 && !normalized.endsWith('ss')) {
    return normalized.slice(0, -1);
  }

  return normalized;
}

/**
 * Calculates Levenshtein distance for fuzzy typo tolerance
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if two words match directly, via stem or fuzzy distance
 */
export function isWordMatch(queryWord: string, targetWord: string): { match: boolean; fuzzy: boolean } {
  const normQuery = normalizeSearchText(queryWord);
  const normTarget = normalizeSearchText(targetWord);

  if (!normQuery || !normTarget) return { match: false, fuzzy: false };

  // Direct exact match
  if (normQuery === normTarget) return { match: true, fuzzy: false };

  // Stem match (e.g., "mussarelas" -> "mussarela", "calabresas" -> "calabresa")
  const stemQ = stemWord(normQuery);
  const stemT = stemWord(normTarget);
  if (stemQ === stemT || stemT.startsWith(stemQ) || stemQ.startsWith(stemT)) {
    return { match: true, fuzzy: false };
  }

  // Substring match
  if (normTarget.includes(normQuery) && normQuery.length >= 3) {
    return { match: true, fuzzy: false };
  }

  // Fuzzy match for small typos (distance <= 1 for words 4-6 chars, <= 2 for 7+ chars)
  if (normQuery.length >= 4) {
    const maxDist = normQuery.length >= 7 ? 2 : 1;
    const dist = levenshteinDistance(stemQ, stemT);
    if (dist <= maxDist) {
      return { match: true, fuzzy: true };
    }
  }

  return { match: false, fuzzy: false };
}

export interface SearchScoreResult {
  product: ProductItem;
  score: number;
  isNameMatch: boolean;
  matchedIngredient?: string;
  matchedReason?: string;
}

/**
 * Calculates a search score based on the strict hierarchy:
 * 100 points - exact match with product name
 * 90 points - name starts with query
 * 80 points - name contains exact query term
 * 70 points - name contains all query tokens
 * 50 points - name matches partial/stem/fuzzy query
 * 30 points - term appears in ingredients or tags
 * 20 points - term appears in description
 * 10 points - term appears in secondary fields (number, category)
 */
export function calculateProductSearchScore(product: ProductItem, rawQuery: string): SearchScoreResult {
  if (!product) {
    return {
      product: {} as ProductItem,
      score: 0,
      isNameMatch: false
    };
  }

  const trimmedQuery = (rawQuery || '').trim();
  if (!trimmedQuery) {
    return {
      product,
      score: 0,
      isNameMatch: false
    };
  }

  const normQuery = normalizeSearchText(trimmedQuery);
  const queryTokens = normQuery.split(' ').filter(Boolean);
  const stemQuery = queryTokens.map(stemWord).join(' ');

  const normName = normalizeSearchText(product.name || '');
  const nameTokens = normName.split(' ').filter(Boolean);
  const stemName = nameTokens.map(stemWord).join(' ');

  const normDesc = normalizeSearchText(product.description || '');
  const descTokens = normDesc.split(' ').filter(Boolean);

  const normNumber = normalizeSearchText(product.number || '');
  const tagsStr = normalizeSearchText(Array.isArray(product.tags) ? product.tags.join(' ') : '');

  let score = 0;
  let isNameMatch = false;
  let matchedIngredient: string | undefined;
  let matchedReason: string | undefined;

  // 1. Number match (e.g. searching "15" or "Nº 15" or "08")
  if (normNumber && (normNumber === normQuery || normQuery === `n ${normNumber}` || normQuery === `no ${normNumber}`)) {
    score = 95;
    isNameMatch = true;
    matchedReason = `Nº ${product.number}`;
  }

  // 2. Exact name match (100 points)
  if (normName === normQuery || stemName === stemQuery) {
    score = 100;
    isNameMatch = true;
    matchedReason = 'Correspondência exata no nome';
  }
  // 3. Name starts with query (90 points)
  else if (normName.startsWith(normQuery) || stemName.startsWith(stemQuery)) {
    score = Math.max(score, 90);
    isNameMatch = true;
    matchedReason = 'Nome começa com o termo';
  }
  // 4. Name contains the full query term (80 points)
  else if (normName.includes(normQuery) || stemName.includes(stemQuery)) {
    score = Math.max(score, 80);
    isNameMatch = true;
    matchedReason = 'Nome contém o termo pesquisado';
  }
  // 5. Name contains all query words (70 points)
  else {
    const allTokensMatchName = queryTokens.every(qToken =>
      nameTokens.some(nToken => isWordMatch(qToken, nToken).match)
    );
    if (allTokensMatchName && queryTokens.length > 0) {
      score = Math.max(score, 70);
      isNameMatch = true;
      matchedReason = 'Nome contém todas as palavras';
    }
  }

  // 6. Partial / Fuzzy name match (50 points)
  if (!isNameMatch) {
    const matchedTokensCount = queryTokens.filter(qToken =>
      nameTokens.some(nToken => isWordMatch(qToken, nToken).match)
    ).length;

    if (matchedTokensCount > 0) {
      score = Math.max(score, 50);
      isNameMatch = true;
      matchedReason = 'Sabor correspondente';
    }
  }

  // 7. Ingredient & Description matches (30 & 20 points)
  // Only evaluate ingredients/description if we haven't already hit a top score,
  // or to identify the specific ingredient for "Você também pode gostar"
  const ingredientsList = (product.description || '')
    .split(/[,.;]/)
    .map(i => i.trim())
    .filter(Boolean);

  for (const ingredient of ingredientsList) {
    const normIng = normalizeSearchText(ingredient);
    const ingTokens = normIng.split(' ').filter(Boolean);

    const hasIngMatch = queryTokens.some(qToken =>
      ingTokens.some(iToken => isWordMatch(qToken, iToken).match)
    );

    if (hasIngMatch) {
      if (!isNameMatch) {
        score = Math.max(score, 30);
      }
      if (!matchedIngredient) {
        matchedIngredient = ingredient;
      }
      break;
    }
  }

  // 8. Description general match (20 points)
  if (score < 30) {
    const hasDescMatch = queryTokens.some(qToken =>
      descTokens.some(dToken => isWordMatch(qToken, dToken).match)
    );
    if (hasDescMatch) {
      score = Math.max(score, 20);
      matchedReason = 'Presente na receita';
    }
  }

  // 9. Secondary tags / category match (10 points)
  if (score < 10) {
    const hasTagMatch = queryTokens.some(qToken => tagsStr.includes(normalizeSearchText(qToken)));
    if (hasTagMatch) {
      score = Math.max(score, 10);
    }
  }

  return {
    product,
    score,
    isNameMatch,
    matchedIngredient,
    matchedReason
  };
}

/**
 * Searches and ranks products according to the intelligent scoring system
 */
export function searchAndRankProducts(products: ProductItem[], rawQuery: string): {
  allResults: SearchScoreResult[];
  directMatches: SearchScoreResult[];
  relatedMatches: SearchScoreResult[];
} {
  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];
  const trimmed = (rawQuery || '').trim();
  if (!trimmed) {
    const defaultResults: SearchScoreResult[] = safeProducts.map(p => ({
      product: p,
      score: 0,
      isNameMatch: false
    }));
    return {
      allResults: defaultResults,
      directMatches: defaultResults,
      relatedMatches: []
    };
  }

  const scoredResults = safeProducts
    .map(product => calculateProductSearchScore(product, trimmed))
    .filter(res => res.score > 0)
    .sort((a, b) => {
      // Sort by score descending
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If equal, prefer featured or original menu order
      if (b.product.featured && !a.product.featured) return 1;
      if (!b.product.featured && a.product.featured) return -1;
      return (a.product.order || 999) - (b.product.order || 999);
    });

  // Group into direct name matches (Mais relevantes) and related ingredient matches (Você também pode gostar)
  const directMatches = scoredResults.filter(r => r.isNameMatch && r.score >= 50);
  const relatedMatches = scoredResults.filter(r => !r.isNameMatch || r.score < 50);

  return {
    allResults: scoredResults,
    directMatches,
    relatedMatches
  };
}
