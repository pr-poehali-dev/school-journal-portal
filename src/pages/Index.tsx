import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type UserRole = 'admin' | 'director' | 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  login?: string;
  password?: string;
}

interface School {
  id: string;
  name: string;
  address: string;
  director?: User;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: '', address: '' });

  const handleAdminLogin = () => {
    if (loginForm.login === '666' && loginForm.password === '1234') {
      setCurrentUser({
        id: 'admin-1',
        name: 'Администратор системы',
        role: 'admin'
      });
    } else {
      alert('Неверный логин или пароль администратора');
    }
  };

  const handleUserLogin = () => {
    const user = users.find(u => u.login === loginForm.login && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
    } else {
      alert('Пользователь не найден');
    }
  };

  const handleZverLogin = () => {
    alert('Интеграция с ЗверУслуги в разработке');
  };

  const addSchool = () => {
    if (newSchool.name && newSchool.address) {
      const school: School = {
        id: Date.now().toString(),
        name: newSchool.name,
        address: newSchool.address
      };
      setSchools([...schools, school]);
      setNewSchool({ name: '', address: '' });
      setShowAddSchool(false);
    }
  };

  const createDirector = (schoolId: string) => {
    const name = prompt('Введите имя директора:');
    const login = prompt('Введите логин директора:');
    const password = prompt('Введите пароль директора:');
    
    if (name && login && password) {
      const director: User = {
        id: Date.now().toString(),
        name,
        role: 'director',
        login,
        password
      };
      
      setUsers([...users, director]);
      setSchools(schools.map(s => s.id === schoolId ? { ...s, director } : s));
    }
  };

  const generateUserCredentials = () => {
    if (users.length === 0) {
      alert('Нет пользователей для печати');
      return;
    }

    const credentials = users
      .filter(u => u.login && u.password)
      .map(u => `${u.name} (${u.role}): Логин: ${u.login}, Пароль: ${u.password}`)
      .join('\n');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Логины и пароли пользователей</title></head>
          <body>
            <h1>Логины и пароли пользователей</h1>
            <pre>${credentials}</pre>
          </body>
        </html>
      `);
      printWindow.print();
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginForm({ login: '', password: '' });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="BookOpen" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900">
              Электронный журнал
            </h1>
            <p className="text-education-gray">
              Образовательный портал для школ
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Авторизация</CardTitle>
              <CardDescription>
                Выберите способ входа в систему
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleZverLogin}
                className="w-full bg-orange hover:bg-orange-600 text-white py-6 text-lg font-medium"
                size="lg"
              >
                <Icon name="PawPrint" size={20} className="mr-2" />
                Войти через ЗверУслуги
              </Button>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="login">Логин</Label>
                  <Input
                    id="login"
                    type="text"
                    value={loginForm.login}
                    onChange={(e) => setLoginForm({...loginForm, login: e.target.value})}
                    placeholder="Введите ваш логин"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="Введите пароль"
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleUserLogin}
                  className="w-full bg-primary hover:bg-primary-600 py-3"
                  variant="default"
                >
                  <Icon name="User" size={18} className="mr-2" />
                  Вход для пользователей
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="text-center">
                <p className="text-sm text-education-gray mb-2">
                  Администраторский вход
                </p>
                <Button
                  onClick={handleAdminLogin}
                  variant="link"
                  className="text-primary hover:text-primary-700 text-sm"
                >
                  Вход для администратора (логин: 666, пароль: 1234)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-education-light">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-primary-900">
                  Электронный журнал
                </h1>
                <p className="text-sm text-education-gray">
                  Образовательный портал
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                {currentUser.name}
              </Badge>
              <Button onClick={logout} variant="outline" size="sm">
                <Icon name="LogOut" size={16} className="mr-1" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary-900">
                Панель администратора
              </h2>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowAddSchool(true)}
                  className="bg-primary hover:bg-primary-600"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить школу
                </Button>
                <Button
                  onClick={generateUserCredentials}
                  variant="outline"
                >
                  <Icon name="Printer" size={16} className="mr-2" />
                  Печать логинов
                </Button>
              </div>
            </div>

            {showAddSchool && (
              <Card>
                <CardHeader>
                  <CardTitle>Добавить новую школу</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="schoolName">Название школы</Label>
                    <Input
                      id="schoolName"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      placeholder="МБОУ СОШ №1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schoolAddress">Адрес</Label>
                    <Input
                      id="schoolAddress"
                      value={newSchool.address}
                      onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                      placeholder="ул. Школьная, 1"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addSchool}>Добавить</Button>
                    <Button variant="outline" onClick={() => setShowAddSchool(false)}>
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <Card key={school.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="School" size={20} className="mr-2 text-primary" />
                      {school.name}
                    </CardTitle>
                    <CardDescription>{school.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {school.director ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Директор:</p>
                          <p className="text-sm text-education-gray">{school.director.name}</p>
                        </div>
                        <Badge variant="default">Назначен</Badge>
                      </div>
                    ) : (
                      <Button
                        onClick={() => createDirector(school.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Создать аккаунт директора
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {schools.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Icon name="School" size={48} className="mx-auto text-education-gray mb-4" />
                  <h3 className="text-lg font-medium text-primary-900 mb-2">
                    Школы не добавлены
                  </h3>
                  <p className="text-education-gray mb-4">
                    Добавьте первую школу для начала работы с системой
                  </p>
                  <Button
                    onClick={() => setShowAddSchool(true)}
                    className="bg-primary hover:bg-primary-600"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить школу
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentUser.role === 'director' && (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="mx-auto text-education-gray mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              Панель директора
            </h3>
            <p className="text-education-gray">
              Здесь будет функционал управления учителями, классами и учениками
            </p>
          </div>
        )}

        {currentUser.role === 'teacher' && (
          <div className="text-center py-12">
            <Icon name="BookOpen" size={48} className="mx-auto text-education-gray mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              Панель учителя
            </h3>
            <p className="text-education-gray">
              Здесь будет функционал ведения электронного журнала
            </p>
          </div>
        )}

        {currentUser.role === 'student' && (
          <div className="text-center py-12">
            <Icon name="GraduationCap" size={48} className="mx-auto text-education-gray mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              Панель ученика
            </h3>
            <p className="text-education-gray">
              Здесь будет функционал просмотра оценок и расписания
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;