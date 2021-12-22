import type { NextPage } from "next";
import useSWR from "swr";

import axios from "axios";
import { useState, useEffect } from "react";

import "prismjs/themes/prism.css";
import "github-markdown-css/github-markdown-light.css";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const storyPass = async (id: string) =>
  await axios.put(`/api/story`, {
    id,
    publishStatus: "published",
  });

function useNextStory(id: string | undefined) {
  const { data, error } = useSWR(`/api/story?id=${id}`, fetcher);

  return {
    story: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const Home: NextPage = () => {
  const [currId, setCurrId] = useState("");
  const { story, isLoading, isError } = useNextStory(currId);

  useEffect(() => {
    const imgs: HTMLCollectionOf<HTMLImageElement> =
      document.getElementsByTagName("img");
    for (let index = 0; index < imgs.length; index++) {
      const imgItem = imgs.item(index);
      if (imgItem)
        imgItem.src = imgItem.src.replace("admin", story.author.author);
    }
  });

  return (
    <div>
      <div>
        <button
          onClick={async () => {
            await storyPass(story._id);
            setCurrId(story._id);
          }}
        >
          pass
        </button>
        <button>next</button>
      </div>
      {isError ? (
        <div>failed to load</div>
      ) : isLoading ? (
        <div>loading...</div>
      ) : story ? (
        <div className="markdown-body">
          <div>
            <h1>{story.title}</h1>
          </div>
          <div dangerouslySetInnerHTML={{ __html: story.html }} />
        </div>
      ) : (
        <div>None</div>
      )}
    </div>
  );
};

export default Home;
