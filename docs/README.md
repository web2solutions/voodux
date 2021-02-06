# React Demo App - Class based components

This is a React application demo leveraging the [Agnostic Web Foundation](https://github.com/web2solutions/agnostic-web-foundation).

`This demo is totaly built using React.Component class.`

`This demo is built using Bootstrap 4.`


### Project Structure

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
│   ├── App.js                    -> React Application code
│   └── main.js                   -> Application entry point
├── test
├── .babelrc                      -> Babel configuration
├── .editorconfig                 -> Some code standards on IDE
├── .eslintignore                 -> eslint ignore rules
├── .eslintrc.json                -> eslint configuration
├── .prettierrc                   -> prettier configuration
├── jsDoc.json                    -> JSDoc configuration
├── package.json
├── server.js                     -> express serving /dist content
└── webpack.config.js              -> webpack configuration
```



## Links

- [Code documentation](https://web2solutions.github.io/agnostic-web-foundation/code/index.html)
- [Unit tests Report](https://web2solutions.github.io/agnostic-web-foundation/reports/unit-testing/index.html)



