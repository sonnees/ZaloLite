import React from 'react';

function Popup({ closePopup }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">This is a Popup</h2>
        <p className="mb-4">Here is some content for the popup.</p>
        <button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded"
          onClick={closePopup}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Popup;