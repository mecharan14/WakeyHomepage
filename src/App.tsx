import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import './index.css';
import Welcome from './components/Welcome';
import Links from './components/Links';
import Todos from './components/Todos';
import AddLink from './components/AddLink';
import UpdateBox from './components/UpdateBox';
import Toast from './components/Toast';
import EditLink from './components/EditLink'; // Import the new EditLink component
import { Edit, TickCircle, Trash } from 'iconsax-reactjs';

interface Link {
  id: number;
  name: string;
  link: string;
  color1: string;
  color2: string;
}

interface Todo {
  id: number;
  title: string;
}

interface Update {
  version: string;
  new: string[];
}

const App = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddBox, setShowAddBox] = useState(false);
  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [addName, setAddName] = useState('');
  const [addLink, setAddLink] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showEditBox, setShowEditBox] = useState(false); // State for EditLink modal visibility
  const [currentLink, setCurrentLink] = useState<Link | null>(null); // State for the link being edited

  const update: Update = {
    version: "1.5.15",
    new: [
      "Shows your name with welcome.",
    ]
  }

  useEffect(() => {
    init();
    checkUpdate();
    getTodos();
  }, []);

  const init = () => {
    let storedLinks = localStorage.getItem('data');
    if (!storedLinks || JSON.parse(storedLinks)[0].name !== 'Google') {
      const defaultLinks: Link[] = [
        { id: 1, name: 'Google', link: 'http://www.google.com', color1: '#fc6c6b', color2: '#fbbc05' },
        { id: 2, name: 'YouTube', link: 'http://www.youtube.com', color1: '#ec444c', color2: '#f26e73' },
        { id: 3, name: 'Facebook', link: 'http://www.facebook.com', color1: '#4382ea', color2: '#29b4d3' },
        { id: 4, name: 'Instagram', link: 'http://www.instagram.com', color1: '#4285f4', color2: '#ea4335' },
      ];
      localStorage.setItem('data', JSON.stringify(defaultLinks));
      storedLinks = JSON.stringify(defaultLinks);
    }
    setLinks(JSON.parse(storedLinks));

    let storedUserName = localStorage.getItem('username');
    if (!storedUserName) {
      storedUserName = prompt('Enter your name: ');
      localStorage.setItem('username', storedUserName!);
    }
    setUserName(storedUserName!);
  };

  const checkUpdate = () => {
    const storedUpdates = JSON.parse(localStorage.getItem("updates")!);
    if (storedUpdates) {
      if (storedUpdates.version !== update.version) {
        setShowUpdateBox(true);
        localStorage.setItem("updates", JSON.stringify(update));
      }
    } else {
      setShowUpdateBox(true);
      localStorage.setItem("updates", JSON.stringify(update));
    }
  };

  const getTodos = () => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')!);
    if (storedTodos && storedTodos.length > 0) {
      setTodos(storedTodos);
    }
  };

  const addTodo = () => {
    const todo = prompt("Enter the todo: ");
    if (todo) {
      const newTodo: Todo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 0,
        title: todo,
      };
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  };

  const delTodo = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const addComp = async () => {
    if (addName && addLink) {
      const id = Date.now();
      const newLink: Link = { id, name: addName, link: addLink, color1: '', color2: '' };
      const origin = (new URL(addLink)).origin;
      const faviconUrl = `https://services.keeweb.info/favicon/${origin}`;
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = faviconUrl;

      img.onload = async () => {
        try {
          const colors = colorThief.getPalette(img, 2);
          newLink.color1 = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
          newLink.color2 = `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`;
          const newLinks = links.filter(link => link.id !== id);
          newLinks.push(newLink);
          setLinks(newLinks);
          localStorage.setItem('data', JSON.stringify(newLinks));
          showToast('Updated Successfully')
        } catch (error) {
          console.error('Error getting colors from favicon:', error);
          // Fallback colors or handle error gracefully
        };
      }
      const newLinks = [...links, newLink];
      setLinks(newLinks);
      localStorage.setItem('data', JSON.stringify(newLinks));
      setAddName('');
      setAddLink('');
      setShowAddBox(false);
      showToast('Added Successfully');
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const openEditBox = (link: Link) => {
    setCurrentLink(link);
    setShowEditBox(true);
  };

  const updateLink = (id: number, newName: string, newLink: string, newColor1: string, newColor2: string) => {
    const updatedLinks = links.map(link =>
      link.id === id ? { ...link, name: newName, link: newLink, color1: newColor1, color2: newColor2 } : link
    );
    setLinks(updatedLinks);
    localStorage.setItem('data', JSON.stringify(updatedLinks));
    showToast('Link Updated Successfully');
    setShowEditBox(false);
    setCurrentLink(null);
  };

  const deleteLink = (id: number) => {
    const newLinks = links.filter(link => link.id !== id);
    setLinks(newLinks);
    localStorage.setItem('data', JSON.stringify(newLinks));
    showToast('Deleted Successfully');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2000);
  };

  return (
    <>
      <button className="btn" style={{ background: 'grey', position: 'fixed', top: '15px', right: '15px', zIndex: 3 }} onClick={toggleDeleteMode}>{deleteMode ? <TickCircle /> : <Trash />}</button>
      <button className="btn" style={{ background: 'grey', position: 'fixed', top: '15px', right: '155px', zIndex: 3 }} onClick={toggleEditMode}>{editMode ? <TickCircle /> : <Edit />}</button>
      <br />
      <br />
      <Welcome username={userName} />
      <Links links={links} setShowAddBox={setShowAddBox} deleteMode={deleteMode} deleteLink={deleteLink} openEditBox={openEditBox} editMode={editMode} />
      <Todos todos={todos} addTodo={addTodo} delTodo={delTodo} />
      <AddLink showAddBox={showAddBox} setShowAddBox={setShowAddBox} addName={addName} setAddName={setAddName} addLink={addLink} setAddLink={setAddLink} addComp={addComp} />
      {showEditBox && currentLink && (
        <EditLink
          showEditBox={showEditBox}
          setShowEditBox={setShowEditBox}
          currentLink={currentLink}
          updateLink={updateLink}
        />
      )}
      <UpdateBox showUpdateBox={showUpdateBox} setShowUpdateBox={setShowUpdateBox} update={update} />
      <Toast toastMessage={toastMessage} />
    </>
  );
};

export default App;
