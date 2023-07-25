import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get("/pets").then((response) => {
      setPets(response.data.pets);
    });
  }, []);
  return (
    <section>
      <div className={styles.pet_home_header}>
        <h1>Adopt a pet</h1>
        <p>Check who is available!</p>
      </div>
      <div className={styles.pet_container}>
        {pets.length > 0 &&
          pets.map((pet, index) => {
            const { name, weight, available, _id, images } = pet;
            return (
              <div className={styles.pet_card} key={name}>
                <div
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_API}/images/pets/${images[0]})`,
                  }}
                  className={styles.pet_card_image}
                ></div>
                <h3>{name}</h3>
                <p>
                  <span className="bold">Weight: {weight} lb</span>
                </p>
                {available ? (
                  <Link to={`/pet/${_id}`}>More...</Link>
                ) : (
                  <p className={styles.adopted_text}>Adopted</p>
                )}
              </div>
            );
          })}
        {pets.length === 0 && (
          <p>
            There are no available pets for adoption, come later and check
            again!
          </p>
        )}
      </div>
    </section>
  );
};

export default Home;
