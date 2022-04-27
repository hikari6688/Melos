import React, { useEffect, useState } from "react";
import { TextArea, Button } from "antd-mobile";
import connectWs from "../../utils/socket";
import style from "./index.module.scss";
import sendIcon from "../../assets/icon/send.png";
const { connect, io } = connectWs();
function Home() {
  const [value, setValue] = useState("");
  const send = () => {
    if (!value.trim()) return;
    io.emit("chat", { data: value });
  };
  useEffect(() => {
    connect();
  }, []);
  return (
    <div className={style.home}>
      <ul className={style.messageContent}>
        <li className={`${style.box} ${style.other}`}>
          <div className={style.avatar}>
            <img src="" alt="" />
          </div>
          <div className={`${style.message}`}>
            <p>
              梵蒂冈地方官梵蒂冈dsfsdf士大夫士大夫梵蒂冈豆腐干豆腐干豆腐干豆腐干地方豆腐干反对
            </p>
          </div>
        </li>
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
