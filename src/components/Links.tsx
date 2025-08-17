import { Add, AddSquare, ArchiveAdd, CloseCircle, Edit } from 'iconsax-reactjs';
import React from 'react';

interface Link {
  id: number;
  link: string;
  color1: string;
  color2: string;
  name: string;
}

interface LinksProps {
  links: Link[];
  setShowAddBox: (show: boolean) => void;
  deleteMode: boolean;
  editMode: boolean;
  deleteLink: (id: number) => void;
  openEditBox: (link: Link) => void; // New prop for opening edit box
}

const Links: React.FC<LinksProps> = ({ links, setShowAddBox, deleteMode, editMode, deleteLink, openEditBox }) => {
  return (
    <div className="container" id="linkCon">
      {links.map((link, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <a href={link.link} target="_blank" rel="noopener noreferrer">
            <button className="btn" style={{ background: `linear-gradient(145deg, ${link.color1}, ${link.color2})` }}>
              {link.name}
            </button>
          </a>
          {deleteMode && (
            <button
              onClick={() => deleteLink(link.id)}
              className='delete-link-icon'
            >
              <CloseCircle />
            </button>
          )}
          {editMode && (
            <button
              onClick={() => openEditBox(link)}
              className='edit-link-icon'>
              <Edit size={12} />
            </button>
          )}
        </div>
      ))}
      <button className="btn" style={{ paddingTop: "10px", paddingBottom: "8px" }} onClick={() => setShowAddBox(true)}><Add size={24} /></button>
    </div>
  );
};

export default Links;
