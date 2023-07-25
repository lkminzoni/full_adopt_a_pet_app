import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import styles from "./PetDetails.module.css";
import { useParams, Link } from "react-router-dom";

// hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

const PetDetails = () => {
  const [pet, setPet] = useState({});
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const [token] = useState(localStorage.getItem("token") || "");

  const schedule = async () => {
    let msgType = "success";
    const data = await api
      .patch(`pets/schedule/${pet._id}`, {
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
  };

  useEffect(() => {
    api.get(`/pets/${id}`).then((response) => {
      setPet(response.data.pet);
    });
  }, [id]);
  const { name, images, weight, age } = pet;
  return (
    <>
      {name && (
        <section className={styles.pet_details_container}>
          <div className={styles.pet_details_header}>
            <h1>This is: {name}</h1>
            <p>Schedule a visit to meet it.</p>
          </div>
          <div className={styles.pet_images}>
            {images.map((image, index) => {
              return (
                <img
                  src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                  alt={name}
                  key={index}
                />
              );
            })}
          </div>
          <p>
            <span className="bold">Weight:</span> {weight} lb
          </p>
          <p>
            <span className="bold">Age:</span> {age} years old
          </p>
          {!token ? (
            <>
              <p>You need to be logged in order to schedule a visit.</p>
              <Link to={"/login"}>longin</Link>
            </>
          ) : (
            <button onClick={schedule}>Schedule a vist</button>
          )}
        </section>
      )}
    </>
  );
};

export default PetDetails;
