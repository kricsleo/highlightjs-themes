/**
 * highlightjs scope -> TextMate(Used by VS Code) scope
 * @see https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html#stylable-scopes
 * @see https://macromates.com/manual/en/language_grammars#naming_conventions
 */
export const SCOPE_MAPPINGS = {
  // 表示关键字，如 if、else、for 等
  "keyword": 'keyword',
  // 表示内置函数或方法
  "built_in": 'support',
  // 表示类型定义，如类、结构等
  "type": 'meta.type',
  // 表示字面量，如 true、false、null 等
  "literal": "constant.language",
  // 表示数值，如整数、浮点数等
  "number": "constant.numeric",
  // 表示操作符（如 +, -, *, / 等）
  "operator": "keyword.operator",
  // 表示通用的标点符号
  "punctuation": 'punctuation',
  // 表示对象属性
  "property": 'variable.other.property',
  // 表示正则表达式
  "regexp": "string.regexp",
  // 表示字符串
  "string": 'string',
  // 表示字符转义序列
  "char.escape": 'constant.character.escape',
  // todo 表示嵌入式代码
  "subst": "meta.embedded",
  // todo 表示符号，如 Ruby 的符号
  "symbol": 'constant.other.symbol',
  // todo 表示类定义 or entity.name.class
  "class": 'entity.name.type.class',
  // 表示函数定义
  "function": 'entity.name.function',
  // 表示变量
  "variable": 'variable',
  // 表示语言特定的变量（如 this、super 等）
  "variable.language": "variable.language",
  // 表示常量变量
  "variable.constant": 'variable.other.constant',
  "title": 'entity.name',
  // 表示类名
  "title.class": 'entity.name.type.class',
  // 表示继承的类名
  "title.class.inherited": 'entity.other.inherited-class',
  // 表示函数名
  "title.function": 'entity.name.function',
  // 表示函数调用
  "title.function.invoke": 'entity.name.function',
  // 表示函数参数
  "params": 'variable.parameter',
  // 表示注释
  "comment": 'comment',
  // todo 表示文档标签（如 JSDoc 中的 @param）
  "doctag": 'storage.type.class',
  // todo 表示元数据，如 HTML 标签中的属性等
  "meta": 'meta',
  // todo 表示命令提示符（如 shell 中的 $）
  "meta.prompt": "markup.raw",
  // 表示元关键字，如 import、export 等
  "meta.keyword": "keyword.control",
  // 表示元字符串，如模板字符串等
  "meta.string": "string.quoted",
  // 表示块级代码（如 Markdown 中的代码块）
  "section": "markup.heading",
  // 表示HTML/XML标签
  "tag": "meta.tag",
  // 表示标签名
  "name": 'entity.name.tag',
  // 表示属性值（如 HTML 标签中的属性值）
  "attr": 'entity.other.attribute-name',
  // 表示属性，如 HTML 标签中的属性名
  "attribute": 'support.type.property-name',
  // 表示列表符号（如 Markdown 中的 *、1. 等）
  "bullet": "markup.list",
  // 表示行内代码（如 Markdown 中的行内代码）
  "code": 'markup.fenced_code.block',
  // 表示强调
  "emphasis": "markup.italic",
  // 表示加粗
  "strong": "markup.bold",
  // todo 表示表达式
  "formula": "markup.inline",
  // 表示链接，如 Markdown 文档中的超链接
  "link": "markup.underline.link",
  // 表示引用
  "quote": 'markup.quote',
  // 表示 CSS 选择器中的标签名
  "selector-tag": "entity.name.tag",
  // 表示 CSS 选择器中的 ID 选择器
  "selector-id": 'entity.other.attribute-name.id',
  // 表示 CSS 选择器中的类选择器
  "selector-class": 'entity.other.attribute-name.class',
  // 表示 CSS 选择器中的属性选择器
  "selector-attr": "entity.other.attribute-name",
  // 表示 CSS 选择器中的伪类和伪元素
  "selector-pseudo": 'entity.other.attribute-name.pseudo-class',
  // 表示模板标签
  "template-tag": "entity.name.tag",
  // 表示模板变量
  "template-variable": "variable.other.readwrite",
  // 表示添加的代码，如 diff 输出中的新增行
  "addition": "markup.inserted",
  // 表示删除的代码，如 diff 输出中的删除行
  "deletion": "markup.deleted",
};