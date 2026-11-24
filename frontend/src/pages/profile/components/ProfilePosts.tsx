import { useEffect, useState } from "react"
import { getPosts, type Post } from "../../../services/posts"
import PostCard from "../../../components/posts/PostCard"

type ProfilePostsProps = {
    userId: string
}

export default function ProfilePosts({ userId }: ProfilePostsProps) {

    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {

        async function loadPosts() {
            try {
                const response = await getPosts({
                    userId,
                    limit: 12,
                    offset: 0
                })

                setPosts(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        void loadPosts()

    }, [userId])

    return (
        <section>
            <div className="grid grid-cols-3 gap-2">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        variant="profile"
                    />
                ))}
            </div>
        </section>
    )
}