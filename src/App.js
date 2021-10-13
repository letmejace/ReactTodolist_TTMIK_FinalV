import React, { useState, useEffect } from "react";
import List from "./components/List";
import Alert from "./components/Alert";

// localStorage에 저장
const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [show, setShow] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //알림 보이기
      showAlert(true, "danger", "please enter value");
    } else if (name && isEditing) {
      // 수정하기
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "item added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  // 알림
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  // 모든 목록 Clear
  const clearList = () => {
    showAlert(true, "danger", "empty list");
    setList([]);
  };

  // 해당 목록 삭제
  const removeItem = (id) => {
    showAlert(true, "danger", "item removed");
    setList(list.filter((item) => item.id !== id));
  };

  // 수정
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  // localStorage 저장
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      {/*toggle 목록 숨기기/보이기 */}
      <button className="show-btn" onClick={() => setShow(true)}>
        Show
      </button>
      <button className="show-btn" onClick={() => setShow(false)}>
        Hide
      </button>

      <form className="grocery-form" onSubmit={handleSubmit}>
        <h3>Todo List</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="Add Todo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {/* isEditing이 true라면 edit false라면 submit */}
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          {/* List 가져오기 */}
          {show ? (
            <List items={list} removeItem={removeItem} editItem={editItem} />
          ) : null}
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
