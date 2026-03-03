import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """
    Обработчик для формы обратной связи и опроса об ИИ в образовании.
    action=get_poll — получить результаты опроса
    action=vote — проголосовать
    action=feedback — сохранить отзыв
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    method = event.get('httpMethod', 'GET')
    schema = 't_p78551442_starshine_launch'
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if method == 'GET':
            action = (event.get('queryStringParameters') or {}).get('action', 'get_poll')
            body = {}
        else:
            body = json.loads(event.get('body') or '{}')
            action = body.get('action', '')

        if action == 'get_poll':
            cur.execute(f"""
                SELECT option_key, COUNT(*) as votes
                FROM {schema}.poll_votes
                GROUP BY option_key
            """)
            rows = cur.fetchall()
            results = {row[0]: int(row[1]) for row in rows}
            total = sum(results.values())
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'results': results, 'total': total})
            }

        if action == 'vote':
            option_key = body.get('option', '').strip()
            allowed = ['positive', 'negative', 'neutral', 'depends']
            if option_key not in allowed:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Недопустимый вариант ответа'})
                }
            cur.execute(
                f"INSERT INTO {schema}.poll_votes (option_key) VALUES (%s)",
                (option_key,)
            )
            conn.commit()
            cur.execute(f"""
                SELECT option_key, COUNT(*) as votes
                FROM {schema}.poll_votes
                GROUP BY option_key
            """)
            rows = cur.fetchall()
            results = {row[0]: int(row[1]) for row in rows}
            total = sum(results.values())
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'results': results, 'total': total})
            }

        if action == 'feedback':
            name = body.get('name', '').strip()
            role = body.get('role', '').strip()
            message = body.get('message', '').strip()
            if not name or not role or not message:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Все поля обязательны'})
                }
            cur.execute(
                f"INSERT INTO {schema}.feedback (name, role, message) VALUES (%s, %s, %s)",
                (name, role, message)
            )
            conn.commit()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'message': 'Отзыв сохранён'})
            }

        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Неизвестное действие'})
        }

    finally:
        cur.close()
        conn.close()