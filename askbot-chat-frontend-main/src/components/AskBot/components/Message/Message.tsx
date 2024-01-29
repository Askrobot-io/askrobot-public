import React, {FC, useState, useEffect} from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import s from "./Message.module.scss";
import Image from "next/image";
import cn from "classnames";
import {STATUS} from "../../AskBot";
import LinkParser from "react-link-parser";
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import {
    NEW_API_ENDPOINT,
    CLIENT_ID,
    TOKEN,
} from "../../config";

type Props = {
  isMine: boolean;
  text: string;
  time: string;
  botStatus?: STATUS;
}

  const watchers = [
    {
      watchFor: "link",
      render: (text: string) => <a target={"_blank"} rel="nofollow noindex noopener noreferrer" href={text}>{text}</a>,
    }, {
      watchFor: "email",
      render: (url: string) => (
        <a href={`mailto:${url}`} target="_blank" rel="nofollow noindex noopener noreferrer">
          {url.replace("@", "[at]")}
        </a>
      ),
    },
  ];

const raitingTextHash = {
  1: "Poor: a low level of quality",
  2: "Below Average: while there may be some positive aspects, overall, the quality is lacking compared to the norm",
  3: "Average: a moderate level of quality that meets basic requirements but may not stand out or exceed expectations",
  4: "Above Average: a higher-than-average level of quality",
  5: "Excellent: the highest level of quality",
}

export const Message: FC<Props> = ({ isMine, text, question, markdown, time, botStatus = STATUS.INITIAL }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const sendFeedback = async () => {
      try {
        const res = await axios.post(NEW_API_ENDPOINT, {
          question,
          rating,
          api: true,
          engine: 'event',
          client: CLIENT_ID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
          }
        });
        console.log("success??", res);
      } catch (error: any) {
        console.log(error)
      }
    };

    if ( rating > 0 ) {
      sendFeedback();
    }
  }, [question, markdown, rating]);

  let raitingText = null;
  if ( hoveredRating != null && hoveredRating > 0 && raitingTextHash[ hoveredRating ] != null ) {
    raitingText = raitingTextHash[ hoveredRating ];
  } else if ( rating != null && rating > 0 && raitingTextHash[ rating ] != null ) {
    raitingText = raitingTextHash[ rating ];
  }

  return (
    <div className={cn(s.root, isMine ? "flex" : "flex-row-reverse", isMine ? s.messageRight : s.messageLeft)}>
      {botStatus === STATUS.SENDING &&
        <div className={s.messageRoot}>
          <div className={s.ldsEllipsis}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      }
      {botStatus === STATUS.ERROR &&
        <div className={s.messageRoot}>
          <div>
            <Image src={"/icons/importantToKnow.svg"} width={16} height={16}
                    alt={"Иконка ошибки"}
            />
            <p className={s.text}>
              Упс! Что-то пошло не так, попробуйте задать вопрос позже
            </p>
          </div>
        </div>
      }
      {botStatus === STATUS.INITIAL &&
        <div className={s.messageRoot}>
          <div className={s.text}>
            {
              markdown != null && markdown.trim() != ""
              ? <ReactMarkdown parserOptions={{ commonmark: true }} children={markdown.replace(/\n/gi, '\n\n')}></ReactMarkdown>
              : text
            }
          </div>
          {markdown != null && markdown.trim() != "" &&
            <div className={s.rating}>
              Please rate the answer:
              <Rating
                style={{ maxWidth: 180 }}
                value={rating}
                onChange={setRating}
                onHoverChange={setHoveredRating}
              />
              {raitingText != null && raitingText}
            </div>
          }
          <p className={s.time}>
            {time}
          </p>
        </div>
      }
      <Image src={isMine ? "/icons/userAvatar.svg" : "/icons/botAvatar.svg"} width={36} height={36}
             alt={`Аватарка`}
      />
    </div>
  )
}
