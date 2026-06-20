import { useState, useEffect } from "react";
import axios from "axios";
import "./search.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

function Search() {
  const [query, setQuery] = useState("");

  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  // Load Explore Feed Initially
  useEffect(() => {
    fetchExploreImages();
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchDatabase();
      } else {
        setUsers([]);
        setPosts([]);
        fetchExploreImages();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchExploreImages = async () => {
    try {
      const response = await axios.get(
        "https://api.pexels.com/v1/search?query=creative&per_page=60",
        {
          headers: {
            Authorization: apiKey,
          },
        },
      );

      setImages(response.data.photos);
    } catch (error) {
      console.log(error);
    }
  };

const searchDatabase = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/search?q=${query}`,
    );

    setUsers(response.data.users || []);
    setPosts(response.data.posts || []);

    // Always search Pexels too
    searchPexels();
  } catch (error) {
    console.log(error);
  }
};

  const searchPexels = async () => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&per_page=30`,
        {
          headers: {
            Authorization: apiKey,
          },
        },
      );

      setImages(response.data.photos);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="search_page">
      {/* Search Header */}
      <div className="search_header">
        <div className="search_bar">
          <FaSearch />

          <input
            type="text"
            placeholder="Search accounts, posts, images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button
          className="profile_btn"
          onClick={() => navigate("/userprofile")}
        >
          Profile
        </button>
      </div>

      {/* Accounts */}
      {users.length > 0 && (
        <div className="users_section">
          <h3>Accounts</h3>

          {users.map((user) => (
            <div
              key={user._id}
              className="user_card"
              onClick={() => navigate(`/user/${user._id}`)}
            >
              <div className="avatar_small"></div>

              <div>
                <h4>{user.accountName}</h4>
                <p>{user.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {/* {posts.length > 0 && (
        <div className="posts_section">
          <h3>Posts</h3>

          <div className="posts_grid">
            {posts.map((post) => (
              <div key={post._id} className="post_item">
                {post.type === "image" && (
                  <img src={post.mediaUrl} alt={post.caption} />
                )}

                {post.type === "video" && (
                  <video controls>
                    <source src={post.mediaUrl} />
                  </video>
                )}

                {post.type === "text" && (
                  <div className="text_post">
                    <p>{post.caption}</p>
                  </div>
                )}

                <div className="post_overlay">
                  <p>{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Pexels Results OR Explore Feed */}
      {images.length > 0 && (
        <div className="explore_section">
          <h3>{query ? "Related Images" : "Explore"}</h3>

          <div className="explore_grid">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.src.medium}
                alt={img.photographer}
                onClick={() =>
                  navigate(`/image/${img.id}`, {
                    state: {
                      selectedImage: img,
                      allImages: images,
                    },
                  })
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
