export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") {
      return handleAuth(request, env);
    }
    if (url.pathname === "/api/callback") {
      return handleCallback(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleAuth(request, env) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/callback`;
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", env.OAUTH_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");

  return Response.redirect(authorizeUrl.toString(), 302);
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Falta el parametre 'code'.", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return new Response("Error d'autenticacio: " + (tokenData.error_description || tokenData.error), { status: 400 });
  }

  const token = tokenData.access_token;
  const message = JSON.stringify({ token, provider: "github" });
  const escaped = message.replace(/'/g, "\\'");

  const script = "<script>(function(){function receiveMessage(e){window.opener.postMessage('authorization:github:success:" + escaped + "', e.origin);window.removeEventListener('message', receiveMessage, false);}window.addEventListener('message', receiveMessage, false);window.opener.postMessage('authorizing:github', '*');})();</script>";

  return new Response("<html><body>" + script + "</body></html>", {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
