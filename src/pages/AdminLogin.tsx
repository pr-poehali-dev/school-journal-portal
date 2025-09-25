import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleAdminLogin = () => {
    if (loginForm.login === '666' && loginForm.password === '1234') {
      // Сохраняем данные администратора в localStorage для использования на главной странице
      localStorage.setItem('currentUser', JSON.stringify({
        id: 'admin-1',
        name: 'Администратор системы',
        role: 'admin'
      }));
      navigate('/');
    } else {
      setError('Неверный логин или пароль администратора');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-900">
            Административный вход
          </h1>
          <p className="text-red-700">
            Доступ только для администраторов системы
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-red-900">Авторизация</CardTitle>
            <CardDescription>
              Введите данные администратора для входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="login">Логин администратора</Label>
                <Input
                  id="login"
                  type="text"
                  value={loginForm.login}
                  onChange={(e) => {
                    setLoginForm({...loginForm, login: e.target.value});
                    setError('');
                  }}
                  placeholder="Введите логин"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({...loginForm, password: e.target.value});
                    setError('');
                  }}
                  placeholder="Введите пароль"
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleAdminLogin}
                className="w-full bg-red-600 hover:bg-red-700 py-3"
                variant="default"
              >
                <Icon name="Shield" size={18} className="mr-2" />
                Войти как администратор
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => navigate('/')}
                variant="link"
                className="text-red-600 hover:text-red-700 text-sm"
              >
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Вернуться на главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;