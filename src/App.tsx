import { get } from "./util/http";
import { useState, useEffect, type ReactNode } from "react";
import BlogPosts, { BlogPost } from "./components/BlogPosts.tsx";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage.tsx";

type RawDataBlogPost = {
  id: number;
  title: string;
  userId: number;
  body: string;
};

function App() {
  const [fetchPosts, setfetchPosts] = useState<BlogPost[] | undefined>();
  const [isFetching, setisFetching] = useState(false);
  const [error, setError] = useState<String>();

  useEffect(() => {
    async function fetchPosts() {
      setisFetching(true);
      try {
        const data = (await get(
          "https://jsonplaceholder.typicode.com/posts"
        )) as RawDataBlogPost[];
        const blogPosts: BlogPost[] = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            Text: rawPost.body,
          };
        });
        setfetchPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }

      setisFetching(false);
    }
    fetchPosts();
  }, []);
  let content: ReactNode;
  if (error) {
    content = <ErrorMessage text="error" />;
  }
  if (fetchPosts) {
    content = <BlogPosts posts={fetchPosts} />;
  }
  if (isFetching) {
    content = <p id="loading-fallback"> fetching posts.....s </p>;
  }

  return (
    <main>
      <img src={fetchingImg} alt="jd" />
      {content}
    </main>
  );
}

export default App;
