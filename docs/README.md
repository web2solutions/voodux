<img src="https://i.imgur.com/a856gth.png" width="400" />

[![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/main.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/main) Main | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/release.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/release) Release | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/develop.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/develop) Develop | [![codecov](https://codecov.io/gh/web2solutions/voodux/branch/main/graph/badge.svg?token=3zGpnoRLdG)](https://codecov.io/gh/web2solutions/voodux)


# voodux

## Summary

The proposal is about to cover the common lacks and mistakes in modern web applications development by heavly opinionating on how to define a strong foundation for most common types of web based softwares which relies mostly in `V-*` libraries and frameworks like `Vue` and `React`.

It provides a underlying architecture offering resources like:

- Generic `Data Schema` and `Data Model` driven design. Use the Mongoose implementation to define models. Same model can both run on client and server.
- A proxy like `Data Entity API` supporting different data transports
- Complete boilerplate for software testing.
- Complete boilerplate for software documentation.
- Enforced Entity Relatioship and Data Entities design
- Application session
- Realtime Data Sync
- Plugin based `Data Transport` to give you the freedom to back your web software with any kind of `back end technology`
- `Trully multi threaded` architecture by leveraging web workers. Web applications are originally single threaded applications.
- 100% offline capable applications
- Asynchronous and `event driven` architecture.
- `Data Schema` generators leveraging OpenAPI speficiations (Swagger) as declarative metadata standard
- CRUD interfaces generators targeting React, Vue, DHTMLX and jQwidgets and leveraging OpenAPI speficiations (Swagger) as declarative metadata standard


## What it does not?

- It does not replace Redux, Mobx or Vuex.
- It does not cares about how you manage your application state
- It does not cares about which framework/library for `project standards` you use. Vue, React ...
- It does not cares about the UI framework/library you use. Material UI, Boostrap, Sencha, DHTMLX, Dojo.


## Install

```bash
    $ npm install voodux --save
```

## How to use

```javascript
  import { Foundation } from 'voodux'

  const CustomerSchema = new Foundation.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    address: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    cards: {
        type: [],
        required: true
    }
  })

  const OrderSchema = new Foundation.Schema({
      name: {
          type: String,
          required: true,
          index: true
      },
      shipTo: {
          type: String,
          required: true,
          index: true
      },
      paymentMethod: {
          type: String,
          required: true,
          index: true
      },
      amount: {
          type: Number,
          required: true,
          default: 0,
          index: true
      },
      date: {
          type: Date,
          default: Date.now,
          index: true
      }
  })

  const ProductSchema = new Foundation.Schema({
      name: {
          type: String,
          required: true,
          index: true
      },
      vendor: {
          type: String,
          required: true,
          index: true
      },
      price_cost: {
          type: Number,
          required: true,
          default: 0,
          index: true
      }
  })

  const UserSchema = new Foundation.Schema({
      name: {
          type: String,
          required: true
      },
      username: {
          type: String,
          required: true
      }
  })

  const foundation = new Foundation({
      name: 'My App',
      useWorker: true,
      dataStrategy: 'offlineFirst',
      schemas: {
          User: UserSchema,
          Product: ProductSchema,
          Order: OrderSchema,
          Customer: CustomerSchema
      }
  })

  foundation.on('foundation:start', async function(eventObj) {
      const {
          foundation,
          error
      } = eventObj
      if (error) {
          throw new Error(`Error starting foundation stack: ${error}`)
      }
      const {
          User,
          Product
      } = foundation.data
      const Eduardo = await User.add({
          name: 'Eduardo Almeida',
          username: 'web2'
      })
      console.debug('Eduardo', Eduardo)

      const Volvo = await Product.add({
          name: 'Volvo XC90',
          vendor: 'Volvo',
          price_cost: 150000
      })
      console.debug('Volvo', Volvo)
  })

  // start foundation and get it ready to be used
  const start = await foundation.start()
  if (start.error) {
      throw new Error(`Error starting foundation stack: ${start.error}`)
  }
  // console.debug('start', start)
  ReactDOM.render(
    <App foundation={foundation} />,
    document.getElementById('root')
  )

```


## React Demos
### React Demo app (Functional components)

<img src="https://i.imgur.com/b29Lsgj.png" width="600" />

[`Demo app`](https://voodux-react-functions-demo.vercel.app/)

[`Demo project`](https://github.com/web2solutions/voodux-react-functions-demo)

`Demo documentation:` -> TODO

### React Demo app (Class based components)

<img src="https://i.imgur.com/E1u5g6y.png" width="600" />

[`Demo app`](https://voodux-react-class-demo.vercel.app/)

[`Demo project`](https://github.com/web2solutions/voodux-react-class-demo)

[`Demo documentation:`](https://web2solutions.github.io/voodux-react-class-demo/)


## Motivation

[What motivates this](https://github.com/web2solutions/voodux/blob/main/MOTIVATION.md)

## Links and references

- [API documentation](https://web2solutions.github.io/voodux/code/index.html)
- [Unit tests Report](https://web2solutions.github.io/voodux/reports/unit-testing/index.html)

- [PWA - Progressive web applications](https://web.dev/progressive-web-apps/)
- [SPA - Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Mongoose](https://mongoosejs.com/)


## Code automation tools

- `npm run test`

  Executes the test suite

- `npm run start:dev`

  Starts the dev server at 5490 port

- `npm run build`

  Build the application inside `dist/` folder

  1. Runs `npm run lint`
  2. Runs `npm run test`
  3. Runs `npm run doc`
  4. Runs `npm run webpack`

- `npm run doc`

  Generates the code documentation using JSDoc

- `npm run lint`

  Runs lint against the code at src/ folder

- `npm run eslint-fix`

  Runs eslint --fix against the code at src/ folder

- `npm run format-code`

Runs prettier-eslint --write against the code at src/ folder

- `npm run webpack`

Transpile the es6 code (src/) to es5 version at dist/ folder



## ToDo

1. REST transport
2. Websocket transport
3. Serverless transport (Firebase)
4. Session layer
5. Event sourcing
6. Vue demo
7. DHTMLX demo
8. VanilaJS demo
9. textual search with lunr.
10. Workbox -> https://developers.google.com/web/tools/workbox/guides/get-started


