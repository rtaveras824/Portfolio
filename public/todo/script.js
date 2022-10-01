import React, {
  useRef,
  useState,
  useEffect,
  useContext
} from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

console.log('react');

const database = [
  {
    id: 1000,
    color: "blue",
    message: "Call mechanic",
    desc: "Repair oil pan\nAdd transmission additive",
    initialY: 0,
    currentY: 0,
    offsetY: 0,
    initialX: 0,
    currentX: 0,
    offsetX: 0,
    zIndex: 0
  },
  {
    id: 1001,
    color: "red",
    message: "Finish react project",
    desc: "Add descriptions\nStyle components",
    initialY: 0,
    currentY: 0,
    offsetY: 0,
    initialX: 0,
    currentX: 0,
    offsetX: 0,
    zIndex: 0
  },
  {
    id: 1002,
    color: "purple",
    message:
      "This is a really long important task that needs to be completed in the order specified otherwise the world could become obliterated",
    desc: "Floss\nBrush teeth\nRinse with mouthwash",
    initialY: 0,
    currentY: 0,
    offsetY: 0,
    initialX: 0,
    currentX: 0,
    offsetX: 0,
    zIndex: 0
  },
  {
    id: 1003,
    color: "purple",
    message:
      "This is a really long important task that needs to be completed in the order specified otherwise the world could become obliterated adsjfias odfjaois fjaoi jewoif jawoeif jaowef jaoweiuf jawoeu fojaowei fjaowei fjaowe fjaowiue jfoieuwj foie jfoaesw jfoaeisj foaesij foisj foaisj foai ",
    desc: "Floss\nBrush teeth\nRinse with mouthwash",
    initialY: 0,
    currentY: 0,
    offsetY: 0,
    initialX: 0,
    currentX: 0,
    offsetX: 0,
    zIndex: 0
  }
];

const DragContext = React.createContext(null);

const Draggable = ({ index, message, currentY, currentX, zIndex }) => {
  const dragRef = useRef();

  useEffect(() => {
    dragRef.current.style.transform =
      "translate3d(" + currentX + "px, " + currentY + "px, 0)";
    dragRef.current.style.zIndex = zIndex;
  }, [currentY, zIndex]);

  return (
    <div className="draggable" ref={dragRef}>
      <div className="content">{message}</div>
      <div className={`drag-button ${index}`}></div>
    </div>
  );
};

const Container = () => {
  const [draggables, setDraggables] = useState([]);
  const [active, setActive] = useState(false);
  let positionRef = useRef(null);
  const draggableRef = useRef([]);
  let yPosRef = useRef([]);

  useEffect(() => {
    setDraggables(database);
    yPosRef.current = new Array(database.length).fill(0);
  }, []);

  useEffect(() => {
    let yPos = [];
    if (yPosRef.current.length > 0 && draggableRef.current.length > 0) {
      yPos = yPosRef.current.map((el, index) => {
        return draggableRef.current[index].getBoundingClientRect().y;
      });
      yPosRef.current = yPos;
    }
  }, [draggables]);

  const handleMouseDown = (e) => {
    let clientY = e.type == "mousedown" ? e.clientY : e.touches[0].clientY;
    let clientX = e.type == "mousedown" ? e.clientX : e.touches[0].clientX;
    let targetBtn = e.target.className.split(" ")[0];

    if (targetBtn == "drag-button") {
      positionRef.current = e.target.className.split(" ")[1];

      setDraggables(
        draggables.map((obj, index) => {
          if (index == positionRef.current) {
            return {
              ...obj,
              initialY: clientY - obj.offsetY,
              initialX: clientX - obj.offsetX,
              zIndex: 100
            };
          } else {
            return obj;
          }
        })
      );
      setActive(true);
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    let clientY = e.type == "mousemove" ? e.clientY : e.touches[0].clientY;
    let clientX = e.type == "mousemove" ? e.clientX : e.touches[0].clientX;

    if (active) {
      setDraggables(
        draggables.map((obj, index) => {
          if (index == positionRef.current) {
            return {
              ...obj,
              currentY: clientY - obj.initialY,
              offsetY: clientY - obj.initialY,
              currentX: clientX - obj.initialX,
              offsetX: clientX - obj.initialX
            };
          } else {
            return obj;
          }
        })
      );
    }
  };

  const handleMouseUp = (e) => {
    let clientY = e.type == "mouseup" ? e.clientY : e.changedTouches[0].clientY;
    let clientX = e.type == "mouseup" ? e.clientX : e.changedTouches[0].clientX;
    setActive(false);
    const newArray = draggables.map((obj) => obj);
    newArray[positionRef.current].zIndex = 1;
    let newPosition = positionRef.current;
    for (let i = 0; i < draggables.length; i++) {
      console.log("loop: " + yPosRef.current[i]);
      if (clientY > yPosRef.current[i]) newPosition = i;
    }
    newArray[positionRef.current].offsetY = newArray[
      positionRef.current
    ].currentY = 0;
    newArray[positionRef.current].offsetX = newArray[
      positionRef.current
    ].currentX = 0;
    newArray.splice(positionRef.current, 1);
    newArray.splice(newPosition, 0, draggables[positionRef.current]);
    positionRef.current = null;
    setDraggables(newArray);
  };

  return (
    <div
      className="container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {draggables.map((el, index) => (
        <div
          className={`draggable-container ${index}`}
          ref={(el) => (draggableRef.current[index] = el)}
        >
          <Draggable
            index={index}
            message={el.message}
            currentY={el.currentY}
            currentX={el.currentX}
            offsetY={el.offsetY}
            zIndex={el.zIndex}
          />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [list, setList] = useState([]);

  return (
    <DragContext.Provider value={list}>
      <Container />
    </DragContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
