<img src="https://i.imgur.com/614mA0U.png" width="100" />

# awf - Agnostic Web Foundation


The proposal is about to cover the common lacks and mistakes in modern web applications development by heavly opinionating on how to define a strong foundation for most common types of web based softwares which relies mostly in `V-*` libraries and frameworks like `Vue` and `React`.

It provides a underlying architecture offering resources like:

- Generic `Data Schema` and `Data Model` driven design
- A proxy like `Data API` supporting different transports
- `Data Schema` generators leveraging OpenAPI speficiations (Swagger) as declarative metadata standard
- CRUD interfaces generators targeting React, Vue, DHTMLX and jQwidgets and leveraging OpenAPI speficiations (Swagger) as declarative metadata standard
- Enforced Data Modeling and Data Entities driven design
- Application session
- Realtime Data Sync
- Plugin based `Data Transport` to give you the freedom to back your web software with any kind of `back end technology`
- `Trully multi threaded` architecture by leveraging web workers. Web applications are originally single threaded applications.
- 100% offline capable applications
- Asynchronous and `event driven` architecture.

### Code automation tools

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


TODO


## Links and references


- [Unit tests Report](https://web2solutions.github.io/agnostic-web-foundation/reports/unit-testing/index.html)

- [PWA - Progressive web applications](https://web.dev/progressive-web-apps/)
- [SPA - Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Mongoose](https://mongoosejs.com/)



