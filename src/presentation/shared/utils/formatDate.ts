export const formatDate = (dateString: string | Date, lang: string) => {
  return new Date(dateString).toLocaleDateString(`${lang.toLowerCase()}-${lang.toUpperCase()}`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
