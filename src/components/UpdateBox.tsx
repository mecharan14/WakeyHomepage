import React from 'react';

interface UpdateBoxProps {
  showUpdateBox: boolean;
  setShowUpdateBox: (show: boolean) => void;
  update: {
    new: string[];
  };
}

const UpdateBox: React.FC<UpdateBoxProps> = ({ showUpdateBox, setShowUpdateBox, update }) => {
  if (!showUpdateBox) {
    return null;
  }

  return (
    <div className="updateBox" style={{ display: 'block' }}>
      <center>
        <h1>New Update</h1>
      </center>
      <br />
      <button onClick={() => setShowUpdateBox(false)}>X</button>
      <div id="whatsnew">
        <ol>
          {update.new.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default UpdateBox;
