export const getPageFromSearch = (search: string) => {
  const parsed = new URLSearchParams(search);
  const page = parsed.get('page');
  if (typeof page === 'undefined') return;
  return Number(page);
};