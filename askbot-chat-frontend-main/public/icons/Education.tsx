import React from "react";

import s from "./Education.module.scss";
import {RichText} from "@/components/RichText/RichText";
import Image from "next/image";
import BigInfoBlock from "@/components/BigInfoBlock";
import BulletsList from "@/components/BulletsList";

type Props = {
  title: string;
  icon?: string;
  bullets?: string[];
  description?: string;
  price?: string;
};

const Education = ({ bullets, description, price, icon, title }: Props) => {
  return (
    <div className={s.root}>
      <div className={"flex gap-2 items-center"}>
        {!!icon && <Image src={icon} width={24} height={24}
                alt={`Необходимые документы ${title}`}
        />}
        <h5 className={"h35_style text-black"}>{title || ""}</h5>
      </div>
      {!!description && <RichText markdown={description } className={"mt-0"}/>}
      {!!price &&
        <BigInfoBlock title={"Стоимость"} value={price} isFrom={false} className={"sm:max-w-[320px]"} />
      }
      {!!bullets?.length &&
        <>
          <h6 className={"h35_style text-black"}>Необходимые документы</h6>
          <BulletsList array={bullets}/>
        </>
      }
    </div>
  );
};

export default Education;
