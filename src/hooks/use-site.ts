import { useQuery } from '@tanstack/react-query'
import { contentQuery, buildTexts, buildContact } from '@/lib/content'

export function useSiteContent() {
  const { data } = useQuery(contentQuery)
  const texts = buildTexts(data)
  return { texts, contact: buildContact(texts) }
}
