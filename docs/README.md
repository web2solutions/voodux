[<img src="https://i.imgur.com/a856gth.png" width="400" />](./index.html)

[![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/main.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/main) | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/release.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/release) | [![CircleCI](https://circleci.com/gh/web2solutions/voodux/tree/develop.svg?style=svg&circle-token=9d237bc24e3336b97f53ab9626f8a2ceb6f230b3)](https://circleci.com/gh/web2solutions/voodux/tree/develop) | [![codecov](https://codecov.io/gh/web2solutions/voodux/branch/main/graph/badge.svg?token=3zGpnoRLdG)](https://codecov.io/gh/web2solutions/voodux) | [![Known Vulnerabilities](https://snyk.io/test/github/web2solutions/voodux/badge.svg)](https://snyk.io/test/github/web2solutions/voodux) | [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)




# VooduX

## Summary

The VooduX's proposal is to cover the common lacks and mistakes in modern web applications development. It heavly opinionate on how to define a strong underlying architecture for the most common types of web softwares which relies mostly in `V-*` like libraries and frameworks such as `Vue` and `React`.

#### What VooduX is not?

- It does not replace Redux, Mobx, Vuex any any other kind of `Application Management` abstraction.
- It does not cares about how you manage your application state.
- It does not cares about which `project standard`'s framework/library you employ. Vue, React, It does not matters.
- It does not cares about the UI framework/library you are employing. The Material UI, Boostrap, Vuetify, Sencha, DHTMLX, Dojo.

#### What is VooduX then?

It is good to see teams proud of being `TDD driven` teams. It is amazing to see team proud of `Translating pixel-perfect designs from Figma`, it is really are fascinating to be exposed to new and good `User Xperiences`. Horses flying and 3D rotating on screen, big red error messages on giant rounded number form field when user tries to type a string value inside, are good, but this is the head of the iceberg only.


In several cases, industries are heavily focusing on specific pieces of the process, under a totaly focused on a `Software Engineering` field influenced perspective, rather than prior scoping a overall product plan, flavoured on a `System Information` field perspective. 

Sometimes part of the project process is rock solid, but the final product is lacking in simple things. I saw large financial applications that when opened on multiple browser tabs, and if you add a new data in tab one, all other tabs stays dumb. If I went to another tab, the new data was not there.

We really love `State Management` libraries and we use them on daily basis. But we don't agree to the assumption that `Application State Management` does the same as a `Application Data Management` abstraction suposedly does. Simply because the `application data size` might considerable grows.

We like to think in a scenario where the `Application State Management` abstraction handles `pieces` of data that are curenlty being used in the screen at the present moment. But it does not means you should not have another pieces of data being `underlying handled by some other manner` behind the scenes.

Let's make a simple comparison to quickly visualize the main difference between traditional React/Vue applications and a VooduX powered application:

---------

`This is how a common React/Vue application looks like:`



<img src="https://i.imgur.com/acwNgqq.png" style="max-width: 900px;" />


---------

`This is how a VooduX powered React/Vue application looks like:`


<img src="https://i.imgur.com/FsxIaMl.png" style="max-width: 900px;" />

---------

Please don't get us wrong. `We are not reinventing any wheels`. We are just leveraging well stabilished paradigms and methodologies like `Entity Relationship`, `Data Entities`, `Actors`, `Objects`, `RAD`, `Component Engineering`, `Messaging Patterns`, `2-way data flow over an Event Driven Architecture`, `Data Caching` so on and so forth, to delivery agile produced sotware MVPs that scales since from it initial days.

Supose the `server - back end` emits a [`Server Event Message`](https://developer.mozilla.org/pt-BR/docs/Web/API/Server-sent_events/Using_server-sent_events) to connected clients with the following info:

 ```javascript
  { 
    action: 'completed', 
    entity: 'Order', 
    id: 24455,
    customerId: 3443,
    lineItems: [...[{}]],
    totalPaid: 5430
  }
```

Supose you are currently catching your eyes at the Dashboard page in the screen where you have: `Last Order Listing`, `Sales Chart` and `Total Earns Today` badge. 

Like this: 

<img src="https://i.imgur.com/b29Lsgj.png" width="500" />


You now need to update those components based on the received [`Server Event Message`](https://developer.mozilla.org/pt-BR/docs/Web/API/Server-sent_events/Using_server-sent_events).


The `Last Order Listing` component displays the name of the customer alongside it address and total paid for that specific order.

In that moment, if you dont have the Customer information inside the `Application State Management` implementation, you need to get it in another place. That is where the `Application Data Management` abstraction resides.

Traditionaly the main applications implementation rely on directly calling an API, or even use things like the browser `localStorage` API, which will fails once it data size and complexity grows.

Going against this implementation model, we intoduce a `proxy like` abstraction relying on IndexedDB as local (front end) database, which is a NoSQL database shipped with every modern browser. 

There are some frameworks, like Backbone, and some plugins for React and Vue that aims to use IndexedDb as database, but they are dumb and lazy in terms of data design driven development and validation.

Aditionaly, VooduX abstract some kind of `data transporters` which is used `to send own produced event and data to` and `to consume thirdy party produced event and data from`. Every data change has an associated event object and action, which is not used only for `Event Sourcing`, but also to provide direct `bindings` for `decoupled View components`.

Despite the fact we can now fastly and cheaply request data, we have also a complete database running on front end. The `Application Data Management` abstraction gives you some capabilities such:

- Do not loose data on network disconnections.
- 100% offline capable applications.
- Drastically reduce server resources dependency.
- High performant UI reactivity.


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
- `Data Schema` generators leveraging the OpenAPI speficiations (Swagger) as declarative metadata standard
- CRUD interfaces generators targeting React, Vue, DHTMLX and jQwidgets and leveraging OpenAPI speficiations (Swagger) as declarative metadata standard

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

This the Step by Step guide to use VooduX

### Importing VooduX into your application

The first step to use VooduX in your project it to import it library.
#### Require

```javascript
  const voodux = require('voodux')

  const { 
    Foundation, 
    // LocalDatabaseTransport, 
    // DataEntity, 
    // utils 
  } = voodux
```


#### ES6 import

In order to import the main library to your project just simply import it:

```javascript
  import voodux from 'voodux'
  const { 
    Foundation, 
    // LocalDatabaseTransport, 
    // DataEntity, 
    // utils 
  } = voodux
```


#### Browser directly usage

```html
  <script type="text/javascript" src="voodux/dist/main.min.js"></script>
```

#### React and Vue Project Structure 

This is how a hypotethical React or Vue project structure looks like. This example is assuming the fact that your application have 4 pages:

1. Dashboard 
2. Customers
3. Orders
4. Products


```bash
├── dist                          -> Final app code goes here
├── docs
│ ├── code                        -> JSDoc documentation will be saved here
│ └── reports                     -> Karma reports will be saved here
├── html_app                      -> Original static files
├── test                          -> Test suites goes here
├── src
│   ├── components
│   │   ├── customers
│   │   │   ├── CustomersAdd.js   -> Add form
│   │   │   ├── CustomersEdit.js  -> Edit form
│   │   │   ├── index.js          -> Main listing page
│   │   │   └── events            -> Event Handlers decoupled from component files
│   │   ├── dashboard
│   │   │   ├── Chart.js          -> Finance Chart
│   │   │   ├── index.js          -> Main listing page
│   │   │   └── events            -> Event Handlers decoupled from component files
│   │   ├── orders
│   │   │   ├── OrdersAdd.js      -> Add form
│   │   │   ├── index.js          -> Main listing page
│   │   │   └── events            -> Event Handlers decoupled from component files
│   │   ├── products
│   │   │   ├── ProductsAdd.js    -> Add form
│   │   │   ├── ProductsEdit.js   -> Edit form
│   │   │   ├── index.js          -> Main listing page
│   │   │   └── events            -> Event Handlers decoupled from component files
│   ├── events                    -> Decoupled Application Event handlers
│   ├── schemas                   -> Data Entity Schemas (or Data Models) are saved here
│   ├── App.css
│   ├── App.js                    -> React/Vue Application code
│   └── main.js                   -> Application entry point
├── test
├── .babelrc                      -> Babel configuration
├── .eslintignore                 -> eslint ignore rules
├── .eslintrc.json                -> eslint configuration
├── .prettierrc                   -> prettier configuration
├── jsDoc.json                    -> JSDoc configuration
├── package.json
└── webpack.config.js              -> webpack configuration
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
import voodux from 'voodux'
const { Foundation, LocalDatabaseTransport, DataEntity, utils } = voodux

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



#### Hypothetical full React app setup demo

```javascript
  // import React lib
  import React from 'react'
  
  // import voodux
  import voodux from 'voodux'
  const { Foundation, LocalDatabaseTransport, DataEntity, utils } = voodux

  // setup Data schemas
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

  // listen to application start event and add some records to database.
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

  // start application foundation and get it ready to be used
  const start = await foundation.start()
  if (start.error) {
      throw new Error(`Error starting foundation stack: ${start.error}`)
  }
  
  // start rendering yout React application by passing the application foundation as it prop.
  ReactDOM.render(
    <App foundation={foundation} />,
    document.getElementById('root')
  )

```



#### Hypothetical React `Customers Listing` component

This component does render a list of Customers.

On the list, every listed customer has associated `delete` and `update` links.

The component has an array of `customers` as main state property.

Ok, there is nothing new here!

The `dirty magic` begins when the requirement list starting asking for things like:

- To be able to show the same data in the screen after browser refreshing `and do not` call the server API asking for those specific piece of data.
- Have a reliable and high performance `2-way dataflow` model between `Application Data Storage and Application State Manager`.



```javascript
// pages/orders.js
import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
// import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import useStyles from './useStyles'

import swal from 'sweetalert'

import FoundationContext from '../FoundationContext'


import Title from './Title'

// import custom hooks
import onAddDocHook from './hooks/onAddDocHook'
import onEditDocHook from './hooks/onEditDocHook'
import onDeleteDocHook from './hooks/onDeleteDocHook'



export default function Customers () {
  const [customers, setCustomers] = useState([])
  const foundation = useContext(FoundationContext)

  const { Customer } = foundation.data
  const [newDoc] = onAddDocHook(Customer)
  const [editedDoc] = onEditDocHook(Customer)
  const [deletedDoc] = onDeleteDocHook(Customer)
  
  const history = useHistory()
  const classes = useStyles()

  const handleAddCustomer = (e) => {
    e.preventDefault()
    history.push('/CustomersAdd')
  }

  const handleDeleteCustomer = async (e, ___id) => {
    e.preventDefault()
    // console.error(___id)
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this!',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        const r = await Customer.delete(___id)
        // console.error(r)
        if (r.error) {
          swal('Database error', e.error.message, 'error')
          return
        }
        swal('Poof! The customer has been deleted!', {
          icon: 'success'
        })
      } else {
        swal('The Customer is safe!')
      }
    })
  }


  // whatch for new docs
  useEffect(() => {
    if (newDoc !== null) {
      console.log('newDoc mudou', newDoc)
      setCustomers([newDoc, ...customers])
      console.log('customers', customers)
    }
  }, [newDoc]) 

  // watch for edited docs
  useEffect(() => {
    if (editedDoc !== null) {
      console.log('editedDoc mudou', editedDoc)
      const newData = customers.map((customer) => {
        if (customer.__id === editedDoc.__id) {
          return editedDoc
        } else {
          return customer
        }
      })
      setCustomers([...newData])
      console.log('customers', customers)
    }
  }, [editedDoc])

  // watch for deleted docs
  useEffect(() => {
    if (deletedDoc !== null) {

      const allCustomers = [...customers]
      for (let x = 0; x < allCustomers.length; x++) {
        const customer = allCustomers[x]
        if (customer.__id === deletedDoc.__id) {
          allCustomers.splice(x, 1)
        }
      }
      setCustomers(allCustomers)
    }
  }, [deletedDoc]) 

  useEffect(() => {
    async function findCustomers() {
      const findCustomers = await Customer.find({})
      if (!findCustomers) {
        return
      }
      if (findCustomers.data) {
        setCustomers(findCustomers.data)
      }
    }
    console.log('finding')
    if (customers.length === 0) {
      findCustomers()
    }
  }, [customers])
  


  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Customers</Title>
            <ButtonGroup color='primary' aria-label='outlined primary button group'>
              <Button onClick={handleAddCustomer}>Add</Button>
            </ButtonGroup>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Cards</TableCell>
                  <TableCell align='right'>actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell align='right'>{customer.cards.join(' / ')}</TableCell>
                    <TableCell align='right'>
                      <Link color='primary' to={`/CustomersEdit/${customer.__id}`}>[edit]</Link> | <a color='primary' href='#' onClick={e => handleDeleteCustomer(e, customer.__id)}>[delete]</a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className={classes.seeMore}> Paging goes here </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
```

##### The hooks:

`onAddDocHook`

```javascript
// onAddDocHook.js

import React from 'react'

const onAddDocHook = (Model) => {
  const [newDoc, newDocSet] = React.useState(null)
  let onAddDocEventListener = null

  React.useEffect(() => {
    if (newDoc === null) {
      onAddDocEventListener = Model.on('add', (eventObj) => {
        const { error, /* document, foundation, */ data } = eventObj
        if (error) {
          return
        }
        newDocSet(data)
      })
    }
  }, [newDoc])

  React.useEffect(() => {
    return () => {
      // stop to listen events on component unmount
      Model.stopListenTo(onAddDocEventListener)
      onAddDocEventListener = null
    }
  }, [])

  return [newDoc]
}

export default onAddDocHook

```


`onEditDocHook`

```javascript
// onEditDocHook.js
import React from 'react'

const onEditDocHook = (Model) => {
  const [editedDoc, editedDocSet] = React.useState(null)
  let onEditDocEventListener = null

  React.useEffect(() => {
    if (editedDoc === null) {
      onEditDocEventListener = Model.on('edit', (eventObj) => {
        const { error, /* document, foundation, */ data } = eventObj
        if (error) {
          return
        }
        editedDocSet(data)
      })
    }
  }, [editedDoc])

  React.useEffect(() => {
    return () => {
      // stop to listen events on component unmount
      Model.stopListenTo(onEditDocEventListener)
      onEditDocEventListener = null
    }
  }, [])
  return [editedDoc]
}

export default onEditDocHook

```


`onDeleteDocHook`

```javascript
// onDeleteDocHook.js
import React from 'react'
const onDeleteDocHook = (Model) => {
  const [deletedDoc, deletedDocSet] = React.useState(null)
  let onDeleteDocEventListener = null

  React.useEffect(() => {
    if (deletedDoc === null) {
      onDeleteDocEventListener = Model.on('delete', (eventObj) => {
        const { error, /* document, foundation, */ data } = eventObj
        if (error) {
          return
        }
        deletedDocSet(data)
      })
    }
  }, [deletedDoc])

  React.useEffect(() => {
    return () => {
      // stop to listen events on component unmount
      Model.stopListenTo(onDeleteDocEventListener)
      onDeleteDocEventListener = null
    }
  }, [])
  return [deletedDoc]
}

export default onDeleteDocHook

```

#### Vue Customer listing component

The same React Customer listing component above can be written on Vue.js (2.0) following this approach:


```javascript
<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 bcustomer-bottom"
    >
      <h1 class="h2">Customers</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <router-link  class="btn btn-sm btn-outline-secondary" to="/Customers/add" tag="button">
             Add new Customer
          </router-link>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Address</th>
            <th  align="right">Cards</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in this.documents" :key="doc.__id">
            <td>{{ doc.name }}</td>
            <td>{{ doc.email }}</td>
            <td>{{ doc.address }}</td>
            <td>{{ doc.cards }}</td>
            <td>
              <router-link  class="primary" :to="`/Customers/edit/${doc.__id}`">[edit]</router-link>
               | <a color='primary' @click="handleDeleteCustomer($event, doc.__id)" href='#'>[delete]</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
/* globals */

import swal from 'sweetalert'
import moment from 'moment'

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export default {
  name: 'Customers',
  components: {},
  props: {},
  data: () => ({
    documents: []
  }),
  async mounted () {
    const { Customer } = this.$foundation.data

    this.onAddDocHandlerListener = Customer.on('add', this.onAddDocHandler)
    this.onEditDocHandlerListener = Customer.on('edit', this.onEditDocHandler)
    this.onDeleteDocHandlerListener = Customer.on(
      'delete',
      this.onDeleteDocHandler
    )

    const findCustomers = await Customer.find({})
    if (findCustomers.error) {
      return
    }
    if (findCustomers.data) {
      console.log(findCustomers.data)
      this.$set(this, 'documents', findCustomers.data)
    }
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy () {
    const { Customer } = this.$foundation.data
    Customer.stopListenTo(this.onAddDocHandlerListener)
    Customer.stopListenTo(this.onEditDocHandlerListener)
    Customer.stopListenTo(this.onDeleteDocHandlerListener)
  },
  methods: {
    moment () {
      return moment
    },
    swal () {
      return swal
    },
    formatter () {
      return formatter
    },
    onAddDocHandler (eventObj) {
      const { error, document, foundation, data } = eventObj
      console.log({ error, document, foundation, data })
      if (error) {
        return
      }
      this.documents.unshift(data)
    },
    onEditDocHandler (eventObj) {
      const { error, document, foundation, data } = eventObj
      console.log({ error, document, foundation, data })
      this.documents.forEach((doc, index) => {
        if (doc.__id === data.__id) {
          this.$set(this.documents, index, data)
        }
      })
    },
    onDeleteDocHandler (eventObj) {
      const { error, document, foundation, data } = eventObj
      console.log({ error, document, foundation, data })
      this.documents.forEach((doc, index) => {
        if (doc.__id === data.__id) {
          this.documents.splice(index, 1)
        }
      })
    },
    async handleDeleteCustomer(e, ___id) {
      console.log(e, ___id)
      const { Customer } = this.$foundation.data
      e.preventDefault()
      // console.error(___id)
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(async (willDelete) => {
        if (willDelete) {
          const r = await Customer.delete(___id)
          // console.error(r)
          if (r.error) {
            swal('Database error', e.error.message, 'error')
            return
          }
          swal('Poof! The order has been deleted!', {
            icon: 'success'
          })
        } else {
          swal('The Customer is safe!')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  /* rtl:remove */
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
  height: auto;
}

.needs-validation {
  overflow: hidden;
}
</style>

```




## Application demos

### React demos
#### React Demo app (Functional components)

<img src="https://i.imgur.com/b29Lsgj.png" width="600" />

[`Demo app`](https://voodux-react-functions-demo.vercel.app/)

[`Demo project`](https://github.com/web2solutions/voodux-react-functions-demo)

`Demo documentation:` -> TODO


#### React Demo app (Context API && Functional components)


<img src="https://i.imgur.com/b29Lsgj.png" width="600" />

[`Demo app`](https://voodux-react-context-api-demo.vercel.app/)

[`Demo project`](https://github.com/web2solutions/voodux-react-context-api-demo)

`Demo documentation:` -> TODO


#### React Demo app (Class based components)

<img src="https://i.imgur.com/E1u5g6y.png" width="600" />

[`Demo app`](https://voodux-react-class-demo.vercel.app/)

[`Demo project`](https://github.com/web2solutions/voodux-react-class-demo)

[`Demo documentation:`](https://web2solutions.github.io/voodux-react-class-demo/)


### Vue Demos

#### Demo #1: Vue, Boostrap, Vue Router, VooduX

<img src="https://i.imgur.com/gGuFnX5.png" width="600" />

[`Demo app`](https://voodux-vue-simple-demo.vercel.app/)

[`Demo project`](https://github.com/web2solutions/voodux-vue-simple-demo)

`Demo documentation:` TODO


### DHTMLX demos


### Vanilla JS demos



## Motivation

[What motivates this](https://github.com/web2solutions/voodux/blob/main/MOTIVATION.md)

## Links and references

### Useful links

Project related resources:

- [Techinical Reference](https://web2solutions.github.io/voodux/code/index.html)
- [Project repository](https://github.com/web2solutions/voodux)
- [Unit tests Report](https://web2solutions.github.io/voodux/reports/unit-testing/index.html)
- [Report an issue](https://github.com/web2solutions/voodux/issues)

### Reference

Knowledge base:

- [PWA - Progressive web applications](https://web.dev/progressive-web-apps/)
- [SPA - Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Mongoose](https://mongoosejs.com/)
- [Server Side Events](https://developer.mozilla.org/pt-BR/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [RAD - Rapid application development](https://en.wikipedia.org/wiki/Rapid_application_development)
- [Case tools](http://www.umsl.edu/~sauterv/analysis/F08papers/View.html)
- [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming)
- [Entity Relationship Model](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
- [Component Engineering](https://en.wikipedia.org/wiki/Component_engineering)
- [Information Systems and Software Engineering - PDF](http://iraj.in/journal/journal_file/journal_pdf/3-248-146294887148-54.pdf)





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


