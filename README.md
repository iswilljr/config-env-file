# CONFIG ENV FILE

A command line to generate a .env.local based on a Config

---

## Go to:

- [Install](https://github.com/iswilljr/config-env-file#install)
- [Usage](https://github.com/iswilljr/config-env-file#usage)
- [Help](https://github.com/iswilljr/config-env-file#help)
- [Examples](https://github.com/iswilljr/config-env-file#examples)

---

## Install:

```bash
// npm
npm i config-env-file -D

// yarn
yarn add config-env-file -D

// or clone
git clone https://github.com/iswilljr/config-env-file.git
```

---

## Usage:

```bash
npx config --file /path/to/your/config/file
```

---

## Help

```bash
npx config --help
```

---

## Examples

### Basic example

In this example we have the next config file:

```javascript
const firebaseConfig = {
  apiKey: "example",
  authDomain: "example.firebaseapp.com",
  projectId: "example",
  storageBucket: "example.appspot.com",
  messagingSenderId: "example",
  appId: "1:example:web:example",
};

module.exports = firebaseConfig;
```

File path: src/example/index.js

Then, run the next command:

```bash
npx config -f src/example/index.js
```

This will generate a .env.local file in root of our project, like this:

```env
APIKEY=example
AUTHDOMAIN=example.firebaseapp.com
PROJECTID=example
STORAGEBUCKET=example.appspot.com
MESSAGINGSENDERID=example
APPID=1:example:web:example
```

Output:

```javascript
const config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};
```

### Full example

In this example we have the same config in the previous example, plus we have the next .env.local file:

```env
DOMAIN=http://localhost:3001
```

Then, run the next command:

```bash
npx config -f src/example/index.js -d . -e prod -t react_app -p process -m .env.local
```

This will merge our .env.local file with the config and generate a .env.prod file in root of our project, like this:

```env
REACT_APP_DOMAIN=123
REACT_APP_APIKEY=example
REACT_APP_AUTHDOMAIN=example.firebaseapp.com
REACT_APP_PROJECTID=example
REACT_APP_STORAGEBUCKET=example.appspot.com
REACT_APP_MESSAGINGSENDERID=example
REACT_APP_APPID=1:example:web:example
```

Output:

```javascript
const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};
```
