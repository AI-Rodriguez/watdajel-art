export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const cookie = request.headers.get('cookie') || '';
  const isAuthenticated = cookie.includes('cfp_auth=authenticated');

  if (isAuthenticated) {
    return context.next();
  }

  if (request.method === 'POST' && url.pathname === '/__auth') {
    const formData = await request.formData();
    const password = formData.get('password');

    if (password === env.CFP_PASSWORD) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': 'cfp_auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400',
        },
      });
    }

    return new Response(loginPage(true), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  return new Response(loginPage(false), {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Watdajel</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    background:#1E1C19;
    color:#F0EBE3;
    font-family:'Inter',system-ui,sans-serif;
    font-weight:300;
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:100vh;
    padding:1.5rem;
  }
  .gate{
    text-align:center;
    max-width:360px;
    width:100%;
  }
  .logo{
    font-weight:500;
    font-size:.85rem;
    letter-spacing:.3em;
    text-transform:uppercase;
    margin-bottom:3rem;
    color:rgba(240,235,227,.5);
  }
  .prompt{
    font-size:.8rem;
    color:rgba(240,235,227,.4);
    margin-bottom:1.5rem;
    letter-spacing:.05em;
  }
  input{
    width:100%;
    padding:.8rem 1rem;
    background:rgba(240,235,227,.06);
    border:1px solid rgba(240,235,227,.12);
    border-radius:3px;
    color:#F0EBE3;
    font-family:inherit;
    font-size:.9rem;
    font-weight:300;
    letter-spacing:.05em;
    outline:none;
    transition:border-color .3s;
  }
  input:focus{border-color:rgba(240,235,227,.35)}
  input::placeholder{color:rgba(240,235,227,.2)}
  button{
    width:100%;
    margin-top:.75rem;
    padding:.75rem;
    background:rgba(240,235,227,.08);
    border:1px solid rgba(240,235,227,.15);
    border-radius:3px;
    color:#F0EBE3;
    font-family:inherit;
    font-size:.75rem;
    font-weight:400;
    letter-spacing:.2em;
    text-transform:uppercase;
    cursor:pointer;
    transition:all .3s;
  }
  button:hover{
    background:rgba(240,235,227,.14);
    border-color:rgba(240,235,227,.25);
  }
  .error{
    color:#D4613A;
    font-size:.75rem;
    margin-top:1rem;
    letter-spacing:.03em;
  }
</style>
</head>
<body>
<div class="gate">
  <div class="logo">Watdajel</div>
  <p class="prompt">This site is currently under development.</p>
  <form method="POST" action="/__auth">
    <input type="password" name="password" placeholder="Password" autofocus required>
    <button type="submit">Enter</button>
  </form>
  ${error ? '<p class="error">Incorrect password.</p>' : ''}
</div>
</body>
</html>`;
}
