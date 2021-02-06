<img src="https://i.imgur.com/614mA0U.png" width="200" />

# awf - Agnostic Web Foundation

> The missing building block for enterprise and modern web applications

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


[![CircleCI](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/main.svg?style=svg&circle-token=fcfee86b26bbb793653443c248645b779aa3d80b)](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/main) Main branch at Circle CI

[![CircleCI](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/release.svg?style=svg&circle-token=fcfee86b26bbb793653443c248645b779aa3d80b)](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/release) Release branch at Circle CI


[![CircleCI](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/develop.svg?style=svg&circle-token=fcfee86b26bbb793653443c248645b779aa3d80b)](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/develop) Develop branch at Circle CI




### Code Docs (DRAFT)

https://web2solutions.github.io/agnostic-web-foundation/




### React Demo app (Functional components)


<img src="https://i.imgur.com/b29Lsgj.png" width="600" />

`Demo app:`

https://agnostic-web-foundation-react-functions-demo.vercel.app/

`Demo project:`

https://github.com/web2solutions/agnostic-web-foundation-react-functions-demo

`Demo documentation:`

TODO


### React Demo app (Class based components)

<img src="https://i.imgur.com/E1u5g6y.png" width="600" />


`Demo app:`

https://agnostic-web-foundation-react-class-demo.vercel.app/

`Demo project:`

https://github.com/web2solutions/agnostic-web-foundation-react-class-demo

`Demo documentation:`

https://web2solutions.github.io/agnostic-web-foundation-react-class-demo/




### Vue Demo app - todo


## The Problem

Paradigms like `SPA (Single Page Application)`, `PWA (Progressive Web Applications)` and `Serverless Applications` are, in fact, at least 10 years old. Not least, the "enterprise web" advent is nothing something new too.


The web based softwares are in hype as it ever have been before. 

There are a lot of libraries and framework out there doing good jobs in several areas: 

1. `Project Standards`

    Backbone, React, Vue, Angular

2. `UI components`

    Dojo, Sencha (ExtJS), DHTMLX, Vuetify

3. `Reactivity`

    Backbone, React, Vue, Angular, RxJS, Dojo, Sencha (ExtJS), DHTMLX



One common sense in every engineering field is: `There is no single silver bullets for all existing problems`.

This is where the hell begins.

There is a giant hype wave over React and Vue, which actually are top game players, but not for all the matches.

They are likely the `V` in on the `MVC` acronym. And in terms of `Project Standards`, that is all they care about.

They usualy try to solve `application data` issues, but their proposed solutions are not like the `M` on the `MVC` acronym, because they are mostly focused in the `application state` rather than the `application data`. They mainly rely on browser memory to persist data.

There is no problem on those solutions, not at least in a `project standard` perspective, because they ain't try to solve `M` and `C` problems necessarily. They might being over estimated, or people is still under estimating the web capabilities.

By mistake, developers and teams are mostly focusing on the `V` layer and ignoring a `possibly required` underlying foundation architecture. Which finally increases the code complexity of those `View` or `Component` layers, because they are trying to resolve problems that should not being handled in that domain.

In another side, Angular and Backbone, certainly behind a biggest learning curve, provide `MVC` based driven development, but they don't care about scaling `data storage` and `data handling` and support to `offline scenarios`.

It feels like they fits very good for `non-complex` scenarios and let you take your own decisions when complex data requirements and scalability start knocking at your doors.

By the way, there is a powerful web technology which still not being widely used and, in my opinion, is a game changer in web based software development: IndexedDB. A NoSQL database shipped with every modern browsers at least since 2005. IndexedDB can also be used in Electron and mobile applications.


### Non Functional requirements might completely differs

Web based softwares may differs a lot to each other in terms of `non Functional Requirements` and if we divide those in 2 main groups, such as `enterprise` and `non enterprise`, we could easily realize the common differences.

Based on those 2 groups, I'm going to hypothetically describe 2 list of requirements which are mainly related to my proposal:


`Enterprise Web Softwares:`

1. Predictable Network requirements

- Unstable internet connection
- No internet connectivity
- Low internet speed
- Expensive network band
- HTTP based services back end
- P2P back end (WebRTC)

2. Predictable Data and Storage requirements

- High amount of data
- Cache is required
- offline data availability is required


3. Predictable Project Standards requirements

- MVC architectures
- Component engineering


4. Predictable Development requirements

- Product Planning
- Software documentation
- Manual, massive and repetitive tasks like writing CRUD based interfaces and data validation routines


`Non Enterprise Web Softwares:`

1. Predictable Network requirements

- Unstable internet connection
- No internet connectivity
- Low internet speed
- HTTP based services back end
- P2P back end (WebRTC)

2. Predictable Data and Storage requirements

- Low amount of data
- Cache is not required
- offline data availability is not required

3. Predictable Project Standards requirements

- V-\* based architecture for smaller systems
- Component engineering

4. Predictable Development requirements

- Product Planning
- Software documentation
- Manual, massive and repetitive tasks like writing CRUD based interfaces and data validation routines


## Developers are mistakenly looking to write code first

The common reasons of failing software projects could be enumerated as follow:

1. Lack of clear goals and paths
2. Lack of Non Functional requirements scope
3. Lack of Functional requirements scope
4. Lack of a planned and well established architecture
5. Lack of a Design and Data Modeling driven development process


Except for the item #3, which always will be a new problem to solve on every new debuting softwares, we can addres all problems by adopting some simple, but a batlle tested software development workflow which is the following:


1. Brainstorming and planning
2. Requirements and feasibility analysis
3. Design
4. Coding
5. Integration and testing
6. Implementation and deployment
7. Maintenance and Operations




## The solution

In resume: To focus on a solid `Software development lifecycle` and to rely more on modern web technologies already available on the play ground.

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
