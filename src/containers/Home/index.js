import React, { useState, useEffect } from "react";
import { client, getPublications } from "../../services/api/instance";
import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";
import Publication from "../../components/Publication";

function Home() {
  const postTypes = ["latest", "active", "bountied", "unanswered"];
  const [postType, setPostType] = useState(postTypes[0]);

  const [publications, setPublications] = useState([]);
  useEffect(() => {
    fetchPublications();
  });

  async function fetchPublications() {
    try {
      const response = await client.query(getPublications).toPromise();
      setPublications(response.data.explorePublications.items);
    } catch (e) {
      console.log({ e });
    }
  }
  return (
    <div>
      <Header />
      <div className="flex flex-row h-max">
        <LeftSidebar />
        <div className="w-1/2">
          <div className="flex flex-row pb-2">
            {postTypes.map((type, id) => (
              <span
                key={id}
                className={`${
                  type === postType ? "text-primary bg-tertiary" : ""
                } px-2 py-1 border border-tertiary rounded mx-1 cursor-pointer`}
                onClick={() => setPostType(type)}
              >
                {type}
              </span>
            ))}
          </div>
          <div>
            {publications.map((pub, id) => (
              <div key={id}>
                <Publication publication={pub} />
              </div>
            ))}
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home;
