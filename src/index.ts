import { VSCodeTheme, VSCodeThemeTokenScope, VSCodeThemeTokenSettings } from './types'
import fs from 'fs/promises'
import path from 'path'
import glob from 'fast-glob'

// highlightjs -> TextMate(Used by VS Code)
const SCOPE_MAP = {
  // 表示关键字，如 if、else、for 等
  "keyword": {
    class: 'hljs-keyword',
    scope: "keyword"
  },
  // 表示内置函数或方法
  "built_in": {
    class: 'hljs-built_in',
    scope: "support.function.builtin"
  },
  // 表示类型定义，如类、结构等
  "type": {
    class: 'hljs-type',
    scope: "entity.name.type"
  },
  // 表示字面量，如 true、false、null 等
  "literal": {
    class: 'hljs-literal',
    scope: "constant.language"
  },
  // 表示数值，如整数、浮点数等
  "number": {
    class: 'hljs-number',
    scope: "constant.numeric"
  },
  // 表示操作符（如 +, -, *, / 等）
  "operator": {
    class: 'hljs-operator',
    scope: "keyword.operator"
  },
  // 表示通用的标点符号
  "punctuation": {
    class: 'hljs-punctuation',
    scope: "punctuation"
  },
  // 表示对象属性
  "property": {
    class: 'hljs-property',
    scope: "support.type.property-name"
  },
  // 表示正则表达式
  "regexp": {
    class: 'hljs-regexp',
    scope: "string.regexp"
  },
  // 表示字符串
  "string": {
    class: 'hljs-string',
    scope: "string"
  },
  // 表示字符转义序列
  "char.escape": {
    class: 'hljs-char escape_',
    scope: "constant.character.escape"
  },
  // 表示嵌入式代码
  "subst": {
    class: 'hljs-subst',
    scope: "meta.embedded"
  },
  // 表示符号，如 Ruby 的符号
  "symbol": {
    class: 'hljs-symbol',
    scope: "constant.other.symbol"
  },
  // 表示类定义
  "class": {
    class: 'hljs-class',
    scope: "entity.name.class"
  },
  // 表示函数定义
  "function": {
    class: 'hljs-function',
    scope: "entity.name.function"
  },
  // 表示变量
  "variable": {
    class: 'hljs-variable',
    scope: "variable"
  },
  // 表示标题，如 Markdown 文档中的标题
  "title": {
    class: 'hljs-title',
    scope: "entity.name.section"
  },
  // 表示函数参数
  "params": {
    class: 'hljs-params',
    scope: "variable.parameter"
  },
  // 表示注释
  "comment": {
    class: 'hljs-comment',
    scope: "comment"
  },
  // 表示元数据，如 HTML 标签中的属性等
  "meta": {
    class: 'hljs-meta',
    scope: "meta"
  },
  // 表示元关键字，如 import、export 等
  "meta.keyword": {
    class: 'hljs-meta keyword_',
    scope: "keyword.control"
  },
  // 表示元字符串，如模板字符串等
  "meta.string": {
    class: 'hljs-meta string_',
    scope: "string.quoted"
  },
  // 表示块级代码（如 Markdown 中的代码块）
  "section": {
    class: 'hljs-section',
    scope: "markup.heading"
  },
  // 表示属性值（如 HTML 标签中的属性值）
  "attr": {
    class: 'hljs-attr',
    scope: "string.unquoted"
  },
  // 表示属性，如 HTML 标签中的属性名
  "attribute": {
    class: 'hljs-attribute',
    scope: "entity.other.attribute-name"
  },
  // 表示行内代码（如 Markdown 中的行内代码）
  "code": {
    class: 'hljs-code',
    scope: "markup.inline"
  },
  // 表示强调
  "emphasis": {
    class: 'hljs-emphasis',
    scope: "markup.italic"
  },
  // 表示加粗
  "strong": {
    class: 'hljs-strong',
    scope: "markup.bold"
  },
  // 表示表达式
  "formula": {
    class: 'hljs-formula',
    scope: "markup.inline"
  },
  // 表示链接，如 Markdown 文档中的超链接
  "link": {
    class: 'hljs-link',
    scope: "markup.underline.link"
  },
  // 表示引用
  "quote": {
    class: 'hljs-quote',
    scope: "string.quoted"
  },
  // 表示 CSS 选择器中的标签名
  "selector-tag": {
    class: 'hljs-selector-tag',
    scope: "entity.name.tag"
  },
  // 表示 CSS 选择器中的 ID 选择器
  "selector-id": {
    class: 'hljs-selector-id',
    scope: "entity.other.attribute-name.id"
  },
  // 表示 CSS 选择器中的类选择器
  "selector-class": {
    class: 'hljs-selector-class',
    scope: "entity.other.attribute-name.class"
  },
  // 表示 CSS 选择器中的属性选择器
  "selector-attr": {
    class: 'hljs-selector-attr',
    scope: "entity.other.attribute-name"
  },
  // 表示 CSS 选择器中的伪类和伪元素
  "selector-pseudo": {
    class: 'hljs-selector-pseudo',
    scope: "entity.other.pseudo-class"
  },
  // 表示模板变量
  "template-variable": {
    class: 'hljs-template-variable',
    scope: "variable.other.readwrite"
  },
  // 表示模板标签
  "template-tag": {
    class: 'hljs-template-tag',
    scope: "entity.name.tag"
  },
  // 表示添加的代码，如 diff 输出中的新增行
  "addition": {
    class: 'hljs-addition',
    scope: "markup.inserted"
  },
  // 表示删除的代码，如 diff 输出中的删除行
  "deletion": {
    class: 'hljs-deletion',
    scope: "markup.deleted"
  },
  // 表示语言特定的变量（如 this、super 等）
  "variable.language": {
    class: 'hljs-variable language_',
    scope: "variable.language"
  },
  // 表示常量变量
  "variable.constant": {
    class: 'hljs-variable constant_',
    scope: "variable.other.constant"
  },
  // 表示类名
  "title.class": {
    class: 'hljs-title class_',
    scope: "entity.name.class"
  },
  // 表示继承的类名
  "title.class.inherited": {
    class: 'hljs-title class_ inherited__',
    scope: "entity.other.inherited-class"
  },
  // 表示函数名
  "title.function": {
    class: 'hljs-title function_',
    scope: "entity.name.function"
  },
  // 表示函数调用
  "title.function.invoke": {
    class: 'hljs-title function_ invoke__',
    scope: "meta.function-call"
  },
  // 表示文档标签（如 JSDoc 中的 @param）
  "doctag": {
    class: 'hljs-doctag',
    scope: "comment.block.documentation.tag"
  },
  // 表示命令提示符（如 shell 中的 $）
  "meta.prompt": {
    class: 'hljs-meta prompt_',
    scope: "markup.raw"
  },
  // 表示HTML/XML标签
  "tag": {
    class: 'hljs-tag',
    scope: "entity.name.tag"
  },
  // 表示标签名
  "name": {
    class: 'hljs-name',
    scope: "entity.name"
  },
  // 表示列表符号（如 Markdown 中的 *、1. 等）
  "bullet": {
    class: 'hljs-bullet',
    scope: "markup.list"
  },
};

export function generateHljsTheme(theme: VSCodeTheme) {
  let css = Object.values(SCOPE_MAP).reduce((all, option) => {
    const style = parseVSCodeScopeStyle(option.scope, theme)
    if(style) {
      const className = option.class
        .split(' ')
        .map(t => '.' + t)
        .join('')
      all += `${className} ${style}\n`
    }
    return all
  }, '')
  css = `.hljs {
  color:${theme.colors['editor.foreground']};
  background:${theme.colors['editor.background']};
}\n` + css
  return css
}

export async function generateHljsCSS(VSCodeThemePath: string, hljsCSSDist: string) {
  const content = await fs.readFile(VSCodeThemePath, { encoding: 'utf-8'})
  const theme = JSON.parse(content)
  const css = generateHljsTheme(theme)
  const filename = `${normalizeThemeName(theme.name)}.css`
  const filepath = path.resolve(hljsCSSDist, filename)
  await fs.writeFile(filepath, css)
}

export async function batchGenerateHljsCSS(VSCodeThemeSource: string | string[], hljsCSSDist: string) {
  const files = await glob(VSCodeThemeSource, { absolute: true })
  console.log('files', VSCodeThemeSource, files)
  await Promise.all(files.map(file => generateHljsCSS(file, hljsCSSDist)))
}

function parseVSCodeScopeStyle(scope: string, theme: VSCodeTheme) {
  const tokenMatchScores = theme.tokenColors.map(token => ({
    token, 
    score: scoreScopeMatch(scope, token.scope)
  }))
  const maxMatchedToken = tokenMatchScores.reduce((all, cur) => cur.score > all.score ? cur : all, tokenMatchScores[0])
  return maxMatchedToken.score
    ? formatVSCodeTokenStyle(maxMatchedToken.token.settings)
    : null
}

function scoreScopeMatch(sourceScope: string, targetScope: VSCodeThemeTokenScope): number {
  if(Array.isArray(targetScope)) {
    const isExactlyMathched = targetScope.some(s => s === sourceScope)
    if(isExactlyMathched) {
      return Infinity
    } else {
      const scores = targetScope.map(s => scoreScopeMatch(sourceScope, s))
      const maxScore = scores.reduce((all, cur) => Math.max(all, cur), 0)
      return maxScore
    }
  } else {
    if(sourceScope === targetScope) {
      return Infinity
    } else {
      const sourceTokens = sourceScope.split('.')
      const targetTokens = targetScope.split('.')
      let score = 0
      while(sourceTokens.length && targetTokens.length) {
        const sourceToken = sourceTokens.shift()
        const targetToken = targetTokens.shift()
        if(sourceToken === targetToken) {
          score += 1
        } else {
          break;
        }
      }
      return score
    }
  }
}

function formatVSCodeTokenStyle(settings: VSCodeThemeTokenSettings) {
  const mappings = [
    ['color', settings.foreground],
    ['background', settings.background],
    ['font-style', settings.fontStyle],
  ]
  const styles = mappings.filter(mapping => mapping[1])
    .map(mapping => `${mapping[0]}:${mapping[1]};`)
    .join('\n')
  return styles ? `{\n  ${styles}\n}` : null
}

function normalizeThemeName(name: string) {
  const hyphenateRE = /\B([A-Z\s])/g
  return name.trim()
    .replace(/\s/g, '-')
    .replace(hyphenateRE, '-$1')
    .toLowerCase()
}