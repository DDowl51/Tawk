// O(1)
export default function capitalize(word: string) {
  const first = word[0].toUpperCase();
  const last = word.slice(1);
  return first + last;
}
