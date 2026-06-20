import { useEffect, useState } from "react";
import axios from "axios";
import "./userprofile.css";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileFile, setProfileFile] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editName, setEditName] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);
  const [editBio, setEditBio] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/posts", {
        headers: {
          Authorization: token,
        },
      });

      setPosts(response.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: token,
          },
        });
        setEditName(response.data.user.name);

        setEditBio(response.data.user.bio || "");
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchPosts();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "/api/auth/profile",
        {
          name: editName,
          bio: editBio,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setUser(response.data.user);

      setShowEdit(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleCreatePost = async () => {
    try {
      if (!file) {
        alert("Select an image or video");
        return;
      }

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("caption", caption);

      await axios.post("/api/posts", formData, {
        headers: {
          Authorization: token,
        },
      });

      setFile(null);
      setPreview(null);
      setCaption("");

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileUpload = async (file) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("image", file);

      const response = await axios.put("/api/auth/profile-picture", formData, {
        headers: {
          Authorization: token,
        },
      });

      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const confirmDelete = window.confirm("Delete this post?");

      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      await axios.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: token,
        },
      });

      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile_container">
      {/* Profile Header */}
      <div className="profile_header">
        <div className="profile_avatar">
          <div className="avatar_wrapper">
            <img
              src={user.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="avatar"
            />
          </div>
        </div>

        <div className="profile_info">
          <div className="profile_top_row">
            <div className="profile_top_row">
              <h2>{user.accountName}</h2>

              <button className="edit_btn" onClick={() => setShowEdit(true)}>
                Edit Profile
              </button>

              {/* <button className="share_btn">Share Profile</button> */}
            </div>

            {/* <button className="edit_btn" onClick={() => setShowEdit(true)}>
              Edit Profile
            </button> */}
          </div>
          <h4>{user.name}</h4>

          <p className="bio">{user.bio || "No bio yet"}</p>

          <div className="profile_stats">
            <div className="stat">
              <strong>{posts.length}</strong>
              <span>posts</span>
            </div>

            <div className="stat">
              <strong>0</strong>
              <span>followers</span>
            </div>

            <div className="stat">
              <strong>0</strong>
              <span>following</span>
            </div>
          </div>
        </div>
        {showEdit && (
          <div className="modal_overlay">
            <div className="edit_modal">
              <h2>Edit Profile</h2>
              <div className="change_photo_section">
                <img
                  src={
                    profilePreview ||
                    user.profilePic ||
                    "https://via.placeholder.com/150"
                  }
                  alt="profile"
                  className="edit_profile_preview"
                />

                <label className="change_photo_btn">
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (!file) return;

                      setProfilePreview(URL.createObjectURL(file));

                      handleProfileUpload(file);
                    }}
                  />
                </label>
              </div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
              />

              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Write your bio..."
              />

              <div className="modal_buttons">
                <button onClick={handleUpdateProfile}>Save</button>

                <button onClick={() => setShowEdit(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showCreate && (
          <div className="modal_overlay">
            <div className="create_modal">
              <h2>Create Artwork</h2>

              <div className="upload_section">
                {preview ? (
                  <div className="preview_container">
                    {file?.type.startsWith("image") ? (
                      <img src={preview} alt="preview" className="preview" />
                    ) : (
                      <video src={preview} controls className="preview" />
                    )}

                    <button
                      className="remove_media"
                      onClick={() => {
                        setFile(null);
                        setPreview("");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="upload_box">
                    <span>📸 Upload Image or Video</span>
                    <p>Share your creativity with EditArt</p>

                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </label>
                )}
              </div>

              <div className="caption_section">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={500}
                  placeholder="Tell your story..."
                />

                <span className="char_count">{caption.length}/500</span>
              </div>

              <div className="modal_buttons">
                <button
                  className="publish_btn"
                  onClick={() => {
                    handleCreatePost();
                    setShowCreate(false);
                  }}
                >
                  Publish
                </button>

                <button
                  className="cancel_btn"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Post */}
      <button className="create_post_btn" onClick={() => setShowCreate(true)}>
        + Create Post
      </button>
      {/* <div className="create_post">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
        />

        {preview && (
          <div className="preview_container">
            {file?.type.startsWith("image") ? (
              <img src={preview} alt="preview" className="preview" />
            ) : (
              <video src={preview} controls className="preview" />
            )}
          </div>
        )}

        <div className="upload_row">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          <button className="post_btn" onClick={handleCreatePost}>
            Post
          </button>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="profile_tabs">
        <button className="active_tab">POSTS</button>

        <button onClick={() => navigate("/search")}>SEARCH</button>

        <button>TAGGED</button>
      </div>
      <div className="posts_grid">
        {posts.map((post) => (
          <div
            key={post._id}
            className="post_card"
            onClick={() => setSelectedPost(post)}
          >
            {post.type === "image" ? (
              <img src={post.mediaUrl} alt="post" />
            ) : (
              <video>
                <source src={post.mediaUrl} />
              </video>
            )}
          </div>
        ))}
      </div>
      {selectedPost && (
        <div className="modal_overlay" onClick={() => setSelectedPost(null)}>
          <div className="post_modal" onClick={(e) => e.stopPropagation()}>
            <div className="post_modal_media">
              {selectedPost.type === "image" ? (
                <img src={selectedPost.mediaUrl} alt="post" />
              ) : (
                <video controls autoPlay>
                  <source src={selectedPost.mediaUrl} />
                </video>
              )}
            </div>

            <div className="post_modal_info">
              <h3>{user.accountName}</h3>

              <p>{selectedPost.caption || "No caption"}</p>

              <button
                className="delete_btn"
                onClick={() => {
                  handleDeletePost(selectedPost._id);
                  setSelectedPost(null);
                }}
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default UserProfile;
