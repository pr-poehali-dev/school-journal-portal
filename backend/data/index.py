import json
import psycopg2
from typing import Dict, Any
import os

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Облачное хранение данных образовательного портала
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    # Получаем параметры подключения к БД
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'schools': [],
                'users': [],
                'teachers': [],
                'classes': [],
                'students': [],
                'grades': [],
                'posts': [],
                'homework': []
            })
        }
    
    try:
        # Подключаемся к БД
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        if method == 'GET':
            # Получение всех данных
            create_tables(cursor)
            conn.commit()
            
            tables = ['schools', 'users', 'teachers', 'classes', 'students', 'grades', 'posts', 'homework']
            result = {}
            
            for table in tables:
                try:
                    cursor.execute(f"SELECT * FROM {table}")
                    columns = [desc[0] for desc in cursor.description]
                    rows = cursor.fetchall()
                    result[table] = [dict(zip(columns, row)) for row in rows]
                except Exception:
                    # Таблица может не существовать, создаем пустой массив
                    result[table] = []
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps(result)
            }
        
        elif method == 'POST':
            # Сохранение данных
            body_data = json.loads(event.get('body', '{}'))
            
            # Создаем таблицы если они не существуют
            create_tables(cursor)
            
            # Сохраняем данные по таблицам
            for table_name, records in body_data.items():
                if not records or table_name not in ['schools', 'users', 'teachers', 'classes', 'students', 'grades', 'posts', 'homework']:
                    continue
                    
                # Очищаем таблицу перед вставкой новых данных
                cursor.execute(f"DELETE FROM {table_name}")
                
                for record in records:
                    if not record:
                        continue
                        
                    columns = list(record.keys())
                    values = list(record.values())
                    placeholders = ', '.join(['%s'] * len(values))
                    
                    insert_query = f"""
                        INSERT INTO {table_name} ({', '.join(columns)}) 
                        VALUES ({placeholders})
                    """
                    cursor.execute(insert_query, values)
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Data saved successfully'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e), 'message': 'Database error occurred'})
        }
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }


def create_tables(cursor):
    """Создает необходимые таблицы в БД"""
    
    # Таблица школ
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schools (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(500)
        )
    """)
    
    # Таблица пользователей
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            login VARCHAR(100),
            password VARCHAR(100),
            school_id VARCHAR(50)
        )
    """)
    
    # Таблица учителей
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS teachers (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            subject VARCHAR(100) NOT NULL,
            login VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            school_id VARCHAR(50) NOT NULL
        )
    """)
    
    # Таблица классов
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS classes (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            grade INTEGER NOT NULL,
            school_id VARCHAR(50) NOT NULL,
            teacher_id VARCHAR(50)
        )
    """)
    
    # Таблица учеников
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            class_id VARCHAR(50) NOT NULL,
            school_id VARCHAR(50) NOT NULL,
            login VARCHAR(100),
            password VARCHAR(100)
        )
    """)
    
    # Таблица оценок
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS grades (
            id VARCHAR(50) PRIMARY KEY,
            student_id VARCHAR(50) NOT NULL,
            teacher_id VARCHAR(50) NOT NULL,
            subject VARCHAR(100) NOT NULL,
            grade INTEGER NOT NULL,
            date VARCHAR(50) NOT NULL,
            class_id VARCHAR(50) NOT NULL
        )
    """)
    
    # Таблица постов/объявлений
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id VARCHAR(50) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            author_id VARCHAR(50) NOT NULL,
            author_name VARCHAR(255) NOT NULL,
            school_id VARCHAR(50) NOT NULL,
            date VARCHAR(50) NOT NULL
        )
    """)
    
    # Таблица домашних заданий
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS homework (
            id VARCHAR(50) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            subject VARCHAR(100) NOT NULL,
            class_id VARCHAR(50) NOT NULL,
            teacher_id VARCHAR(50) NOT NULL,
            school_id VARCHAR(50) NOT NULL,
            due_date VARCHAR(50) NOT NULL,
            created_date VARCHAR(50) NOT NULL
        )
    """)