import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Food(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <tr>
      <td className="px-4 py-2">{props.day}</td>
      <td className="px-4 py-2">{props.vendor}</td>
      <td className="px-4 py-2">{props.category}</td>
      <td className="px-4 py-2">{props.foodCode}</td>
      <td>
        <button onClick={handleClick}>
          <DeleteIcon />
        </button>
      </td>
    </tr>
  );
}
