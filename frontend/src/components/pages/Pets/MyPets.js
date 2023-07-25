import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import RoundedImage from "../../layout/RoundedImage";
import styles from "./Dashboard.module.css";

// hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  useEffect(() => {
    api
      .get("/pets/mypets", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((res) => setPets(res.data.pets));
  }, [token]);

  async function concludeAdoption(id) {
    let msgType = "success";
    const data = await api
      .patch(`/pets/conclude/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
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
  }

  async function removePet(id) {
    let type = "success";
    const data = await api
      .delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        const updatedPets = pets.filter((pet) => pet._id !== id);
        setPets(updatedPets);
        return response.data;
      })
      .catch((err) => {
        type = "error";
        return err.response.data;
      });
    setFlashMessage(data.message, type);
  }

  return (
    <section>
      <div className={styles.petslist_header}>
        <h1>MyPets</h1>
        <Link to={"/pet/add"}>Announce a pet</Link>
      </div>
      <div className={styles.petslist_container}>
        {pets.length !== 0 &&
          pets.map((pet, index) => {
            const { name, images, _id, adopter, available } = pet;
            return (
              <div className={styles.petlist_row} key={name}>
                <RoundedImage
                  src={`${process.env.REACT_APP_API}images/pets/${images[0]}`}
                  alt={name}
                  width="px75"
                />
                <span className="bold">{name}</span>
                <div className={styles.actions}>
                  {available ? (
                    <>
                      {adopter && (
                        <button
                          className={styles.conclude_btn}
                          onClick={() => concludeAdoption(_id)}
                        >
                          Finish adoption
                        </button>
                      )}
                      <Link to={`/pet/edit/${_id}`}>Edit</Link>
                      <button onClick={() => removePet(_id)}>Delete</button>
                    </>
                  ) : (
                    <p>Not Available..</p>
                  )}
                </div>
              </div>
            );
          })}
        {pets.length === 0 && <p>No Announced Pets</p>}
      </div>
    </section>
  );
};

export default MyPets;
