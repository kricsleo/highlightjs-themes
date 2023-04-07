import { generateTheme } from '.'
import { SelectorScope, VSCodeTheme } from './types'

/**
 * Prism.js scope -> TextMate(Used by VS Code) scope
 * @see https://macromates.com/manual/en/language_grammars#naming_conventions
 */
const PRISMJS_SCOPE_MAPPINGS = {
  // Prism.js 中的关键字对应于 TextMate 中的关键字
  '.token.keyword': 'keyword',
  // Prism.js 中的运算符对应于 TextMate 中的运算符
  '.token.operator': 'keyword.operator',
  // Prism.js 中的标点符号对应于 TextMate 中的标点符号
  '.token.punctuation': 'punctuation',
  // Prism.js 中的注释对应于 TextMate 中的注释
  '.token.comment': 'comment',
  // Prism.js 中的字符串对应于 TextMate 中的字符串
  '.token.string': 'string',
  // Prism.js 中的数字对应于 TextMate 中的数字
  '.token.number': 'constant.numeric',
  // Prism.js 中的布尔值对应于 TextMate 中的常量
  '.token.boolean': 'constant.language',
  // Prism.js 中的函数名对应于 TextMate 中的函数名
  '.token.function': 'entity.name.function',
  // Prism.js 中的变量名对应于 TextMate 中的变量名
  '.token.variable': 'variable',
  // Prism.js 中的属性名对应于 TextMate 中的属性名
  '.token.property': 'support.type.property-name',
  // Prism.js 中的常量名对应于 TextMate 中的常量名
  '.token.constant': 'constant',
  // Prism.js 中的类名对应于 TextMate 中的类名
  '.token.class-name': 'entity.name.class',
  // Prism.js 中的 CSS 选择器对应于 TextMate 中的支持类型
  '.token.selector': 'support.type',
  // Prism.js 中的 at-rule 对应于 TextMate 中的关键字
  '.token.atrule': 'keyword.control.at-rule',
  // Prism.js 中的 HTML 属性名对应于 TextMate 中的属性名
  '.token.attr-name': 'entity.other.attribute-name',
  // Prism.js 中的 HTML 属性值对应于 TextMate 中的字符串
  '.token.attr-value': 'string',
  // Prism.js 中的 HTML 标签名对应于 TextMate 中的实体名
  '.token.tag': 'entity.name.tag',
  // 其他可能的映射
  '.token.namespace': 'entity.name.namespace',
  '.token.regex': 'string.regexp',
  '.token.important': 'keyword.other.important',
  '.token.builtin': 'support.function.builtin',
  '.token.url': 'markup.underline.link',
  '.token.symbol': 'constant.other.symbol',
  '.token.module': 'support.other.module',
  '.token.type': 'entity.name.type',
  '.token.parameter': 'variable.parameter',
  '.token.label': 'entity.name.label',
  '.token.directive': 'keyword.control.directive',
  '.token.inline': 'markup.inline'
}

export function generatePrismjsTheme(VSCodeTheme: VSCodeTheme) {
  const prismjsSelectorScope = generatePrismjsSelectorScope()
  const theme = generateTheme(prismjsSelectorScope, VSCodeTheme)
  return theme
}

function generatePrismjsSelectorScope() {
  const selectorScope: SelectorScope = {}
  Object.entries(PRISMJS_SCOPE_MAPPINGS).forEach(
    ([prismjsScope, VSCodeScope]) => selectorScope[prismjsScope] = VSCodeScope
  )
  return selectorScope
}