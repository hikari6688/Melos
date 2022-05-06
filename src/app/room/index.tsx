import React, { useEffect, useState, useCallback, useContext } from "react";
import { TextArea, Button } from "antd-mobile";
import style from "./index.module.scss";
import sendIcon from "../../assets/icon/send.png";
import avatarMap from "../../utils/avatar";
import connectWs from "../../utils/socket";
import { SocketContext } from "../../context/socketContext";
import { text } from "stream/consumers";
function Room() {
  const { io, setIo } = useContext(SocketContext);
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<any[]>([]);
  const [cast, setCast] = useState<any>({});
  const [isFocus, setFocus] = useState<boolean>(false);
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
  const press = useCallback(
    (args: any) => {
      console.log(value);
      const { keyCode, ctrlKey } = args;
      console.log({ keyCode, ctrlKey, value, isFocus });
      if (ctrlKey && keyCode === 13 && value.trim() && isFocus) {
        //发送消息
        send();
      }
    },
    [isFocus, value]
  );
  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    if (!io.current && userInfo) {
      const { connect } = connectWs();
      connect().then((_io: any) => {
        _io.emit("join-room", JSON.parse(userInfo));
        _io.on("user-join", (arg: any) => {
          setCast(arg);
        });
        _io.on("user-leave", (arg: any) => {
          setCast(arg);
        });
        _io.on("cast", (arg: any) => {
          setCast(arg);
        });
        setIo(_io);
      });
    } else {
      io.current.on("user-join", (arg: any) => {
        setCast(arg);
      });
      io.current.on("user-leave", (arg: any) => {
        setCast(arg);
      });
      io.current.on("cast", (arg: any) => {
        setCast(arg);
      });
    }
    return () => {
      if (io.current && userInfo) {
        io.current.emit("leave-room", JSON.parse(userInfo));
      }
    };
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
  useEffect(() => {
    document.addEventListener("keydown", press);
    return () => {
      document.removeEventListener("keydown", press);
    };
  }, [value]);
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
    <div
      className={style.room}
      style={{
        height:
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
            ? `calc(100vh)`
            : "100vh",
      }}
    >
      <ul className={`${style.messageContent} toEnd`}>
        {msg.map((item: any, index: number) => {
          if (item.type === "enterTip") {
            return (
              <li className={style.tip} key={index}>
                {item.name}进入房间&nbsp;{item.time}
              </li>
            );
          }
          if (item.type === "leaveTip") {
            return (
              <li className={style.tip} key={index}>
                {item.name}离开房间&nbsp;{item.time}
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
          onBlur={() => {
            setFocus(false);
          }}
          onFocus={() => {
            setFocus(true);
          }}
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
