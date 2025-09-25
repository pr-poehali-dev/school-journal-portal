import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ZverIntegration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Icon name="PawPrint" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-orange-900">
            ЗверУслуги
          </h1>
          <p className="text-xl text-orange-700">
            Интеграция с государственными услугами
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <div className="mb-4">
              <Icon name="Construction" size={48} className="mx-auto mb-2" />
            </div>
            <CardTitle className="text-2xl">Интеграция в разработке</CardTitle>
            <CardDescription className="text-orange-100">
              Мы усердно работаем над подключением сервиса ЗверУслуги
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">
                Что будет доступно очень скоро:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="UserCheck" size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Единый вход</h4>
                    <p className="text-sm text-orange-700">Авторизация через госуслуги</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="FileText" size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Документооборот</h4>
                    <p className="text-sm text-orange-700">Электронные справки и заявления</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Calendar" size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Запись на прием</h4>
                    <p className="text-sm text-orange-700">Онлайн-запись к администрации</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Bell" size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Уведомления</h4>
                    <p className="text-sm text-orange-700">Важные сообщения от школы</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="Clock" size={20} className="text-orange-600" />
                <h4 className="font-medium text-orange-900">Ожидаемые сроки</h4>
              </div>
              <p className="text-orange-700 mb-4">
                Интеграция с ЗверУслугами планируется к запуску в ближайшее время. 
                Мы проводим финальные тестирования системы безопасности и стабильности подключения.
              </p>
              <div className="flex items-center space-x-2 text-sm text-orange-600">
                <Icon name="Info" size={16} />
                <span>Следите за обновлениями на главной странице портала</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Вернуться на главную
              </Button>
              
              <Button
                onClick={() => window.open('https://gosuslugi.ru', '_blank')}
                variant="outline"
                className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Перейти на Госуслуги
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-orange-600">
            © 2024 Электронный журнал. Интеграция с государственными услугами
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZverIntegration;