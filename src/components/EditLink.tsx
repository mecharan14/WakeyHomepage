import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

interface Link {
  id: number;
  name: string;
  link: string;
  color1: string;
  color2: string;
}

interface EditLinkProps {
  showEditBox: boolean;
  setShowEditBox: (show: boolean) => void;
  currentLink: Link;
  updateLink: (id: number, newName: string, newLink: string, newColor1: string, newColor2: string) => void;
}

const EditLink: React.FC<EditLinkProps> = ({ showEditBox, setShowEditBox, currentLink, updateLink }) => {
  const [editName, setEditName] = useState(currentLink.name);
  const [editLink, setEditLink] = useState(currentLink.link);
  const [editColor1, setEditColor1] = useState(currentLink.color1);
  const [editColor2, setEditColor2] = useState(currentLink.color2);
  const [previewColors, setPreviewColors] = useState<[string, string] | null>([currentLink.color1, currentLink.color2]);

  useEffect(() => {
    setEditName(currentLink.name);
    // setEditLink(currentLink.link);
    // setEditColor1(currentLink.color1);
    // setEditColor2(currentLink.color2);
    const convertedColors = [convertRgbToHex(currentLink.color1), convertRgbToHex(currentLink.color2)];
    console.log(convertedColors);
    setPreviewColors([currentLink.color1, currentLink.color2]);
    setEditColor1(convertedColors[0]);
    setEditColor2(convertedColors[1]);
  }, [currentLink]);

  const onEditLinkChange = () => {
    const fetchColors = async () => {
      if (editLink) {
        try {
          const origin = (new URL(editLink)).origin;
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
              setEditColor1(convertRgbToHex(color1)); // Update input fields with fetched colors
              setEditColor2(convertRgbToHex(color2));
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

    const debounceTimeout = setTimeout(fetchColors, 500);

    return () => clearTimeout(debounceTimeout);
  }

  const handleSave = () => {
    updateLink(currentLink.id, editName, editLink, editColor1, editColor2);
  };

  const convertRgbToHex = (rgb: string) => {
    if (!rgb || !rgb.startsWith('rgb')) return rgb;
    const rgbValues = rgb.match(/\d+/g);
    if (!rgbValues) return rgb;
    const hex = `#${(1 << 24 | parseInt(rgbValues[0]) << 16 | parseInt(rgbValues[1]) << 8 | parseInt(rgbValues[2])).toString(16).slice(1)}`;
    return hex;
  };

  if (!showEditBox) {
    return null;
  }

  return (
    <div className="add-box" style={{ display: 'block' }}>
      <button id="addClose" onClick={() => setShowEditBox(false)}>X</button>
      <center>
        <h2>Edit Link</h2>
        <input type="text" placeholder="Name" autoComplete="off" value={editName} onChange={(e) => setEditName(e.target.value)} />
        <input type="text" placeholder="Link" autoComplete="off" value={editLink} onChange={(e) => {
          setEditLink(e.target.value);
          onEditLinkChange();
        }} />
        <br />
        <div style={{ marginBottom: '10px' }}>
          <p>Preview:</p>
          {previewColors && (
            <button className="btn" style={{ background: `linear-gradient(145deg, ${previewColors[0]}, ${previewColors[1]})` }}>
              {editName || 'Button'}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
          <label>Color 1:</label>
          <input type="color" value={editColor1} onChange={(e) => {
            setEditColor1(e.target.value);
            setPreviewColors([e.target.value, editColor2]);
          }} />
          <label>Color 2:</label>
          <input type="color" value={editColor2} onChange={(e) => {
            setEditColor2(e.target.value);
            setPreviewColors([editColor1, e.target.value]);
          }} />
        </div>
        <button className="btn" onClick={handleSave}>Save</button>
        <button className="btn" onClick={() => setShowEditBox(false)}>Cancel</button>
      </center>
    </div>
  );
};

export default EditLink;