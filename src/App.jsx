import { useEffect, useState } from "react";
import axios from "axios";
import Typewriter from "typewriter-effect";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { Triangle } from "react-loader-spinner";

function App() {
  const [answer, setAnswer] = useState("");
  const [loader, setLoader] = useState(false);
  const [question, setQuestion] = useState("");
  const [dark, setDark] = useState(false);

  const apiUrl = process.env.REACT_APP_API_KEY;

  const fetchData = async (e) => {
    setAnswer("");
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
    }
  };
  useEffect(() => {
    const what = localStorage.getItem("mode");
    if (what === "true") {
      setDark(true);
    } else {
      setDark(false);
    }
  }, []);

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
                localStorage.setItem("mode", false);
              }}
            />
          ) : (
            <CiLight
              className="text-2xl font-bold cursor-pointer"
              onClick={() => {
                setDark(!dark);
                localStorage.setItem("mode", true);
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
            wrapperStyle={{}}
            wrapperClass=""
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
          {answer}
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
          type="text"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
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
