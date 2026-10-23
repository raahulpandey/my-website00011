import { NextResponse } from 'next/server';

export function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';

  // LockDown Browser includes "LockDownBrowser" in its user-agent string
  const isLockDownBrowser = /LockDownBrowser|Respondus/i.test(userAgent);

  if (!isLockDownBrowser) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Access Restricted</title>
          <style>
            body { font-family: sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; background: #0f172a; color: #fff; text-align: center; }
            .card { padding: 2rem; border-radius: 8px; background: #1e293b; max-width: 480px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
            h1 { color: #f87171; font-size: 1.5rem; }
            p { color: #cbd5e1; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Access Restricted</h1>
            <p>This exam/application can only be accessed using <strong>Respondus LockDown Browser</strong>.</p>
            <p>Please close this browser, launch LockDown Browser, and navigate back to this URL.</p>
          </div>
        </body>
      </html>`,
      {
        status: 403,
        headers: { 'content-type': 'text/html' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
