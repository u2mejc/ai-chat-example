# ai-chat-example Client Side Snippet

This code is meant to be injected client side. For the purpose of this
example, we're using Chrome's developer tools snippets.

## How to Use

### TypeScript Workflow

1. Install the TypeScript dependencies using `npm i`
2. Transpile to JavaScript using the TypeScript compiler: `npx tsc`
3. Copy the snippet with `pbcopy < snippet.js` and paste the output into your
   Chrome Snippet.

## Run It

- Navigate to the website you want to work with.
- Open the Snippet in **DevTools > Sources > Snippets**.
- Run it using **Ctrl+Enter** (or **Cmd+Enter** on Mac) or right click and
  select Run.

## Considerations
If you want to host this snippet remotely and call it from a function on the
client’s page, the website must include an Access-Control-Allow-Origin header
that either matches the requesting domain or is set to a wildcard (*) to allow
all origins.
