<img src="https://i.imgur.com/a856gth.png" width="400" />

# voodux

> "with bateries included" agnostic scalable "M" layer for React, Vue, ExtJS, DHTMLX and Vanilla.JS

> The missing building block for enterprise and modern web applications

```bash
    $ npm install voodux --save
```


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


[![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/main.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/main) | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/release.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/release) | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/develop.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/develop) | [![codecov](https://codecov.io/gh/web2solutions/voodux/branch/main/graph/badge.svg?token=3zGpnoRLdG)](https://codecov.io/gh/web2solutions/voodux) | [![Known Vulnerabilities](https://snyk.io/test/github/web2solutions/voodux/badge.svg)](https://snyk.io/test/github/web2solutions/voodux)




`Agnostic Foundation for Web Applications` is more a kind of framework where its code is not the most important piece, but it underlying proposal.

Leveraging agile techiques to implement scalable React, Vue and any other kind of "V*" framework based applications since it initial days.

We strongly opiniate about the `M` layer and we `have a database`! In the browser. Yes, this excactly what you are hearing.

Data design and ER diagrams are not `back end crucial only`.

### Why is this important ?

Right here we are not talking about `servers` and `back ends`. Never.

This is about producing standalone web applications. 

We strongly believe that `PWA` and `SPA` are the future of `mobile` applications simply because they are cheaper than producing speficic platform based code. They are just HTML5, CSS and JS. Backed by powerful things like caching, database, hardware manipulation through APIs, multi threading. Everything on Browser!

For those that follows `herd mentality`, `this proposal`, might NOT make senses. But for those that really understands this industry, it totaly makes sense!

It is about writing one code and to target all devices. Right now the hype approach is to produce web and mobile decoupled applications. 

It could be more profitable for a software house to implement 2 different applications at least, but looking to the exponentional demand increasing for `sharing apps through app stores`, sometimes you will probably need to ask your `front end team` (`those guys seeing as kids it doesnt matter how old they are`) take onwnership of responsibilities like your very skilled `Kotlin`, `Java` or `Swift` team are actually doing.

`It is about costs!`

`It is about available resources on market!`

`It is about to be able to attend the demand in short and long term`


> "The use of data modeling standards is strongly recommended for all projects requiring a standard means of defining and analyzing data within an organization"


### API documentation (DRAFT)

https://web2solutions.github.io/voodux/code/index.html




### React Demo app (Functional components)


<img src="https://i.imgur.com/b29Lsgj.png" width="600" />

[`Demo app`](https://voodux-react-functions-demo.vercel.app/)

[`Demo project`](https://github.com/web2solutions/voodux-react-functions-demo)

`Demo documentation:`

TODO


### React Demo app (Class based components)

<img src="https://i.imgur.com/E1u5g6y.png" width="600" />


[`Demo app`](https://voodux-react-class-demo.vercel.app/)



[`Demo project`](https://github.com/web2solutions/voodux-react-class-demo)

[`Demo documentation:`](https://web2solutions.github.io/voodux-react-class-demo/)




### Vue Demo app - todo




## Motivation

[What motivates this](https://github.com/web2solutions/voodux/blob/main/MOTIVATION.md)
