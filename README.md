# markdownlint-rule-math

> A markdownlint rule that Math Blocks should be surrounded by blank lines.


## Use

```javascript
import { lint } from "markdownlint/promise"
import { applyFixes } from "markdownlint"
import MD101 from "./MD101.esm.js"

const content = `
LineBefore
$$
1+2
$$
LineAfter
`
const config = { "default": true, strings: { content }, customRules: [MD101] }

lint(config).then(result => {
    const fixed = applyFixes(content, result.content)
    console.log(fixed)
})

// LineBefore
//
// $$
// 1+2
// $$
//
// LineAfter
```



## Use in Typora

I have integrated this feature into [typora_plugin](https://github.com/obgnail/typora_plugin).



![markdownlint-rule-math](./assets/markdownlint-rule-math.gif)



## References

- [markdownlint](https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md)