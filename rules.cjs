const { addErrorContext, isBlankLine } = require("markdownlint-rule-helpers")
const { getParentOfType, filterByTypes } = require("markdownlint-rule-helpers/micromark")

const mathBlockPrefixRe = /^(.*?)[$\[]/

// eslint-disable-next-line jsdoc/valid-types
/** @typedef {readonly string[]} ReadonlyStringArray */

/**
 * Adds an error for the top or bottom of a math fence.
 *
 * @param {import("markdownlint").RuleOnError} onError Error-reporting callback.
 * @param {ReadonlyStringArray} lines Lines of Markdown content.
 * @param {number} lineNumber Line number.
 * @param {boolean} top True if top math.
 * @returns {void}
 */
function addError(onError, lines, lineNumber, top) {
    const line = lines[lineNumber - 1]
    const [, prefix] = line.match(mathBlockPrefixRe) || []
    const fixInfo = (prefix === undefined) ?
        undefined :
        {
            "lineNumber": lineNumber + (top ? 0 : 1),
            "insertText": `${prefix.replace(/[^>]/g, " ").trim()}\n`
        }
    addErrorContext(
        onError,
        lineNumber,
        line.trim(),
        undefined,
        undefined,
        undefined,
        fixInfo
    )
}

const MD101 = {
    "names": ["MD101", "math-surrounded-by-blank-lines"],
    "description": "Math Blocks should be surrounded by blank lines",
    "tags": ["math", "blank_lines"],
    "parser": "micromark",
    "function": (params, onError) => {
        const listItems = params.config.list_items
        const includeListItems = (listItems === undefined) ? true : !!listItems
        const { lines } = params

        for (const mathBlock of filterByTypes(params.parsers.micromark.tokens, ["mathFlow"])) {
            if (includeListItems || !(getParentOfType(mathBlock, ["listOrdered", "listUnordered"]))) {
                if (!isBlankLine(lines[mathBlock.startLine - 2])) {
                    addError(onError, lines, mathBlock.startLine, true)
                }
                if (!isBlankLine(lines[mathBlock.endLine]) && !isBlankLine(lines[mathBlock.endLine - 1])) {
                    addError(onError, lines, mathBlock.endLine, false)
                }
            }
        }
    }
}

const MD102 = {
    names: ["MD102", "no-entirely-strong-heading"],
    description: "Heading text should not be entirely bold",
    tags: ["headings", "atx", "atx_closed", "emphasis"],
    parser: "micromark",
    "function": function MD102(params, onError) {
        const headings = filterByTypes(params.parsers.micromark.tokens, ["atxHeading"])
        for (const heading of headings) {
            const headingTextToken = heading.children.find(e => e.type === "atxHeadingText")
            if (!headingTextToken || headingTextToken.children.length !== 1) continue

            let token = headingTextToken.children[0]
            if (token.type === "emphasis") {
                const emphasisText = token.children.find(e => e.type === "emphasisText")
                if (emphasisText.children.length !== 1) continue
                token = emphasisText.children[0]
            }
            if (token.type === "strong") {
                const strongTextToken = token.children.find(e => e.type === "strongText")
                if (!strongTextToken) continue

                const text = strongTextToken.text
                const column = token.startColumn
                const length = token.endColumn - column
                addErrorContext(
                    onError,
                    token.startLine,
                    token.text.trim(),
                    undefined,
                    undefined,
                    [column, length],
                    {
                        editColumn: column,
                        deleteCount: length,
                        insertText: text,
                    }
                )
            }
        }
    }
}

module.exports = [MD101, MD102]
