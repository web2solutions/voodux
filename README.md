#   <img src="https://avatars3.githubusercontent.com/u/14809007?s=280&v=4" width="50" />  Agnostic Web Foundation

Agnostic Foundation for Web Applications - DRAFT

> ˜Web based software development is serious˜

> "The use of data modeling standards is strongly recommended for all projects requiring a standard means of defining and analyzing data within an organization"



## The Problem

Paradigms like `SPA (Single Page Application)`, `PWA (Personal Web Applications)` and `Serverless Applications` are, in fact, at least 10 years old. But the "enterprise web" advent is relatively younger.

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

By mistake, most developers and teams are mostly focusing on the `V` layer and ignoring a `possibly required` underlying foundation architecture.

In another side, Angular and Backbone provide `MVC` based driven development, but they don't care about scaling `data storage` and `data handling` and support to `offline scenarios`.

By the way, there is a powerful web technology which still not being widely used and, in my opinion, is a game changer in web based software development: IndexedDB. A NoSQL database that runs on browsers at least since 2005. IndexedDB can also be used in Electron and mobile applications.


### Non Functional requirements might completely differs

Web based softwares may differs a lot to each other in terms of `non Functional Requirements` and if we divide those in 2 main groups, such as `enterprise` and `non enterprise`, we could easily realize the commom differences.

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

The commom reasons for failing software projects could me enumerated as:

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

The proposal is about to cover the common lacks and mistakes in modern web applications development by heavly opinionating on how to define a strong foundation for most commom types of web based softwares which relies mostly in `V-*` libraries and frameworks like `Vue` and `React`.

It provides a underlying architecture offering resources like:

- Generic `Data Schema` and `Data Model` driven design
- A proxy like `Data API` supporting different transports and asynchronous and event driven architecture.
- `Data Schema` generators based on OpenAPI specifications (Swaggger)
- CRUD generators
- Enforced Data Modeling and Data Entities driven design
- Application session
- Realtime Data Sync


Despite the fact there are available MVC frameworks out there for some years already
