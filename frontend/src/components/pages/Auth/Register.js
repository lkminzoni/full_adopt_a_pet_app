import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../form/Input";
import styles from "../../form/Form.module.css";

import { Context } from "../../../context/UserContext";

const Register = () => {
  const [user, setUser] = useState({});

  const { register } = useContext(Context);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send to database
    register(user);
  };

  return (
    <section className={styles.form_container}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Name"
          type="text"
          name="name"
          placeholder="Insert your name..."
          handleOnChange={handleChange}
        />
        <Input
          text="Phone"
          type="text"
          name="phone"
          placeholder="Insert your phone #..."
          handleOnChange={handleChange}
        />
        <Input
          text="Email"
          type="email"
          name="email"
          placeholder="Insert your email..."
          handleOnChange={handleChange}
        />
        <Input
          text="Password"
          type="password"
          name="password"
          placeholder="Insert your password..."
          handleOnChange={handleChange}
        />
        <Input
          text="Confirm Email"
          type="password"
          name="confirmpassword"
          placeholder="Confirm your password..."
          handleOnChange={handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
      <p>
        Already have an account? <Link to="/login">Click Here</Link>
      </p>
    </section>
  );
};

export default Register;
