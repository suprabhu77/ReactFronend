import React, { useEffect, useState } from "react";
import axios from "axios";

function LoginForm() {
  const logindata = { username: "", password: "" };

  const [data, setData] = useState(logindata);
  const [token, setToken] = useState("");
  const [notes, setNotes] = useState([]);

  console.log("PRCESS", process.env.REACT_APP_CREATE_USER_URL_CONFIG)

  const notedata = { name: "", description: "" };
  const [note, setNote] = useState(notedata);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addNote = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleGetNote = () => {
    if (token) {
      axios
        .get(
          process.env.REACT_APP_GET_NOTE_URL,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setNotes(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleAddNote = () => {
    if (token) {
      axios
        .post(
          process.env.REACT_APP_GET_NOTE_URL,
          note,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          // Fetch updated notes after adding a new note
          handleGetNote();
          // Clear the note form
          setNote(notedata);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    handleGetNote();
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    axios
      .post(
        process.env.REACT_APP_CREATE_USER_URL_CONFIG,
        data
      )
      .then((response) => {
        if (response.status === 200) {
          axios
            .post(
              process.env.REACT_APP_TOKEN_URL,
              data
            )
            .then((response) => {
              setToken(response.data["access"]);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  console.log("Notes", notes);

  return !token ? (
    <div>
      <form onSubmit={handleSubmit}>
        <label>UserName</label>
        <input
          type="text"
          name="username"
          value={data.username}
          onChange={handleChange}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  ) : (
    <div>
      {notes &&
        notes.length > 0 &&
        notes.map((note, index) => (
          <div key={index}>
            <div>{note.name}</div>
            <div>{note.description}</div>
          </div>
        ))}
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleAddNote();
          }}
        >
          <label>Add Note</label>
          <br />
          <label>Name</label>
          <input type="text" name="name" value={note.name} onChange={addNote} />
          <br />
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={note.description}
            onChange={addNote}
          />
          <br />
          <button type="submit">Add Note</button>
        </form>
      </div>
      <h1>Logged in -- {token}</h1>
    </div>
  );
}

export default LoginForm;
