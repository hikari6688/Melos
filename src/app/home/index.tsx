import React, { useEffect, useState } from "react";
import avatarMap from "../../utils/avatar";
import {
  TextArea,
  Button,
  Form,
  Input,
  Switch,
  Popup,
  Avatar,
  Space,
} from "antd-mobile";
import style from "./index.module.scss";
function Home() {
  const [form] = Form.useForm();
  const onSubmit = () => {
    const data = { ...form.getFieldsValue(), avatar };
    console.log(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState("");
  const clickAvatar = (item: any) => {
    setAvatar(item);
    setVisible(false);
  };
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const { avatar, name, roomId } = JSON.parse(userInfo);
        setAvatar(avatar);
        form.setFieldsValue({ name, roomId });
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
        {!form.getFieldValue('isnew') && (
          <Form.Item name="roomId" label="房间号" help="输入聊天室房间号">
            <Input placeholder="请输入房间号" />
          </Form.Item>
        )}
        <Form.Item
          name="isnew"
          label="创建房间"
          childElementPosition="right"
          layout="horizontal"
        >
          <Switch />
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
