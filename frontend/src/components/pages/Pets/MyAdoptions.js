import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import styles from "./Dashboard.module.css";
import RoundedImage from "../../layout/RoundedImage";

const MyAdoptions = () => {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem("token" || ""));

  useEffect(() => {
    api
      .get("/pets/myadoptions", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPets(response.data.pets);
      });
  }, [token]);

  return (
    <section>
      <div className={styles.petlist_header}>
        <h1>Myadoptions</h1>
      </div>
      <div className={styles.petlist_container}>
        {pets.length > 0 &&
          pets.map((pet) => {
            const { name, images, _id, available, user } = pet;
            return (
              <div className={styles.petlist_row} key={{ name, _id }}>
                <RoundedImage
                  src={`${process.env.REACT_APP_API}images/pets/${images[0]}`}
                  alt={name}
                  width="px75"
                />
                <span className="bold">{name}</span>
                <div className={styles.contacts}>
                  <p>
                    <span className="bold">Call to:</span> {user.phone}
                  </p>
                  <p>
                    <span className="bold">Speak with:</span> {user.name}
                  </p>
                </div>
                <div className={styles.actions}>
                  {available ? (
                    <p>Adoption in process.</p>
                  ) : (
                    <p>Thank You! For adopting {name}</p>
                  )}
                </div>
              </div>
            );
          })}
        {pets.length === 0 && <p>There are not adoptions yet. :(</p>}
      </div>
    </section>
  );
};

export default MyAdoptions;
