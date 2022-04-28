import React, { useEffect, useState } from "react";
import { TextArea, Button } from "antd-mobile";
import connectWs from "../../utils/socket";
import style from "./index.module.scss";
import sendIcon from "../../assets/icon/send.png";
const { connect, io } = connectWs();
function Home() {
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<any[]>([]);
  const send = () => {
    if (!value.trim()) return;
    io.emit("chat", {
      message: value,
      id: localStorage.getItem("id"),
      avatar: "cat",
      name: "izumi",
    });
    setValue("");
  };
  useEffect(() => {
    connect();
    io.on("cast", (arg) => {
      setMsg(msg.concat([arg]));
    });
  }, []);
  return (
    <div className={style.home}>
      <ul className={style.messageContent}>
        {msg.map((item: any, index: number) => {
          return (
            <li className={`${style.box} ${style.self}`} key={index}>
              <div className={`${style.message}`}>
                <p>{item.message}</p>
              </div>
              <div className={style.avatar}>
                <img src="" alt="" />
                <i> {item.name}</i>
              </div>
            </li>
          );
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

export default Home;
