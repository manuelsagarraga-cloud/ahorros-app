exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { path, method = 'GET', body: notionBody } = body;
  if (!path) return { statusCode: 400, body: 'Missing path' };

  const token = process.env.NOTION_TOKEN;
  if (!token) return { statusCode: 500, body: 'Token not configured' };

  try {
    const res = await fetch(`https://api.notion.com${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: notionBody ? JSON.stringify(notionBody) : undefined
    });

    const data = await res.json();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
