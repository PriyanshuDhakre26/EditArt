import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./userprofileview.css";

function userprofileview() {
  const { id } = useParams();
  const navigate = useNavigate();
const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      console.log(response.data);

      setUser(response.data.user);
     setPosts(response.data.posts || []);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile_container">
      <div className="profile_header">
        <div className="profile_avatar">
          <div className="avatar"></div>
        </div>

        <div className="profile_info">
          <h1>{user.accountName}</h1>

          <h3>{user.name}</h3>

          <div className="profile_stats">
            <div>
              <strong>{posts.length}</strong>
              <span>Posts</span>
            </div>

            <div>
              <strong>0</strong>
              <span>Followers</span>
            </div>

            <div>
              <strong>0</strong>
              <span>Following</span>
            </div>
          </div>

          <div className="profile_actions">
            <button className="follow_btn">Follow</button>

            <button
              className="message_btn"
              onClick={() => navigate(`/chat/${user._id}`)}
            >
              Message
            </button>
          </div>
        </div>
      </div>

      <div className="profile_tabs">
        <button>Posts</button>
        <button>Tagged</button>
      </div>

      <div className="posts_grid">
        {posts.map((post) => (
          <div key={post._id} className="post_card">
            {post.type === "image" && (
              <img src={post.mediaUrl} alt={post.caption} />
            )}

            {post.type === "video" && (
              <video controls>
                <source src={post.mediaUrl} />
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default userprofileview;
