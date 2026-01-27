import "./messagetoast.css";

const MessageToast = ({ message }) => {
  return <div className={`toast toast-${message.type}`}>{message.text}</div>;
};

export default MessageToast;
