import React, { useEffect, useState, useContext, useCallback } from "react";
import avatarMap from "../../utils/avatar";
import { Button, Form, Input, Switch, Popup, Avatar, Space } from "antd-mobile";
import { SocketContext } from "../../context/socketContext";
import style from "./index.module.scss";
import connectWs from "../../utils/socket";
import { useNavigate } from "react-router-dom";
const uuid = require("uuid");
function Home() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { io, setIo } = useContext(SocketContext);
  const onSubmit = () => {
    //表单校验
    form.validateFields().then(async (r) => {
      const data = { ...form.getFieldsValue(), avatar };
      sessionStorage.setItem("userInfo", JSON.stringify(data));
      if (!io.current) {
        //进入别人房间 未连接socket
        const { connect } = connectWs();
        const _io: any = await connect();
        setIo(_io);
        //加入房间
        io.current.emit("join-room", data);
        navigate("/room");
      } else {
        //加入房间
        io.current.emit("join-room", data);
        navigate("/room");
      }
    });
  };
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isCreated, setCreated] = useState(false);
  const clickAvatar = (item: any) => {
    setAvatar(item);
    setVisible(false);
  };
  function copy(text: string) {
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.select();
    document.execCommand("Copy");
    document.body.removeChild(textarea);
  }
  const genId = useCallback(async () => {
    const roomId = uuid.v4();
    if (!io.current) {
      const { connect } = connectWs();
      const _io: any = await connect();
      setIo(_io);
      form.setFieldsValue({ roomId });
      copy(roomId);
    } else {
      form.setFieldsValue("");
      copy(roomId);
    }
  }, []);
  useEffect(() => {
    try {
      const userInfo = sessionStorage.getItem("userInfo");
      if (userInfo) {
        const { avatar, name, roomId } = JSON.parse(userInfo);
        setAvatar(avatar);
        form.setFieldsValue({ name });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className={style.home}>
      <Form requiredMarkStyle="text-required" form={form}>
        <Form.Item
          name="name"
          label="头像"
          layout="horizontal"
          className={style.avatarWrap}
        >
          <div
            className="avatarWrap"
            onClick={() => {
              setVisible(true);
            }}
          >
            <Avatar
              src={avatarMap[avatar]}
              style={{ "--size": "64px", "--border-radius": "32px" }}
            />
          </div>
        </Form.Item>
        <Form.Item name="name" label="昵称" rules={[{ required: true }]}>
          <Input placeholder="请输入宁的昵称" />
        </Form.Item>
        <Form.Item
          name="isCreated"
          label="创建房间"
          childElementPosition="right"
          layout="horizontal"
        >
          <Switch
            onChange={(val: boolean) => {
              setCreated(val);
              if (val) {
                //创建房间
                genId();
              } else {
                // 加入别人的房间
                form.setFieldsValue({ roomId: "" });
              }
            }}
          />
        </Form.Item>
        <Form.Item
          name="roomId"
          label="房间号"
          help="不填写房间号默认进入公共聊天区"
          extra={
            isCreated ? (
              <Button size="small" color="primary" onClick={()=>{ copy(form.getFieldValue('roomId')) }}>
                复制
              </Button>
            ) : null
          }
        >
          <Input readOnly={isCreated} placeholder="请输入房间号" />
        </Form.Item>
        <Button block color="primary" onClick={onSubmit} size="large">
          进入群聊
        </Button>
      </Form>
      <Popup
        visible={visible}
        bodyStyle={{
          padding: "20px 10px",
        }}
        onMaskClick={() => {
          setVisible(false);
        }}
      >
        <Space block wrap>
          {Object.keys(avatarMap).map((item) => {
            return (
              <div
                key={item}
                onClick={() => {
                  clickAvatar(item);
                }}
              >
                <Avatar
                  src={avatarMap[item]}
                  style={{ "--size": "64px", "--border-radius": "32px" }}
                />
              </div>
            );
          })}
        </Space>
      </Popup>
    </div>
  );
}

export default Home;
