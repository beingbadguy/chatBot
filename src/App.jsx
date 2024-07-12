import { useEffect, useState } from "react";
import axios from "axios";
import { CiDark, CiLight } from "react-icons/ci";
import { Triangle } from "react-loader-spinner";

function App() {
  const [answer, setAnswer] = useState("Ask me anything...");
  const [loader, setLoader] = useState(false);
  const [question, setQuestion] = useState("");
  const [dark, setDark] = useState(false);
  const [text, setText] = useState([]);
  const [index, setIndex] = useState(0);

  const apiUrl =
    process.env.REACT_APP_API_KEY || "AIzaSyC5pInfW-ZWvf8uqHrmAmqy93C6q9xug8o";

  const fetchData = async () => {
    setAnswer("");
    setText([]);
    setIndex(0);
    try {
      setLoader(true);
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiUrl}`,
        method: "POST",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });
      setAnswer(response.data.candidates[0].content.parts[0].text);
      setLoader(false);
      setQuestion("");
    } catch (err) {
      console.log(err.message);
      setLoader(false);
    }
  };

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode === "true") {
      setDark(true);
    } else {
      setDark(false);
    }
  }, []);

  useEffect(() => {
    if (answer) {
      const interval = setInterval(() => {
        setText((prev) => {
          if (index < answer.length) {
            setIndex(index + 1);
            return [...prev, answer[index]];
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 10);

      return () => clearInterval(interval);
    }
  }, [answer, index]);

  return (
    <div
      className={`${
        dark ? "bg-black text-white" : "bg-white text-black"
      } transition-all duration-500 flex items-center justify-center flex-col`}
    >
      <div
        className={` ${
          dark ? "bg-black text-white" : "bg-white text-black"
        } transition-all duration-500 flex items-center justify-between w-[100%] p-4`}
      >
        <p className="font-bold m-2">BOT-GPT</p>
        <p className="">
          {dark ? (
            <CiDark
              className="text-2xl font-bold  cursor-pointer"
              onClick={() => {
                setDark(!dark);
                localStorage.setItem("mode", !dark);
              }}
            />
          ) : (
            <CiLight
              className="text-2xl font-bold cursor-pointer"
              onClick={() => {
                setDark(!dark);
                localStorage.setItem("mode", !dark);
              }}
            />
          )}
        </p>
      </div>
      <div>
        {loader ? (
          <Triangle
            visible={true}
            height="80"
            width="80"
            color={dark ? "white" : "black"}
            ariaLabel="triangle-loading"
            className="mt-5"
          />
        ) : null}
      </div>
      <div
        className={`${
          dark ? "bg-black text-white" : "bg-white text-black"
        } transition-all duration-500 p-4 w-[90%] overflow-y mb-20`}
      >
        <pre
          className={`${
            dark ? "bg-black text-white" : "bg-white text-black"
          } transition-all duration-500 text-black p-4 w-[100%] text-wrap min-h-[66vh]`}
          id="answer"
        >
          {text.join("")}
        </pre>
      </div>
      <div
        className={` ${
          dark
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black"
        } transition-all duration-500 w-[100%] border-t-2 flex items-center justify-center gap-5 fixed bottom-0 p-4`}
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          cols={30}
          rows={2}
          className={` ${
            dark
              ? "bg-black text-white border-2"
              : "bg-white text-black border-black border-2 "
          } transition-all font-bold duration-500  p-2 outline-none bg-white text-black rounded`}
          placeholder="Enter your question here..."
        />
        <button
          onClick={fetchData}
          className={` ${
            dark
              ? "bg-black text-white"
              : "bg-white text-black border-black border-2 "
          } transition-all rounded min-h-[60px] duration-500  border-2  p-2 font-bold `}
        >
          Generate
        </button>
      </div>
    </div>
  );
}

export default App;
