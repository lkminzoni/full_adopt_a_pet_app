import React, { useState } from "react";
import formStyles from "./Form.module.css";
import Input from "./Input";
import Select from "./Select";

const PetForm = ({ handleSubmit, petData, btnText }) => {
  const [pet, setPet] = useState(petData || {});
  const [preview, setPreview] = useState([]);
  const colors = ["Black", "White", "Gray", "Caramel"];

  function onFileChange(e) {
    console.log(Array.from(e.target.files));
    setPreview(Array.from(e.target.files));
    setPet({ ...pet, images: [...e.target.files] });
  }

  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value });
  }

  function handleColor(e) {
    setPet({
      ...pet,
      color: e.target.options[e.target.selectedIndex].text,
    });
  }

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(pet);
  };

  return (
    <form className={formStyles.form_container} onSubmit={submit}>
      <div className={formStyles.preview_pet_images}>
        {preview.length > 0
          ? preview.map((image, index) => {
              return (
                <img
                  src={URL.createObjectURL(image)}
                  alt={pet.name}
                  key={`${pet.name}+${index}`}
                />
              );
            })
          : pet.images &&
            pet.images.map((image, index) => {
              return (
                <img
                  src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                  alt={pet.name}
                  key={`${pet.name}+${index}`}
                />
              );
            })}
      </div>
      <Input
        text="Pet Images"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
      />
      <Input
        text="Pet Name"
        type="text"
        name="name"
        placeholder="Insert pet's name..."
        handleOnChange={handleChange}
        value={pet.name || ""}
      />
      <Input
        text="Pet Age"
        type="text"
        name="age"
        placeholder="Insert pet's age..."
        handleOnChange={handleChange}
        value={pet.age || ""}
      />
      <Input
        text="Pet Weight"
        type="number"
        name="weight"
        placeholder="Insert pet's weight..."
        handleOnChange={handleChange}
        value={pet.weight || ""}
      />
      <Input
        text="Description:"
        type="text"
        name="description"
        placeholder="Insert a short description..."
        handleOnChange={handleChange}
        value={pet.description || ""}
      />
      <Select
        name={"color"}
        text={"Color"}
        options={colors}
        handleOnChange={handleColor}
        value={pet.color || ""}
      />
      <input type="submit" value={btnText} />
    </form>
  );
};

export default PetForm;
