import React, { useState, useEffect } from "react";
import styles from "./AddPet.module.css";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";

import PetForm from "../../form/PetForm";

// hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

const EditPet = () => {
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token" || ""));
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPet(response.data.pet);
      });
  }, [token, id]);
  const { name, _id } = pet;

  const updatePet = async (pet) => {
    let msgType = "success";
    const formData = new FormData();
    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append("images", pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });
    const data = await api
      .patch(`/pets/${_id}`, formData, {
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
      <div className={styles.addpet_header}>
        <h1>Edit Pet: {name}</h1>
        <p>After edition the data will be updated in the database.</p>
      </div>
      {name && (
        <PetForm handleSubmit={updatePet} btnText="Update" petData={pet} />
      )}
    </section>
  );
};

export default EditPet;
