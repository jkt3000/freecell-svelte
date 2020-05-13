# Svelte FreeCell

Freecell implemented in javascript using Svelte and interact.js.

I spend a few days playing a Freecell app, and decided I wanted to try writing my own Freecell. I thought it would be a great opportunity to learn Svelte too.

In the end, not sure this app is suited for, or needed Svelte, but thought it was a fun experiment to make it work with it. Still barely touched what Svelte is and what it can do, but it was fun learning.

I think this game is 90% complete - end win screen is super lame though. 

Try it here: https://redronin.github.io/


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



![Screenshot](/public/images/freecell_screenshot.png | width=300)



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

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```


## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
cd public
now deploy --name my-project
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
