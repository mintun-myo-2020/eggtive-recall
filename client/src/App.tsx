import {
  HtmlHTMLAttributes,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import CardContainer from "./components/CardContainer";
import Navbar from "./components/Navbar";
import axios from "axios";
import { ICardData } from "./interfaces/interfaces";

const cardURL: string = "http://localhost:8080/card/";

function App() {
  const [cards, setCards] = useState<ICardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(cardURL)
      .then((res) => {
        console.log(res.data);
        if (res.data === null) {
          setIsEmpty(true);
          setCards(new Array<ICardData>());
        } else {
          setCards(res.data);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cards.length !== 0) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [cards]);

  if (isLoading) {
    return (
      <div className="App">
        <Navbar cards={cards}/>
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <p className="text-lg text-gray-500 ">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App ">
      <Navbar cards={cards}/>
      <div className="overflow-x-auto">
      <CardContainer cards={cards} setCards={setCards} isEmpty={isEmpty} />

      </div>
    </div>
  );
}

export default App;
