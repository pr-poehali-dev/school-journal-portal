import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type UserRole = 'admin' | 'director' | 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  login?: string;
  password?: string;
  schoolId?: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  login: string;
  password: string;
  schoolId: string;
}

interface Class {
  id: string;
  name: string;
  grade: number;
  schoolId: string;
  teacherId?: string;  // классный руководитель
}

interface Student {
  id: string;
  name: string;
  classId: string;
  schoolId: string;
}

interface Grade {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  grade: number;
  date: string;
  classId: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  schoolId: string;
  date: string;
}

interface School {
  id: string;
  name: string;
  address: string;
  director?: User;
}

const Index = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: '', address: '' });
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [selectedClass, setSelectedClass] = useState<string>('');

  // Функции для работы с localStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const loadFromStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  // Загружаем данные при загрузке компонента
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Загружаем все сохраненные данные
    setSchools(loadFromStorage('schools'));
    setUsers(loadFromStorage('users'));
    setTeachers(loadFromStorage('teachers'));
    setClasses(loadFromStorage('classes'));
    setStudents(loadFromStorage('students'));
    setGrades(loadFromStorage('grades'));
    setPosts(loadFromStorage('posts'));
  }, []);

  // Сохраняем данные при изменении
  useEffect(() => {
    saveToStorage('schools', schools);
  }, [schools]);

  useEffect(() => {
    saveToStorage('users', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('teachers', teachers);
  }, [teachers]);

  useEffect(() => {
    saveToStorage('classes', classes);
  }, [classes]);

  useEffect(() => {
    saveToStorage('students', students);
  }, [students]);

  useEffect(() => {
    saveToStorage('grades', grades);
  }, [grades]);

  useEffect(() => {
    saveToStorage('posts', posts);
  }, [posts]);

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  const handleUserLogin = () => {
    const user = users.find(u => u.login === loginForm.login && u.password === loginForm.password);
    const teacher = teachers.find(t => t.login === loginForm.login && t.password === loginForm.password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else if (teacher) {
      const teacherUser: User = {
        id: teacher.id,
        name: teacher.name,
        role: 'teacher',
        login: teacher.login,
        password: teacher.password,
        schoolId: teacher.schoolId
      };
      setCurrentUser(teacherUser);
      localStorage.setItem('currentUser', JSON.stringify(teacherUser));
    } else {
      alert('Пользователь не найден');
    }
  };

  const handleZverLogin = () => {
    navigate('/zver-integration');
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
        password,
        schoolId
      };
      
      setUsers([...users, director]);
      setSchools(schools.map(s => s.id === schoolId ? { ...s, director } : s));
    }
  };

  const generateUserCredentials = () => {
    const allUsers = [
      ...users.filter(u => u.login && u.password),
      ...teachers.map(t => ({ name: t.name, role: 'teacher', login: t.login, password: t.password }))
    ];
    
    if (allUsers.length === 0) {
      alert('Нет пользователей для печати');
      return;
    }

    const credentials = allUsers
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
    localStorage.removeItem('currentUser');
    setLoginForm({ login: '', password: '' });
  };

  // Функции для панели директора
  const addTeacher = (schoolId: string) => {
    const name = prompt('Введите имя учителя:');
    const subject = prompt('Введите предмет:');
    const login = prompt('Введите логин:');
    const password = prompt('Введите пароль:');
    
    if (name && subject && login && password) {
      const teacher: Teacher = {
        id: Date.now().toString(),
        name,
        subject,
        login,
        password,
        schoolId
      };
      setTeachers([...teachers, teacher]);
    }
  };

  const addClass = (schoolId: string) => {
    const name = prompt('Введите название класса (например: 5А):');
    const gradeStr = prompt('Введите номер класса (1-11):');
    const grade = parseInt(gradeStr || '1');
    
    if (name && !isNaN(grade) && grade >= 1 && grade <= 11) {
      const newClass: Class = {
        id: Date.now().toString(),
        name,
        grade,
        schoolId
      };
      setClasses([...classes, newClass]);
    }
  };

  const addStudent = (classId: string, schoolId: string) => {
    const name = prompt('Введите имя и фамилию ученика:');
    
    if (name) {
      const student: Student = {
        id: Date.now().toString(),
        name,
        classId,
        schoolId
      };
      setStudents([...students, student]);
    }
  };

  const assignClassTeacher = (classId: string, teacherId: string) => {
    setClasses(classes.map(c => 
      c.id === classId ? { ...c, teacherId } : c
    ));
  };

  const addPost = () => {
    if (newPost.title && newPost.content && currentUser) {
      const post: Post = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        authorId: currentUser.id,
        authorName: currentUser.name,
        schoolId: currentUser.schoolId!,
        date: new Date().toLocaleDateString('ru-RU')
      };
      setPosts([...posts, post]);
      setNewPost({ title: '', content: '' });
      setShowAddPost(false);
    }
  };

  const updateGrade = (studentId: string, subject: string, newGrade: number, classId: string) => {
    if (!currentUser) return;
    
    const gradeId = `${studentId}-${subject}-${Date.now()}`;
    const grade: Grade = {
      id: gradeId,
      studentId,
      teacherId: currentUser.id,
      subject,
      grade: newGrade,
      date: new Date().toISOString().split('T')[0],
      classId
    };
    
    setGrades([...grades, grade]);
  };

  const getStudentGrades = (studentId: string, subject: string) => {
    return grades
      .filter(g => g.studentId === studentId && g.subject === subject)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getCurrentUserSchool = () => {
    if (currentUser?.role === 'director') {
      return schools.find(s => s.director?.id === currentUser.id);
    }
    if (currentUser?.schoolId) {
      return schools.find(s => s.id === currentUser.schoolId);
    }
    return null;
  };

  const getCurrentTeacher = () => {
    if (currentUser?.role === 'teacher') {
      return teachers.find(t => t.id === currentUser.id);
    }
    return null;
  };

  // Сортируем учеников по алфавиту
  const getSortedStudents = (classId: string) => {
    return students
      .filter(s => s.classId === classId)
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
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
                  Административный вход
                </p>
                <Button
                  onClick={handleAdminLogin}
                  variant="link"
                  className="text-primary hover:text-primary-700 text-sm"
                >
                  <Icon name="Shield" size={16} className="mr-1" />
                  Вход для администратора
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
                  {getCurrentUserSchool()?.name || 'Образовательный портал'}
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-primary-900">
                  Панель директора
                </h2>
                <p className="text-education-gray">
                  {getCurrentUserSchool()?.name}
                </p>
              </div>
              <Button
                onClick={() => setShowAddPost(true)}
                className="bg-primary hover:bg-primary-600"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить объявление
              </Button>
            </div>

            {showAddPost && (
              <Card>
                <CardHeader>
                  <CardTitle>Новое объявление</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="postTitle">Заголовок</Label>
                    <Input
                      id="postTitle"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Введите заголовок объявления"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postContent">Содержание</Label>
                    <Textarea
                      id="postContent"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      placeholder="Введите текст объявления"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addPost}>Опубликовать</Button>
                    <Button variant="outline" onClick={() => setShowAddPost(false)}>
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Объявления школы */}
            {posts.filter(p => p.schoolId === currentUser.schoolId).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Megaphone" size={20} className="mr-2 text-primary" />
                    Объявления школы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {posts
                    .filter(p => p.schoolId === currentUser.schoolId)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3)
                    .map(post => (
                      <div key={post.id} className="p-4 bg-primary-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-primary-900">{post.title}</h4>
                          <Badge variant="outline">{post.date}</Badge>
                        </div>
                        <p className="text-education-gray text-sm">{post.content}</p>
                        <p className="text-xs text-education-gray mt-2">Автор: {post.authorName}</p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Управление учителями */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Users" size={20} className="mr-2 text-primary" />
                    Учителя
                  </CardTitle>
                  <CardDescription>
                    Управление педагогическим составом
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => currentUser.schoolId && addTeacher(currentUser.schoolId)}
                    className="w-full"
                  >
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Добавить учителя
                  </Button>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {teachers
                      .filter(t => t.schoolId === currentUser.schoolId)
                      .map(teacher => (
                        <div key={teacher.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-education-gray">{teacher.subject}</p>
                          </div>
                          <Badge variant="secondary">{teacher.subject}</Badge>
                        </div>
                      ))}
                    
                    {teachers.filter(t => t.schoolId === currentUser.schoolId).length === 0 && (
                      <p className="text-center text-education-gray py-4">
                        Учителя не добавлены
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Управление классами */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="School" size={20} className="mr-2 text-primary" />
                    Классы
                  </CardTitle>
                  <CardDescription>
                    Управление классами и учениками
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => currentUser.schoolId && addClass(currentUser.schoolId)}
                    className="w-full"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить класс
                  </Button>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {classes
                      .filter(c => c.schoolId === currentUser.schoolId)
                      .map(schoolClass => {
                        const studentsInClass = getSortedStudents(schoolClass.id);
                        const classTeacher = teachers.find(t => t.id === schoolClass.teacherId);
                        return (
                          <div key={schoolClass.id} className="p-3 bg-primary-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{schoolClass.name}</p>
                                <p className="text-sm text-education-gray">
                                  {studentsInClass.length} учеников
                                </p>
                                {classTeacher && (
                                  <p className="text-xs text-green-600">
                                    Кл. рук.: {classTeacher.name}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addStudent(schoolClass.id, currentUser.schoolId!)}
                                >
                                  <Icon name="UserPlus" size={14} className="mr-1" />
                                  Ученик
                                </Button>
                                {!schoolClass.teacherId && (
                                  <Select 
                                    onValueChange={(value) => assignClassTeacher(schoolClass.id, value)}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue placeholder="Кл. рук." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teachers
                                        .filter(t => t.schoolId === currentUser.schoolId)
                                        .map(teacher => (
                                          <SelectItem key={teacher.id} value={teacher.id}>
                                            {teacher.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </div>
                            
                            {studentsInClass.length > 0 && (
                              <div className="space-y-1">
                                {studentsInClass.slice(0, 3).map(student => (
                                  <p key={student.id} className="text-sm text-education-gray">
                                    • {student.name}
                                  </p>
                                ))}
                                {studentsInClass.length > 3 && (
                                  <p className="text-sm text-education-gray">
                                    ... и ещё {studentsInClass.length - 3} учеников
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    
                    {classes.filter(c => c.schoolId === currentUser.schoolId).length === 0 && (
                      <p className="text-center text-education-gray py-4">
                        Классы не созданы
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Статистика */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
                  Статистика школы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-900">
                      {teachers.filter(t => t.schoolId === currentUser.schoolId).length}
                    </div>
                    <div className="text-sm text-education-gray">Учителей</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-900">
                      {classes.filter(c => c.schoolId === currentUser.schoolId).length}
                    </div>
                    <div className="text-sm text-education-gray">Классов</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-900">
                      {students.filter(s => s.schoolId === currentUser.schoolId).length}
                    </div>
                    <div className="text-sm text-education-gray">Учеников</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-900">
                      {posts.filter(p => p.schoolId === currentUser.schoolId).length}
                    </div>
                    <div className="text-sm text-education-gray">Объявлений</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentUser.role === 'teacher' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-primary-900">
                  Панель учителя
                </h2>
                <p className="text-education-gray">
                  {getCurrentTeacher()?.subject} • {getCurrentUserSchool()?.name}
                </p>
              </div>
            </div>

            {/* Выбор класса для журнала */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="BookOpen" size={20} className="mr-2 text-primary" />
                  Электронный журнал
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="classSelect">Выберите класс</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="classSelect" className="w-full">
                      <SelectValue placeholder="Выберите класс для работы с журналом" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes
                        .filter(c => c.schoolId === currentUser.schoolId)
                        .map(schoolClass => (
                          <SelectItem key={schoolClass.id} value={schoolClass.id}>
                            {schoolClass.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedClass && (
                  <div className="mt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-primary-900">
                        {classes.find(c => c.id === selectedClass)?.name} • {getCurrentTeacher()?.subject}
                      </h3>
                    </div>

                    {/* Таблица журнала */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-primary-100">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-primary-900 border-r">
                                Ученик
                              </th>
                              <th className="px-4 py-3 text-center font-medium text-primary-900 border-r">
                                Средний балл
                              </th>
                              <th className="px-4 py-3 text-center font-medium text-primary-900">
                                Новая оценка
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {getSortedStudents(selectedClass).map((student, index) => {
                              const studentGrades = getStudentGrades(student.id, getCurrentTeacher()?.subject || '');
                              const averageGrade = studentGrades.length > 0 
                                ? (studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length).toFixed(1)
                                : '-';
                              
                              return (
                                <tr key={student.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                  <td className="px-4 py-3 border-r border-b">
                                    <div>
                                      <p className="font-medium text-primary-900">{student.name}</p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {studentGrades.map(grade => (
                                          <Badge 
                                            key={grade.id}
                                            variant={grade.grade >= 4 ? "default" : grade.grade >= 3 ? "secondary" : "destructive"}
                                            className="text-xs"
                                          >
                                            {grade.grade}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center border-r border-b">
                                    <Badge 
                                      variant={parseFloat(averageGrade) >= 4 ? "default" : 
                                               parseFloat(averageGrade) >= 3 ? "secondary" : "destructive"}
                                      className={averageGrade === '-' ? 'bg-gray-200 text-gray-600' : ''}
                                    >
                                      {averageGrade}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-center border-b">
                                    <div className="flex justify-center space-x-1">
                                      {[5, 4, 3, 2].map(grade => (
                                        <Button
                                          key={grade}
                                          size="sm"
                                          variant={grade >= 4 ? "default" : grade >= 3 ? "secondary" : "destructive"}
                                          className="w-8 h-8 p-0 text-xs"
                                          onClick={() => updateGrade(student.id, getCurrentTeacher()?.subject || '', grade, selectedClass)}
                                        >
                                          {grade}
                                        </Button>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {getSortedStudents(selectedClass).length === 0 && (
                      <div className="text-center py-8 text-education-gray">
                        В этом классе пока нет учеников
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Объявления школы для учителя */}
            {posts.filter(p => p.schoolId === currentUser.schoolId).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Megaphone" size={20} className="mr-2 text-primary" />
                    Объявления школы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {posts
                    .filter(p => p.schoolId === currentUser.schoolId)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 2)
                    .map(post => (
                      <div key={post.id} className="p-4 bg-primary-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-primary-900">{post.title}</h4>
                          <Badge variant="outline">{post.date}</Badge>
                        </div>
                        <p className="text-education-gray text-sm">{post.content}</p>
                        <p className="text-xs text-education-gray mt-2">Автор: {post.authorName}</p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
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