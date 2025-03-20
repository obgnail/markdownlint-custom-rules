# markdownlint-rule-math

> A markdownlint rule that Math Blocks should be surrounded by blank lines.


## Use

```javascript
import { lint } from "markdownlint/async"
import { applyFixes } from "markdownlint"
import MD101 from "./dist/MD101.esm"

const content = `
LineBefore
$$
1+2
$$
LineAfter
`
const config = { "default": true, strings: { content }, customRules: [ MD101 ] }

async function main() {
    const lintError = await lint(config)
    console.log(lintError)

    console.log("-----")

    const fixInfo = lintError.content
    const fixed = applyFixes(content, fixInfo)
    console.log(fixed)
}

main()
```



## Use in Typora

I have integrated this feature into [typora_plugin](https://github.com/obgnail/typora_plugin).



![markdownlint-rule-math](./assets/markdownlint-rule-math.gif)



## References

- [markdownlint](https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md)