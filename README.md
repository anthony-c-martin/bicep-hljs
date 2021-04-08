# bicep-hljs

**In progress - contributilons welcome**

This is a prototype at adding Bicep support to [highlightJS](https://highlightjs.org/).

## Code pointers
* grammar: [src/bicep.ts](./src/bicep.ts)
* tests: [test/bicep.test.ts](./test/bicep.test.ts)
* baselines: [test/baselines](./test/baselines)

## Running
* Initialize the repo:
    ```sh
    npm i
    ```
* Run the baseline tests:
    ```sh
    npm test
    ```
* Build the library:
    ```sh
    npm run build
    ```
* Preview baseline files:
    * Open any of the `.html` files in `test/baselines` with a browser to preview the syntax highlighting.
