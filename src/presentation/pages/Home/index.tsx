import ChatsList from '@presentation/dummies/chat/ChatsList';
import CreateChatForm from '@presentation/dummies/chat/CreateChat';
import EnterChatForm from '@presentation/dummies/chat/EnterChat';
import EnterChatModalAction from '@presentation/dummies/chat/EnterChat/EnterChatModalAction.tsx';
import CreateChatParamsManager from '@presentation/widget-controls/chat/CreateChatParamsManager.tsx';
import GetAllChatsSearchParamsManager from '@presentation/widget-controls/chat/GetAllChatsSearchParamsManager.tsx';
import CreateChatWidget from '@presentation/widgets/chat/CreateChatWidget.tsx';
import EnterChatWidget from '@presentation/widgets/chat/EnterChatWidget.tsx';
import GetAllChatsWidget from '@presentation/widgets/chat/GetAllChatsWidget.tsx';
import IsParticipantWidget from '@presentation/widgets/chat/IsParticipantWidget.tsx';
import { Button, Modal } from 'antd';
import { memo } from 'react';
import { VisibilityProvider, VisibilityTarget, VisibilityTrigger } from 'react-visibility-manager';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <GetAllChatsSearchParamsManager>
          <GetAllChatsWidget>
            <VisibilityProvider>
              {/* Секция со списком чатов */}
              <section className="mb-8">
                <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
                  <h2 className="text-2xl font-semibold text-white">Доступные чаты</h2>
                  <VisibilityTrigger triggerKey="createChat" propName="onClick">
                    <Button>Создать новый чат</Button>
                  </VisibilityTrigger>
                  <VisibilityTarget targetKey="createChat" isOpenPropName="open">
                    <VisibilityTrigger triggerKey="createChat" propName="onCancel">
                      <Modal
                        footer={null}
                        destroyOnHidden={true}
                        title="Создать новый чат"
                        centered={true}
                      >
                        <VisibilityTrigger triggerKey="createChat" propName="afterSuccess">
                          <CreateChatWidget>
                            <CreateChatForm />
                          </CreateChatWidget>
                        </VisibilityTrigger>
                      </Modal>
                    </VisibilityTrigger>
                  </VisibilityTarget>
                </div>

                <ChatsList
                  ActionSlot={({ chat }) => (
                    <IsParticipantWidget chatId={chat.id}>
                      <EnterChatModalAction chat={chat} className="mt-5 w-full" />
                    </IsParticipantWidget>
                  )}
                />
              </section>

              {/* Модальное окно для входа в чат */}
              <VisibilityTrigger triggerKey="enterChat" propName="onCancel">
                <VisibilityTarget targetKey="enterChat" isOpenPropName="open">
                  <Modal centered={true} footer={null} destroyOnHidden={true} title="Вход в чат">
                    <CreateChatParamsManager>
                      <VisibilityTrigger triggerKey="enterChat" propName="afterSuccess">
                        <EnterChatWidget>
                          <div className="my-6">
                            <EnterChatForm />
                          </div>
                        </EnterChatWidget>
                      </VisibilityTrigger>
                    </CreateChatParamsManager>
                  </Modal>
                </VisibilityTarget>
              </VisibilityTrigger>
            </VisibilityProvider>
          </GetAllChatsWidget>
        </GetAllChatsSearchParamsManager>
      </div>
    </main>
  );
};

const MemoizedHomePage = memo(HomePage);

export default MemoizedHomePage;
