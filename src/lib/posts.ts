import { getCollection } from 'astro:content'

export async function getSortedBlogPosts() {
  const posts = await getCollection('blog')

  return posts.sort(
    (a, b) => {
      const dateDifference = b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
      if (dateDifference !== 0) return dateDifference
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    },
  )
}
