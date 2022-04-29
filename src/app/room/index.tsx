import React, { useEffect, useState } from "react";
import { TextArea, Button } from "antd-mobile";
import connectWs from "../../utils/socket";
import style from "./index.module.scss";
import sendIcon from "../../assets/icon/send.png";
import avatarMap from "../../utils/avatar";
const { connect, io } = connectWs();
function Room() {
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<any[]>([]);
  const [cast, setCast] = useState<any>({});
  const send = () => {
    if (!value.trim()) return;
    io.emit("chat", {
      message: value,
      id: localStorage.getItem("id"),
      avatar: "zeni",
      name: "izumi",
    });
    setMsg([
      ...msg,
      {
        message: value,
        id: localStorage.getItem("id"),
        avatar: "zeni",
        name: "izumi",
        self: true,
      },
    ]);
    setValue("");
  };
  useEffect(() => {
    connect();
    io.on("cast", (arg) => {
      setCast(arg);
    });
  }, []);
  useEffect(() => {
    if (Object.keys(cast).length) {
      setMsg([...msg, cast]);
    }
  }, [cast]);
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
      <ul className={style.messageContent}>
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
