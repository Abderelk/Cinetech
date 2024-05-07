import React from "react";

const Notification = ({ isOpen, closeNotification, content }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-10 left-10  flex items-center justify-center z-50">
          <div className="modal mx-auto p-8 bg-green  z-10 rounded-md">
            <h2 className="text-2xl">Notification</h2>
            <span
              className="close absolute top-2 right-4  cursor-pointer text-2xl"
              onClick={closeNotification}
            >
              &times;
            </span>
            <hr className="my-4" />
            <p className="text-lg">{content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
