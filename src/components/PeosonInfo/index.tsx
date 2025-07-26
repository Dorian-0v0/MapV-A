import React, { useState } from 'react';
import {
    Card,
    Avatar,
    Descriptions,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Divider,
    Space,
    Upload
} from 'antd';
import {
    EditOutlined,
    CameraOutlined,
    SaveOutlined,
    CloseOutlined,
    LockOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const PersonInfo = () => {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("https://ts1.tc.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0");

    // 模拟用户数据
    const [userInfo, setUserInfo] = useState({
        nickname: 'GISer',
        gender: '男',
        phone: '138****1234',
        bio: '前端开发工程师，热爱编程和设计',
        company: '地理信息部',
    });

    const handleEdit = () => {
        form.setFieldsValue(userInfo);
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSave = () => {
        form
            .validateFields()
            .then(values => {
                setUserInfo({ ...userInfo, ...values });
                setEditing(false);
                message.success('用户信息更新成功');
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handlePasswordSubmit = () => {
        passwordForm
            .validateFields()
            .then(values => {
                if (values.newPassword !== values.confirmPassword) {
                    message.error('两次输入的密码不一致');
                    return;
                }
                // 这里应该是调用修改密码的API
                console.log('修改密码:', values);
                message.success('密码修改成功');
                setPasswordModalVisible(false);
                passwordForm.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleAvatarChange = (info) => {
        if (info.file.status === 'done') {
            // 这里应该是上传到服务器后返回的URL
            const url = URL.createObjectURL(info.file.originFileObj);
            setAvatarUrl(url);
            message.success('头像上传成功');
        }
    };

    return (
        <Card
            title="用户信息"
            bordered={false}
            extra={
                !editing ? (
                    <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                        编辑信息
                    </Button>
                ) : (
                    <div>
                        <Button icon={<CloseOutlined />} onClick={handleCancel}>
                            取消
                        </Button>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                            保存
                        </Button>
                    </div>
                )
            }
        >
            <div style={{ display: 'flex', marginBottom: 24 }}>
                <div style={{ marginRight: 24 }}>
                    <Upload
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleAvatarChange}
                        disabled={!editing}
                    >
                        <div style={{ position: 'relative' }} className='avatarA'>
                            <img
                                src={avatarUrl}  // 直接使用 src 属性
                                alt="用户头像"    // 建议加上 alt 属性
                                style={{
                                    width: '128px',  // 设置宽度
                                    height: '128px', // 设置高度
                                    borderRadius: '50%', // 圆形头像
                                    objectFit: 'cover' // 防止图片变形
                                }}
                            />
                            {editing && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <CameraOutlined /> 更换
                                </div>
                            )}
                        </div>
                    </Upload>
                </div>

                {editing ? (
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ flex: 1 }}
                    >
                        <Form.Item
                            name="nickname"
                            label="昵称"
                            rules={[{ required: true, message: '请输入昵称' }]}
                        >
                            <Input placeholder="请输入昵称" />
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            label="性别"
                            rules={[{ required: true, message: '请选择性别' }]}
                        >
                            <Select placeholder="请选择性别">
                                <Option value="0">男</Option>
                                <Option value="1">女</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="company"
                            label="工作单位"
                        >
                            <Input placeholder="请输入工作单位" />
                        </Form.Item>
                        <Form.Item
                            name="bio"
                            label="个人简介"
                        >
                            <TextArea rows={3} placeholder="请输入个人简介" />
                        </Form.Item>
                    </Form>
                ) : (
                    <Descriptions column={1} style={{ flex: 1 }}>
                        <Descriptions.Item label="昵称">{userInfo.nickname}</Descriptions.Item>
                        <Descriptions.Item label="性别">
                            {userInfo.gender === '男' ? '男' : '女'}
                        </Descriptions.Item>
                        <Descriptions.Item label="账户">{userInfo.phone}</Descriptions.Item>
                        <Descriptions.Item label="工作单位">{userInfo.company}</Descriptions.Item>
                        <Descriptions.Item label="个人简介">{userInfo.bio}</Descriptions.Item>
                    </Descriptions>
                )}
            </div>

            <Divider />

            <div>
                <h3 style={{ marginBottom: 16 }}>账户安全</h3>
                <Button
                    type="primary"
                    icon={<LockOutlined />}
                    onClick={() => setPasswordModalVisible(true)}
                >
                    修改密码
                </Button>
                <Button
                    type="link"
                    style={{ marginLeft: 16 }}
                    onClick={() => message.info('已发送密码重置链接到您的邮箱')}
                >
                    忘记密码
                </Button>
            </div>

            <Modal
                title="修改密码"
                visible={passwordModalVisible}
                onOk={handlePasswordSubmit}
                onCancel={() => setPasswordModalVisible(false)}
                okText="确认修改"
                cancelText="取消"
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="oldPassword"
                        label="原密码"
                        rules={[{ required: true, message: '请输入原密码' }]}
                    >
                        <Input.Password placeholder="请输入原密码" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 6, message: '密码长度至少6位' }
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: '请再次输入新密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请再次输入新密码" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default PersonInfo;