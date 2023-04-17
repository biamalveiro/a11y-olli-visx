### 👩🏽‍🔬 Experiment: Next.js + Olli + visx

This repository contains a small experiment/demo of using the [Olli](https://mitvis.github.io/olli/) library in a Next.js application.
Following the library documentation, a Vega-Lite specification is used to describe the chart, so that Olli can generate the treeview from it. However, the chart rendering is done using visx and SVG instead of Vega.

There is also a custom `useOlli` hook to provide a more React-friendly way of using the library.

Small Next.js note: Seems that if you try to use Olli with server-side rendering (SSR), you may encounter a document is not defined error. To work around this issue, the respective component is dynamically loadedon the client-side to disable server-rendering.

Kudos to [Olli](https://mitvis.github.io/olli/), for enabling more accessible charts! ⭐️
