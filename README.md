<a href="https://github.com/nag763/electron-football-app/blob/main/LICENSE.md" alt="License"><img src="https://img.shields.io/bower/l/bootstrap"></a>
<a href="https://github.com/nag763/electron-football-app/releases/latest" alt="GitHub release"><img src="https://img.shields.io/github/v/release/nag763/electron-football-app" ></a>
<a href="" alt="issues"><img src="https://img.shields.io/github/issues/nag763/electron-football-app"></a>

<p align="center"><img src="https://github.com/nag763/electron-football-app/blob/main/icons/icon.png"></img></p>

<h2 align="center">UnFootball</h2>
<h4 align="center">An electron based football app</h4>

![program.gif](./program.gif)

## Get the app

### Direct download

- Latest version can be found [here](https://github.com/nag763/electron-football-app/releases/latest).

### Building from source code

1. Download the project

```
git clone https://github.com/nag763/electron-football-app
```

2. Build the project

```
cd electron-football-app
npm install
```

3. Run the project

```
npm start
```

## General information

- Maintener : LABEYE Loïc <loic.labeye@pm.me>

- Technologies used :

  - Javascript

  - Electron

  - Atom IDE

  - Ubuntu OS

## Project architecture

- bin : binaries

- doc : Documentation of the application

- icons : List of icons used in app

- js : Javascript used to do the calls to the apis and modifiy the display

- reports : Reports of the tests, lints and cloc

- views : html views

## TODO

-   [x] Change logo

-   [X] Do JSDOC

-   [X] Catch errors

-   [ ] Handle XSS atacks

-   [ ] Toasts for errors

-   [X] ESlints fixs

-   [ ] Make a better UI

-   [ ] Implement UT and CI

## Known issues

-   [X] Players not fetched from gets on researchs

-   [X] Red card not displayed anymore.

-   [X] Latest fixtures in team.html not displaying final score.

-   [X] Issue with the away coach never being displayed.

-   [ ] If the starting XI is not available an error is being displayed.

-   [ ] Issue with latest infos, if 60 < mins, only the mins are displayed but not the hours.
