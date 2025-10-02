import { Button, Card, Divider, Modal, Switch } from "antd";
import React, { useRef, useState } from "react";



import { ApiOutlined, CloseOutlined, LinkOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import Draggable from "react-draggable";
import DraggableModal from "@/ui/AntdDraggableModal";
import "./index.less"
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
        placement: 'start',
        avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
        typing: { step: 5, interval: 20 },
        style: {
            maxWidth: 600,
        },
    },
    local: {
        placement: 'end',
        avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
    },
};

let mockSuccess = false;

const AiChat = (props: any) => {

    const { isAIModalVisible, setAIModalVisible } = props;
    const [content, setContent] = React.useState('');




    // Agent for request
    const [agent] = useXAgent<string, { message: string }, string>({
        request: async ({ message }, { onSuccess, onError }) => {
            await sleep();
            mockSuccess = !mockSuccess;
            if (mockSuccess) {
                onSuccess([`Mock success return. You said: ${message}`]);
            }

            onError(new Error('Mock request failed'));
        },
    });

    // Chat messages
    const { onRequest, messages } = useXChat({
        agent,
        requestPlaceholder: 'Waiting...',
        requestFallback: 'Mock failed return. Please try again later.',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');

    const iconStyle = {
        fontSize: 18,
    };

    React.useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                setLoading(false);
                setValue('');
                console.log('Send message successfully!');
            }, 2000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [loading]);
    return (
        <DraggableModal
            visible={isAIModalVisible}
            onClose={() => setAIModalVisible(false)}
            title="GeoAI 助手"
            bounds=""
            bodyStyle={{
                height: "100%", width: "100%"
            }}
        >
            <iframe
                src="http://localhost/chatbot/6r3oR8RIjtEN5ItW"
                style={{ height: 500, width: 400 }}
                frameBorder={0}
                allow="microphone">
            </iframe>
        </DraggableModal >
    )

};

export default AiChat;