import React, { useState, useContext } from "react";
import PartyContext from "../../Contexts/partyContext";
import TokenService from "../../services/token-service";

export default function PartyChat(props) {
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState("");
  const [editNewMessage, setEditNewMessage] = useState("");
  const [optionsButton, setOptionsButton] = useState("");
  const context = useContext(PartyContext);

  function generateForm() {
    return (
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          value={message}
          onChange={e => handleChatChange(e)}
        />
        <button type="submit">Send</button>
      </form>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.sendChatMessage(message);
    setMessage("");
  }

  function handleChatChange(e) {
    setMessage(e.target.value);
  }

  function generateChat() {
    return (
      <ul>
        {context.partyChat.map(message => {
          return (
            <li
              className="chat-message-container"
              key={message.id}
              id={message.id}
            >
              {generateMessage(message)}
              {generateUserOptionsButton(message)}
            </li>
          );
        })}
      </ul>
    );
  }

  function generateUserOptionsButton(message) {
    const { sub } = TokenService.parseJwt(TokenService.getAuthToken());
    if (message.username === sub) {
      if (optionsButton !== message.id) {
        return (
          <button
            className="user-options-button"
            id={message.id}
            onClick={e => handleOptionsButtonClick(e)}
          >
            #
          </button>
        );
      } else {
        return (
          <>
            <button
              className="user-options-button"
              onClick={e => handleCloseOptionsButton(e)}
            >
              #
            </button>
            {generateEditButton(message)}
            {generateDeleteButton(message)}
          </>
        );
      }
    }
  }

  function handleCloseOptionsButton(e) {
    setOptionsButton("");
    setEditId("");
  }

  function handleOptionsButtonClick(e) {
    setOptionsButton(e.target.id);
  }

  function generateDeleteButton(message) {
    return (
      <button
        className="delete-button"
        id={message.id}
        onClick={e => handleDeleteMessage(e)}
      >
        Delete
      </button>
    );
  }

  function handleDeleteMessage(e) {
    console.log("deleted");
    props.deleteChatMessage(e.target.id);
  }

  function generateMessage(message) {
    if (editId !== message.id) {
      return (
        <div>
          <p>{message.time_created}</p>
          <p className="chat-message-user">{message.username}: </p>
          <p className="chat-message">{message.message_body}</p>
          {message.edited ? "(edited)" : ""}
        </div>
      );
    } else if (editId === message.id) {
      return (
        <div>
          <p>{message.timeStamp}</p>
          <p className="chat-message-user">{message.username}: </p>
          <form onSubmit={e => handleEditSubmit(e)}>
            <input
              defaultValue={message.message_body}
              id={message.id}
              onChange={e => handleEditChange(e)}
            />
            <button className="save-edit-button" id={message.id}>
              Save
            </button>
          </form>
        </div>
      );
    }
  }

  function generateEditButton(message) {
    return (
      <button
        className="edit-chat-button"
        id={message.id}
        onClick={e => editMessage(e)}
      >
        Edit
      </button>
    );
  }

  function handleEditChange(e) {
    setEditNewMessage(e.target.value);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    props.sendChatEdit(editNewMessage, editId);
    setEditId("");
    setOptionsButton("");
  }

  function editMessage(e) {
    setEditId(e.target.id);
  }

  return (
    <div>
      {generateChat()}
      {generateForm()}
    </div>
  );
}