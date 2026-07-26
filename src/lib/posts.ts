import { getCollection } from 'astro:content'

export async function getSortedBlogPosts() {
  const posts = await getCollection('blog')
  const visiblePosts = import.meta.env.PROD
    ? posts.filter((post) => !post.data.draft)
    : posts

  return visiblePosts.sort(
    (a, b) => {
      const dateDifference = b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
      if (dateDifference !== 0) return dateDifference
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    },
  )
}
