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
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") as string);
    if (!value.trim()) return;
    io.current.emit("chat", {
      message: value,
      ...userInfo,
    });
    setMsg([
      ...msg,
      {
        message: value,
        ...userInfo,
        self: true,
      },
    ]);
    setValue("");
  };
  useEffect(() => {
    io.current.on("user-join", (arg: any) => {
      console.log(arg);
      setMsg([...msg, arg]);
    });
    io.current.on("cast", (arg: any) => {
      setCast(arg);
    });
  }, []);
  useEffect(() => {
    //收到消息
    if (Object.keys(cast).length) {
      setMsg([...msg, cast]);
    }
  }, [cast]);
  useEffect(() => {
    //收到消息滚动至底部
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
          if (item.type === "enterTip") {
            return (
              <li className={style.tip} key={index}>
                {item.name}进入房间&nbsp;{item.time}
              </li>
            );
          }
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
