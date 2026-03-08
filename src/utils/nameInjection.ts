export function injectName(
  text: string,
  defaultName: string,
  heroName: string
): string {
  if (!heroName || heroName.trim() === '') return text;

  const trimmedHero = heroName.trim();
  const regex = new RegExp(defaultName, 'gi');

  return text.replace(regex, (match) => {
    if (match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase()) {
      return trimmedHero.charAt(0).toUpperCase() + trimmedHero.slice(1);
    }
    return trimmedHero.toLowerCase();
  });
}
