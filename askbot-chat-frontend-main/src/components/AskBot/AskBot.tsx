import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import s from "./AskBot.module.scss";
import Image from "next/image";
import cn from "classnames";
import {Message} from "./components/Message/Message";
import {getCurrentTime} from "@/app/utils";
import {useWindowDimensions} from "@/app/hooks/useWindowDimensions";
import {
    NEW_API_ENDPOINT,
    CLIENT_ID,
    TOKEN,
} from "./config";

export enum STATUS {
  INITIAL,
  SENDING,
  SUCCESS,
  ERROR,
}

type TMessage = {
  text: string;
  time: string;
  isMine: boolean;
}

type Props = {
  country: string;
  className?: string;
}

function AskBot({ country, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<STATUS>();

  const [isOpen, setIsOpen] = useState(false);
  const [isInitiallyOpen, setIsInitiallyOpen] = useState(false);

  const [messages, setMessages] = useState<TMessage[]>([])

  const { width } = useWindowDimensions();

  const allowSending = question.length > 1 || status === STATUS.SENDING;

  const handleChangeQuestion: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (status === STATUS.SENDING) return;
    setQuestion(e.target.value)
  };

  const handleSend = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!allowSending) return;
    setStatus(STATUS.SENDING);
    setIsInitiallyOpen(true);
    setIsOpen(true);
    setMessages([...messages, { text: question, isMine: true, time: getCurrentTime() }])
  };

  useEffect(() => {
    let subscribed = true;
    const sendFeedback = async () => {
      try {
        console.log("Send");
        const res = await axios.post(NEW_API_ENDPOINT, {
          question,
          api: true,
          engine: 'answer',
          client: CLIENT_ID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
          }
        });
        console.log("success??", res, subscribed);
        if (!res || !subscribed) return;
        console.log(res)
        const {
          data: { answer, links },
          status,
        } = res?.data ?? { data: {} };
        console.log(answer, status);
        // setMessages([...messages, { text: replaceLinks(answer, links), isMine: false, time: getCurrentTime() }])
        // setMessages([...messages, { text: removeNumbersAndParentheses(answer), isMine: false, time: getCurrentTime() }])
        setMessages([...messages, { text: answer, isMine: false, time: getCurrentTime() }])
        setQuestion("")
        if (status) {
          setStatus(STATUS.SUCCESS);
        }
      } catch (error: any) {
        console.log(error)
        setStatus(STATUS.ERROR);
        console.error("Error sending feedback", error);
      }
    };

    if (status === STATUS.SENDING) {
      sendFeedback();
    }
    return () => {
      subscribed = false;
    };
  }, [status, country, question]);

  useEffect(() => {
    if (rootRef.current && messages.length < 2) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (chatContainerRef.current && messages.length > 2) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!width) return null;
  return (
    <div className={cn(s.root, className)} ref={rootRef}>
      <div className={cn(s.chatRoot, isOpen ? s.chatRootOpened : "", width < 550 ? "px-5" : "px-8")} ref={chatContainerRef}>
        {isOpen &&
          <>
            {messages.map(item => {
              return (
                <Message key={item.time + item.text} isMine={item.isMine} text={item.text} time={item.time} />
              )
            })}
            {(status == STATUS.SENDING || status == STATUS.ERROR) && <Message isMine={false} text={""} time={""} botStatus={status} /> }
          </>
          }
      </div>
      <form action="" className={s.wrapper} onSubmit={handleSend}
            autoComplete="off">
        <input
          autoComplete="off"
          type="question"
          className={cn(s.input, width < 550 ? "pl-5 pr-10" : "pl-8 pr-16")}
          name="question"
          value={question}
          onSubmit={handleSend}
          onChange={handleChangeQuestion}
          placeholder={width < 550 ? "Задайте ваш вопрос" : "Привет. Я AskRobot. Задайте интересующий вас вопрос"}
        />
        <button onClick={handleSend} className={cn(s.send, width < 550 ? "right-[20px]" : "right-[32px]")}>
          <Image src={"/icons/arrow-up-right.svg"} width={24} height={24}
                 alt={`Изображение стрелки вправо`}
                 className={s.arrow}
          />
        </button>
      </form>
      <div className={cn(s.disclaimerRoot, width < 550 ? "px-5" : "px-8")}>
          <Image src={"/icons/askLogoXS.svg"} width={16} height={16}
                 alt={`Логотип askrobot.io`}
                 className={"opacity-50"}
          />
          <p className={s.disclaimer}>Бот работает на основе сервиса askrobot.io. История чата не сохраняется</p>
      </div>
      {isInitiallyOpen &&
        <div className={s.openCloseRoot} onClick={() => setIsOpen(!isOpen)}>
          <svg className={cn(s.chevron, isOpen ? "-rotate-90" : "rotate-90")} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 185.343 185.343">
            <g>
              <g>
                <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175
                  l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
                  c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"/>
              </g>
            </g>
          </svg>
          <p className={s.openCloseText}>{isOpen ? "Свернуть" : "Развернуть"}</p>
        </div>
      }
    </div>
  );
}

export default AskBot;
