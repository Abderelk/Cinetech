import React from "react";

const Notification = ({ isOpen, closeNotification, content }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-10 left-10  flex items-center justify-center z-50">
          <div className="modal mx-auto p-8 bg-gray border-red border-2 rounded-lg shadow-lg z-10 rounded-md">
            <span
              className="close absolute top-1 left-4  text-red cursor-pointer text-2xl"
              onClick={closeNotification}
            >
              &times;
            </span>
            <p className="text-lg">{content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
