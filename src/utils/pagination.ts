/**
 * Creates a pagination URL with search parameters
 */
export function createPaginationUrl(
  basePath: string,
  page: number,
  searchParams: Record<string, string | string[] | undefined> = {}
): string {
  const params = new URLSearchParams();
  
  // Add existing search params except page
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== 'page' && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
  });
  
  // Add page parameter (only if > 1 to keep URLs clean)
  if (page > 1) {
    params.set('page', page.toString());
  }
  
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Parses and validates page parameter from search params
 */
export function parsePageParam(pageParam?: string): number {
  if (!pageParam) return 1;
  
  const parsed = parseInt(pageParam, 10);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

/**
 * Calculates pagination bounds
 */
export function calculatePaginationBounds(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): {
  startItem: number;
  endItem: number;
  offset: number;
} {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const offset = (currentPage - 1) * itemsPerPage;
  
  return { startItem, endItem, offset };
}

/**
 * Validates if the current page is within bounds
 */
export function validatePageBounds(
  currentPage: number,
  totalPages: number
): boolean {
  return currentPage > 0 && (totalPages === 0 || currentPage <= totalPages);
} 