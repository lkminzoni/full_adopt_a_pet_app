import React, { useState, useEffect } from "react";
import useFlashMessage from "../../../hooks/useFlashMessage";
import api from "../../../utils/api";
import formStyles from "../../form/Form.module.css";
import styles from "./Profile.module.css";
import RoundedImage from "../../layout/RoundedImage";
import Input from "../../form/Input";

const Profile = () => {
  const [token] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState();
  const { setFlashMessage } = useFlashMessage();
  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      });
  }, []);
  const onFileChange = (e) => {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let msgType = "success";
    const formData = new FormData();

    const userFormData = await Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    formData.append("user", userFormData);

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });
    setFlashMessage(data.message, msgType);
  };
  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Profile</h1>
        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}/images/users/${user.image}`
            }
            alt={`${user.name}`}
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className={formStyles.form_container}>
        <Input
          text="Image"
          type="file"
          name="image"
          handleOnChange={onFileChange}
        />
        <Input
          text="Email"
          type="email"
          name="email"
          placeholder="Enter your email..."
          handleOnChange={handleChange}
          value={user.email || ""}
        />
        <Input
          text="Name"
          type="text"
          name="name"
          placeholder="Enter your name..."
          handleOnChange={handleChange}
          value={user.name || ""}
        />
        <Input
          text="Phone"
          type="text"
          name="phone"
          placeholder="Enter your phone..."
          handleOnChange={handleChange}
          value={user.phone || ""}
        />
        <Input
          text="Password"
          type="password"
          name="password"
          placeholder="Enter your password..."
          handleOnChange={handleChange}
        />
        <Input
          text="Confirm Password"
          type="confirmpassword"
          name="confirmpassword"
          placeholder="Confirm your password..."
          handleOnChange={handleChange}
        />
        <input type="submit" value="Edit" />
      </form>
    </section>
  );
};

export default Profile;
