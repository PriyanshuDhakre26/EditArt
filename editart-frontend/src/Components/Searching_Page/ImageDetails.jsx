import "./ImageDetails.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ImageDetails() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
 
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://randomuser.me/api/?results=200",
        );
        setUser(response.data.results[0]);
        setUsers(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
  const { state } = useLocation();
  if (!state) {
    return <h2>No image data found</h2>;
  }
  if (!user) {
    return <h2>Loading user...</h2>;
  }
  if (users.length === 0) {
    return <h2>Loading users...</h2>;
  }
  const { selectedImage, allImages } = state;
  return (
    <>
      <div className="details_page">
        <div className="details-container">
          <div className="image-section">
            <img src={selectedImage.src.large} alt={selectedImage.alt} />
          </div>
          <div className="info-section">
            <div className="user-header">
              <img
                className="profile-pic"
                src={user.picture.large}
                alt="Profile"
              />
              <div className="username">
                <h3>
                  {user.name.first} {user.name.last}
                </h3>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="posts">
          {allImages.map((img, index) => {
            const randomUser = users[index];
            return (
              <div className="details-container" key={img.id}>
                <div className="image-section">
                  <img src={img.src.large} alt={img.alt} />
                </div>
                <div className="info-section">
                  <div className="action_buttons">
                    <button className="follow_btn">Follow</button>
                    <button className="message_btn">Message</button>
                  </div>
                  <div className="user-header">
                    <img
                      className="profile-pic"
                      src={randomUser?.picture?.large}
                      alt="Profile"
                    />
                    <div className="username">
                      <h3>
                        {randomUser?.name?.first} {randomUser?.name?.last}
                      </h3>
                      <p>{randomUser?.email}</p>
                      <p>{randomUser?.location?.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="gallery"> {allImages.map((img) => ( <img key={img.id} src={img.src.medium} alt={img.alt} /> ))} </div> */}
    </>
  );
}
export default ImageDetails;
