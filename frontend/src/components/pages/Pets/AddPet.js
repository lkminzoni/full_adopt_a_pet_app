import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "../../../hooks/useFlashMessage";
import api from "../../../utils/api";
import styles from "./AddPet.module.css";
// Components
import PetForm from "../../form/PetForm";

const AddPet = () => {
  const { setFlashMessage } = useFlashMessage();
  const [token] = useState(localStorage.getItem("token") || "");
  const history = useNavigate();
  const registerPet = async (pet) => {
    let msg = "success";
    const formData = new FormData();
    const petFormData = await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append(`images`, pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    formData.append("pet", petFormData);

    const data = await api
      .post("/pets/create", formData, {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data",
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msg = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msg);
    if (msg === "error") {
      history("/pet/add");
      return;
    }
    history("/pet/mypets");
  };
  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Add a Pet</h1>
        <p>Announce a a pet for adoption</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText="Register" />
    </section>
  );
};

export default AddPet;
