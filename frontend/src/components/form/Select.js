import React from "react";
import styles from "./Select.module.css";

const Select = ({ text, name, options, handleOnChange, value }) => {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <select
        name={name}
        id={name}
        onChange={handleOnChange}
        value={value || ""}
      >
        <option>Pick a color</option>
        {options.map((opt) => {
          return (
            <option value={opt} key={opt}>
              {opt}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
