import React, {FC} from "react";
import s from "./Message.module.scss";
import Image from "next/image";
import cn from "classnames";
import {STATUS} from "../../AskBot";
import LinkParser from "react-link-parser";

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

export const Message: FC<Props> = ({ isMine, text, time, botStatus = STATUS.INITIAL }) => {

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
          <p className={s.text}>
            {/*<Linkify component='a' properties={{target: "_blank", rel: "nofollow noindex noopener noreferrer" }}>{text}</Linkify>*/}
            <LinkParser watchers={watchers}>{text}</LinkParser>
          </p>
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
