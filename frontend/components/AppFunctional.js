import React, { useState } from "react";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // Middle square index (2,2)

export default function AppFunctional(props) {
  // Set up the state variables
  const [index, setIndex] = useState(initialIndex); // B's position
  const [steps, setSteps] = useState(initialSteps); // Step counter
  const [email, setEmail] = useState(initialEmail); // Email input
  const [message, setMessage] = useState(initialMessage); // Display messages (errors/success)

  // Helper to calculate X, Y coordinates based on index
  function getXY() {
    const x = (index % 3) + 1; // X coordinate
    const y = Math.floor(index / 3) + 1; // Y coordinate
    return [x, y];
  }

  // Helper to construct the coordinates message
  function getXYMessage() {
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  // Reset function to return all states to their initial values
  function reset() {
    setIndex(initialIndex);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setMessage(initialMessage);
  }

  // Helper to calculate the next index based on direction
  function getNextIndex(direction) {
    const moveMap = {
      left: index % 3 === 0 ? index : index - 1,
      right: index % 3 === 2 ? index : index + 1,
      up: index < 3 ? index : index - 3,
      down: index > 5 ? index : index + 3,
    };
    return moveMap[direction];
  }

  // Handler to handle movement events
  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if (nextIndex === index) {
      // If we're trying to move out of bounds
      if (direction === "up" && index < 3) {
        setMessage("You can't go up");
      } else if (direction === "down" && index > 5) {
        setMessage("You can't go down");
      } else if (direction === "left" && index % 3 === 0) {
        setMessage("You can't go left");
      } else if (direction === "right" && index % 3 === 2) {
        setMessage("You can't go right");
      }
    } else {
      // Valid move
      setIndex(nextIndex);
      setSteps(steps + 1);
      setMessage(""); // Clear message when valid move happens
    }
  }

  // Handler for input change
  function onChange(evt) {
    setEmail(evt.target.value);
  }

  // Handler for form submission
  function onSubmit(evt) {
    evt.preventDefault();
    const [x, y] = getXY();
    const payload = { x, y, steps, email };

    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setEmail(""); // Reset the email input field after successful submission
      })
      .catch((err) => setMessage("Error submitting form."));
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">
          You moved {steps} {steps === 1 ? "time" : "times"}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
