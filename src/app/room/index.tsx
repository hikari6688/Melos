import React, { useEffect, useState, useRef, useContext } from "react";
import { TextArea, Button } from "antd-mobile";
import style from "./index.module.scss";
import sendIcon from "../../assets/icon/send.png";
import avatarMap from "../../utils/avatar";
import { SocketContext } from "../../context/socketContext";
function Room() {
  const { io } = useContext(SocketContext);
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<any[]>([]);
  const [cast, setCast] = useState<any>({});
  const send = () => {
    if (!value.trim()) return;
    io.current.emit("chat", {
      message: value,
      id: sessionStorage.getItem("id"),
      avatar: "zeni",
      name: "izumi",
    });
    setMsg([
      ...msg,
      {
        message: value,
        id: sessionStorage.getItem("id"),
        avatar: "zeni",
        name: "izumi",
        self: true,
      },
    ]);
    setValue("");
  };
  useEffect(() => {
    io.current.on("user-join", (arg: any) => {
      console.log(arg);
    });
  }, []);
  useEffect(() => {
    if (Object.keys(cast).length) {
      setMsg([...msg, cast]);
    }
  }, [cast]);
  useEffect(() => {
    const el = document.querySelector(".toEnd") as Element;
    const h: number = el.clientHeight;
    el.scrollTop = h;
  }, [msg]);
  const Self = (prop: any) => {
    const { item } = prop;
    return (
      <li className={`${style.box} ${style.self}`}>
        <div className={`${style.message}`}>
          <p>{item.message}</p>
        </div>
        <div className={style.avatar}>
          <img src={avatarMap[item.avatar]} alt="" />
          <i> {item.name}</i>
        </div>
      </li>
    );
  };
  const Other = (prop: any) => {
    const { item } = prop;
    return (
      <li className={`${style.box} ${style.other}`}>
        <div className={style.avatar}>
          <img src={avatarMap[item.avatar]} alt="" />
          <i> {item.name}</i>
        </div>
        <div className={`${style.message}`}>
          <p>{item.message}</p>
        </div>
      </li>
    );
  };
  return (
    <div className={style.room}>
      <ul className={`${style.messageContent} toEnd`}>
        {msg.map((item: any, index: number) => {
          if (item.self) {
            return <Self item={item} key={index} />;
          }
          return <Other item={item} key={index} />;
        })}
      </ul>
      <div className={style.handelWrap}>
        <TextArea
          rows={1}
          autoSize={{ minRows: 1, maxRows: 3 }}
          value={value}
          onChange={(val) => {
            setValue(val);
          }}
        />
        <Button size="small" color="primary" onClick={send}>
          <img className={style.sendIcon} src={sendIcon} alt="" />
        </Button>
      </div>
    </div>
  );
}

export default Room;
