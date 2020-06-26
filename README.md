# Svelte FreeCell

Freecell implemented in javascript using Svelte and interact.js.


### Try it here: https://redronin.github.io/freecell-svelte/

*(First page load is slow as it loads images of playing cards)*

I spend a few days playing a Freecell app, and decided I wanted to try writing my own Freecell. I thought it would be a great opportunity to learn Svelte too.

In the end, not sure this app is suited for, or needed Svelte, but thought it was a fun experiment to make it work with it. Still barely touched what Svelte is and what it can do, but it was fun learning.

I think this game is 90% complete - end win screen is super lame though. 


* Should work on ipads, iphones and desktop
* handles touch/drag on mobile
* click card to auto-complete move if possible
* enter in game # from MS Freecell and will bring up same game - uses same randomizer/seeding algorithm

#### Todo

* Has a very lame win screen - make it better. Like win animations in original game
* No sounds yet
* Make it better (currently not great coding - but I was just learning what Svelte is.)
* support http://url?id=xxxx to fire up certain game # of Freecell
* easy to send link of certain game # - like share button


<img src="/public/images/freecell_screenshot.png" width="300"/>


*Looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started


### Installing

    yarn add parcel-bundler --dev

    yarn add --dev svelte
    yarn add --dev parcel-plugin-svelte
    yarn add --dev parcel-bundler
    yarn add --dev sass
    yarn add node-sass
    yarn add --dev @babel/core @babel/preset-env @babel/plugin-proposal-class-properties
    yarn add core-js
    yarn add svelte-preprocess
    yarn add interactjs
    yarn add moment

Add scripts in package.json


*** to publish pages to github pages, need to make output dir ./ so that files served are relative, to work with relative paths. ***



### Running locally

yarn dev

### To build for publishing to github pages

yarn clean; yarn build
