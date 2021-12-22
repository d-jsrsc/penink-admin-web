import type { NextPage } from "next";
import useSWR from "swr";

import axios from 'axios'
import { useState, useEffect } from 'react';

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const storyPass = async (id: string) => await axios.put(`/api/story`, {
  publishStatus: '',
})


function useNextStory (id: string | undefined) {
  const { data, error } = useSWR(`/api/story?id=${id}`, fetcher)

  return {
    story: data,
    isLoading: !error && !data,
    isError: error
  }
}

const Home: NextPage = () => {
  const [ currId, setCurrId ] = useState(1);
  const { story, isLoading, isError } = useNextStory(currId + '');


  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return (
    <div>
      <div><button onClick={async () => {
        await storyPass('haha');
        setCurrId( currId + 1)
      }}>pass</button><button>next</button></div>
      <div>hello {story.name}!</div>
    </div>
  );
};

export default Home;
