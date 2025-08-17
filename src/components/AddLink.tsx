import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

interface AddLinkProps {
  showAddBox: boolean;
  setShowAddBox: (show: boolean) => void;
  addName: string;
  setAddName: (name: string) => void;
  addLink: string;
  setAddLink: (link: string) => void;
  addComp: () => void;
}

const AddLink: React.FC<AddLinkProps> = ({ showAddBox, setShowAddBox, addName, setAddName, addLink, setAddLink, addComp }) => {
  const [previewColors, setPreviewColors] = useState<[string, string] | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
      if (addLink) {
        try {
          const origin = (new URL(addLink)).origin;
          const faviconUrl = `https://services.keeweb.info/favicon/${origin}`;
          const colorThief = new ColorThief();
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = faviconUrl;

          img.onload = async () => {
            try {
              const colors = colorThief.getPalette(img, 2);
              const color1 = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
              const color2 = `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`;
              setPreviewColors([color1, color2]);
            } catch (error) {
              console.error('Error getting colors from favicon:', error);
              setPreviewColors(null);
            }
          };
        } catch (error) {
          console.error('Invalid URL:', error);
          setPreviewColors(null);
        }
      } else {
        setPreviewColors(null);
      }
    };

    const debounceTimeout = setTimeout(fetchColors, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimeout);
  }, [addLink]);

  if (!showAddBox) {
    return null;
  }

  return (
    <div className="add-box" style={{ display: 'block' }}>
      <button id="addClose" onClick={() => setShowAddBox(false)}>X</button>
      <center>
        <div style={{ marginBottom: '10px' }}>
          <p>Preview:</p>
          <button className="btn" style={{ background: previewColors?.length ? `linear-gradient(145deg, ${previewColors[0]}, ${previewColors[1]})` : "grey" }}>
            {addName || 'Button'}
          </button>
        </div>
        <br />
        <input type="text" id="addName" placeholder="Name" autoComplete="off" value={addName} onChange={(e) => setAddName(e.target.value)} />
        <input type="text" id="addLink" placeholder="Link" autoComplete="off" value={addLink} onChange={(e) => setAddLink(e.target.value)} />
        <br />
        <button id="addComp" className="btn" onClick={addComp}>Add</button>
      </center>
    </div>
  );
};

export default AddLink;
