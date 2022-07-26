# CONFIG ENV FILE

A command line to generate a .env file based on a Config

## Install

```bash
# npm
npm install -g config-env-file

# yarn
yarn global add config-env-file -D
```

## Usage

```bash
cef /path/to/your/config/file [options]
```

## Examples

### Basic example

In this example we have the next config file:

```json
// File path: ./config.json
{
  "apiKey": "example",
  "authDomain": "example.firebaseapp.com",
  "projectId": "example",
  "storageBucket": "example.appspot.com",
  "messagingSenderId": "example",
  "appId": "1:example:web:example"
}
```

Then, run the next command:

```bash
cef ./config.json
```

This will generate a .env.local file in root of our project, like this:

```env
API_KEY=example
AUTH_DOMAIN=example.firebaseapp.com
PROJECT_ID=example
STORAGE_BUCKET=example.appspot.com
MESSAGING_SENDER_ID=example
APP_ID=1:example:web:example
```

Output:

```javascript
// Check your .env.local file
// Your config:
const config = { 
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
}
```

### Full example

In this example we have the same config in the previous example, plus we have the next .env.local file:

```env
DOMAIN=http://localhost:3001
```

Then, run the next command:

```bash
cef ./config.json -d . -e development -t next_public -E import -m .env.local
```

Options:

```javascript
./config.json // file path
-d . // destination => current directory
-e development // file extension => .env.prod
-t next_public // KEY => NEXT_PUBLIC_KEY
-E import // output => import.meta.env.KEY
-m .env.local // merge with an existing env file
```

This will merge our .env.local file with the config and generate a .env.prod file in root of our project, like this:

```env
NEXT_PUBLIC_DOMAIN=http://localhost:3001
NEXT_PUBLIC_API_KEY=example
NEXT_PUBLIC_AUTH_DOMAIN=example.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=example
NEXT_PUBLIC_STORAGE_BUCKET=example.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=example
NEXT_PUBLIC_APP_ID=1:example:web:example
```

Output:

```javascript
// Check your .env.development file
// Your config:
const config = { 
  domain: import.meta.env.NEXT_PUBLIC_DOMAIN,
  apiKey: import.meta.env.NEXT_PUBLIC_API_KEY,
  authDomain: import.meta.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: import.meta.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: import.meta.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: import.meta.env.NEXT_PUBLIC_APP_ID
}
```

## Help

```bash
cef --help
```
