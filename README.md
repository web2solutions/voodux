#   <img src="https://avatars3.githubusercontent.com/u/14809007?s=280&v=4" width="50" />  Agnostic Web Foundation

Agnostic Foundation for Web Applications - DRAFT

> `CI status` [![CircleCI](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/main.svg?style=svg&circle-token=fcfee86b26bbb793653443c248645b779aa3d80b)](https://circleci.com/gh/web2solutions/agnostic-web-foundation/tree/main)



> ˜Web based software development is serious˜

> "The use of data modeling standards is strongly recommended for all projects requiring a standard means of defining and analyzing data within an organization"


## The Problem

Paradigms like `SPA (Single Page Application)`, `PWA (Personal Web Applications)` and `Serverless Applications` are, in fact, at least 10 years old. Not least, the "enterprise web" advent is nothing something new too.


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

