import { UserOutlined } from '@ant-design/icons';
import { Avatar, List, Typography } from 'antd';
import { memo } from 'react';
const { Text } = Typography;

const groupMembers = [
  {
    id: 1,
    name: 'Alice',
    avatar: <Avatar icon={<UserOutlined />} />,
  },
  {
    id: 2,
    name: 'Bob',
    avatar: <Avatar>B</Avatar>,
  },
  {
    id: 3,
    name: 'Charlie',
    avatar: <Avatar style={{ backgroundColor: '#7265e6' }}>C</Avatar>,
  },
  {
    id: 4,
    name: 'You',
    avatar: <Avatar style={{ backgroundColor: '#f56a00' }}>Y</Avatar>,
  },
];

const ChatMembers = () => {
  return (
    <div className="p-4 border-l border-gray-700 bg-gray-800">
      <Text className="text-lg mb-4 block">Group Members</Text>
      <List
        dataSource={groupMembers}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta avatar={item.avatar} title={<Text>{item.name}</Text>} />
          </List.Item>
        )}
      />
    </div>
  );
};

const MemoizedChatMembers = memo(ChatMembers);

export default MemoizedChatMembers;
