<img src="https://i.imgur.com/a856gth.png" width="400" />

[![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/main.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/main) | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/release.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/release) | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/develop.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/develop) | [![codecov](https://codecov.io/gh/web2solutions/voodux/branch/main/graph/badge.svg?token=3zGpnoRLdG)](https://codecov.io/gh/web2solutions/voodux) | [![Known Vulnerabilities](https://snyk.io/test/github/web2solutions/voodux/badge.svg)](https://snyk.io/test/github/web2solutions/voodux)



# voodux

## Summary

The VooduX's proposal is to cover the common lacks and mistakes in modern web applications development. It heavly opinionate on how to define a strong foundation for most common types of web softwares which relies mostly in `V-*` like libraries and frameworks such as `Vue` and `React`.

Please don't get us wrong. `We are not reinventing any wheels`. We are just leveraging well stabilished paradigms and methodologies like `Entity Relationship`, `Data Entities`, `Actors`, `Objects`, `RAD`, `Component Engineering`, `Messaging Patterns`, `Event Driven Architecture`, 


VooduX provides a underlying architecture offering resources like:

- Generic `Data Schema` and `Data Model` driven design. Use the Mongoose implementation to define models. Same model can both run on client and server.
- A proxy like `Data Entity API` supporting different data transports
- Enforced Entity Relatioship and Data Entities design
- Application session
- Realtime Data Sync
- Plugin based `Data Transport` to give you the freedom to back your web software with any kind of `back end technology`
- `Trully multi threaded` architecture by leveraging web workers. Web applications are originally single threaded applications.
- 100% offline capable applications
- Asynchronous and `event driven` architecture.
- `Data Schema` generators leveraging OpenAPI speficiations (Swagger) as declarative metadata standard
- CRUD interfaces generators targeting React, Vue, DHTMLX and jQwidgets and leveraging OpenAPI speficiations (Swagger) as declarative metadata standard


### What it does not?

- It does not replace Redux, Mobx or Vuex.
- It does not cares about how you manage your application state
- It does not cares about which framework/library for `project standards` you use. Vue, React ...
- It does not cares about the UI framework/library you use. Material UI, Boostrap, Sencha, DHTMLX, Dojo.


## Install

### Via npm - Simple usage

```bash
  $ npm install voodux --save
```

### Via git - Advanced usage

```bash
  $ git clone https://github.com/web2solutions/voodux.git
  $ cd voodux
  $ npm install
```


## How to use


### Importing VooduX into your application

The first step to use VooduX in your project it to import it library.
#### ES5 import

```javascript
  const { Foundation } = require('voodux')
```


#### ES6 import

```javascript
  import { Foundation } from 'voodux'
```


#### Directly on browser

```html
  <script type="text/javascript" src="voodux/dist/main.min.js"></script>
```

### Writing your application code

The underlying architecture of every VooduX application borns in it `Data Design`.

The VooduX strongly believes that the `Data plan` and `Data design` is the first step to take when building successful projects. That is why we start by defining some `Data Schemas` for the `Data entities` we have in the system.

Every Data entity in the system has it own encapsulated methods to access, handle and notify data changes to every actor listening to it.
Schemas must be provided in the foundation constructor or at least pior calling the [`foundation.start()`](https://web2solutions.github.io/voodux/code/Foundation.html#.start__anchor) method. Otherwise it collection will not be created inside the local database.


#### Setup a data schema for a Data Entity

Every `Data Schema` in a `VooduX` application is set using the [`Foundation.Schema(schema)`](https://web2solutions.github.io/voodux/code/Foundation.html#.Schema__anchor) static method.

The data schemas are set following the [`Mongoose`](https://mongoosejs.com/docs/guide.html
) standard to define schemas. It means you are not repeating yourself when writing data schemas because they targets both the `front end` and `back end`. In other words, server and client data are being defined by a single contract.

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
```

#### Foundation constructor

The starting point of every `voodux` application is it `Foundation`.

The application foundation holds things like data definition, data access, data validation, data persistence, data change notification ....

Prior starting your React or Vue application code, you must create your `application foundation` and then to pass it as property to your React or Vue application.

The `application foundation` is set by calling the `Foundation constructor`.

```javascript
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
```



#### Listening to `Application Start` event

Sometimes you may need to start executing heavy tasks prior start rendering your application screens. For example you could start a data sync process, starting to fill out you local database and in meantime, render a dashboard and start rendering data changes in realtime, as long as they are `emitted` from the Data Entity abstraction implementation.

The `foundation:start` event listener must be set before calling `foundation.start()`. Otherwise it will not be triggered.

```javascript
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
```



#### Setup application data and start it

```javascript

  import React from 'react'

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


