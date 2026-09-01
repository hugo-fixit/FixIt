(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define([], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.pangu = factory());
})(this, function() {
	//#region src/shared/index.ts
	var CJK_RADICALS_SUPPLEMENT = "⺀-⻿";
	var KANGXI_RADICALS = "⼀-⿟";
	var HIRAGANA = "぀-ゟ";
	var KATAKANA_NO_MIDDLE_DOT = "゠-ヺー-ヿ";
	var BOPOMOFO = "㄀-ㄯ";
	var ENCLOSED_CJK_LETTERS_AND_MONTHS = "㈀-㋿";
	var CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A = "㐀-䶿";
	var CJK_UNIFIED_IDEOGRAPHS = "一-鿿";
	var CJK_COMPATIBILITY_IDEOGRAPHS = "豈-﫿";
	var GREEK_AND_COPTIC = "Ͱ-Ͽ";
	var LATIN_1_SUPPLEMENT_AFTER_NBSP = "¡-ÿ";
	var NUMBER_FORMS = "⅐-↏";
	var DINGBATS = "✀-➿";
	var CJK = `${CJK_RADICALS_SUPPLEMENT}${KANGXI_RADICALS}${HIRAGANA}${KATAKANA_NO_MIDDLE_DOT}${BOPOMOFO}${ENCLOSED_CJK_LETTERS_AND_MONTHS}${CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A}${CJK_UNIFIED_IDEOGRAPHS}${CJK_COMPATIBILITY_IDEOGRAPHS}`;
	var AN = "A-Za-z0-9";
	var A = "A-Za-z";
	var UPPER_AN = "A-Z0-9";
	var OPERATORS_WITH_HYPHEN = `\\+\\*=&\\-`;
	var OPERATORS_NO_PLUS = "\\*=&\\-";
	var GRADE_OPERATORS = "\\+\\-\\*";
	var QUOTES = "`\"״";
	var LEFT_BRACKETS_BASIC = "\\(\\[\\{";
	var RIGHT_BRACKETS_BASIC = "\\)\\]\\}";
	var LEFT_BRACKETS_EXTENDED = "\\(\\[\\{<>“";
	var RIGHT_BRACKETS_EXTENDED = "\\)\\]\\}<>”";
	var ANS_CJK_AFTER = `${A}${GREEK_AND_COPTIC}0-9@\\$%\\^&\\*\\-\\+\\\\=${LATIN_1_SUPPLEMENT_AFTER_NBSP}${NUMBER_FORMS}${DINGBATS}`;
	var ANS_BEFORE_CJK = `${A}${GREEK_AND_COPTIC}0-9\\$%\\^&\\*\\-\\+\\\\=${LATIN_1_SUPPLEMENT_AFTER_NBSP}${NUMBER_FORMS}${DINGBATS}`;
	var FILE_PATH_DIRS = "home|root|usr|etc|var|opt|tmp|dev|mnt|proc|sys|bin|boot|lib|media|run|sbin|srv|node_modules|path|project|src|dist|test|tests|docs|templates|assets|public|static|config|scripts|tools|build|out|target|your|\\.claude|\\.git|\\.vscode";
	var FILE_PATH_CHARS = "[A-Za-z0-9_\\-\\.@\\+\\*]+";
	var UNIX_ABSOLUTE_FILE_PATH = new RegExp(`/(?:\\.?(?:${FILE_PATH_DIRS})|\\.(?:[A-Za-z0-9_\\-]+))(?:/${FILE_PATH_CHARS})*`);
	var UNIX_RELATIVE_FILE_PATH = new RegExp(`(?:\\./)?(?:${FILE_PATH_DIRS})(?:/${FILE_PATH_CHARS})+`);
	var WINDOWS_FILE_PATH = /[A-Z]:\\(?:[A-Za-z0-9_\-\. ]+\\?)+/;
	var ANY_CJK = new RegExp(`[${CJK}]`);
	var CJK_PUNCTUATION = new RegExp(`([${CJK}])([!;,\\?:]+)(?=[${CJK}${AN}])`, "g");
	var PUNCTUATION_CJK = new RegExp(`([!;,\\?]+)(?=[${CJK}])`, "g");
	var CJK_TILDE = new RegExp(`([${CJK}])(~+)(?!=)(?=[${CJK}${AN}])`, "g");
	var CJK_TILDE_EQUALS = new RegExp(`([${CJK}])(~=)`, "g");
	var CJK_PERIOD = new RegExp(`([${CJK}])(\\.)(?![${AN}\\./])(?=[${CJK}${AN}])`, "g");
	var AN_PERIOD_CJK = new RegExp(`([${AN}])(\\.)([${CJK}])`, "g");
	var AN_COLON_CJK = new RegExp(`([${AN}])(:)([${CJK}])`, "g");
	var DOTS_CJK = new RegExp(`([\\.]{2,}|\u2026)([${CJK}])`, "g");
	var FIX_CJK_COLON_ANS = new RegExp(`([${CJK}])\\:([${UPPER_AN}\\(\\)])`, "g");
	var CJK_QUOTE = new RegExp(`([${CJK}])([${QUOTES}])`, "g");
	var QUOTE_CJK = new RegExp(`([${QUOTES}])([${CJK}])`, "g");
	var FIX_QUOTE_ANY_QUOTE = new RegExp(`([${QUOTES}]+)[ ]*([\\s\\S]+?)[ ]*([${QUOTES}]+)`, "g");
	var QUOTE_AN = new RegExp(`([\u201d])([${AN}])`, "g");
	var CJK_QUOTE_AN = new RegExp(`([${CJK}])(")([${AN}])`, "g");
	var CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp(`([${CJK}])('[^s])`, "g");
	var SINGLE_QUOTE_CJK = new RegExp(`(')([${CJK}])`, "g");
	var FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp(`([${AN}${CJK}])( )('s)`, "g");
	var SINGLE_QUOTE_PURE_CJK = new RegExp(`(')([${CJK}]+)(')`, "g");
	var HASH_ANS_CJK_HASH = new RegExp(`([${CJK}])(#)([${CJK}]+)(#)([${CJK}])`, "g");
	var CJK_HASH = new RegExp(`([${CJK}])(#([^ \\u00a0]))`, "g");
	var HASH_CJK = new RegExp(`(([^ \\u00a0])#)([${CJK}])`, "g");
	var CJK_FINAL_HASHTAG = new RegExp(`([^/])([${CJK}])(#[A-Za-z0-9]+)$`);
	var CJK_OPERATOR_ANS = new RegExp(`([${CJK}])([${OPERATORS_WITH_HYPHEN}])([${AN}])`, "g");
	var ANS_OPERATOR_CJK = new RegExp(`([${AN}${RIGHT_BRACKETS_BASIC}])([${OPERATORS_NO_PLUS}])([${CJK}])`, "g");
	var CJK_SLASH_CJK = new RegExp(`([${CJK}])([/])([${CJK}])`, "g");
	var CJK_SLASH_ANS = new RegExp(`([${CJK}])([/])([${AN}])`, "g");
	var ANS_SLASH_CJK = new RegExp(`([${AN}])([/])([${CJK}])`, "g");
	var PIPE_CJK_CONTACT = new RegExp(`[${CJK}]\\||\\|[${CJK}]`);
	var PIPE_SEPARATOR = /([^\s|])[ ]*(\|+)[ ]*(?=[^\s|])/g;
	var PLUS_CJK_CONTACT = new RegExp(`[${CJK}]\\+|\\+[${CJK}]`);
	var PLUS_SEPARATOR = /(?<=[^\s+])\+(?=[^\s+])/g;
	var SINGLE_LETTER_GRADE_CJK = new RegExp(`\\b([${A}])([${GRADE_OPERATORS}])([${CJK}])`, "g");
	var CJK_SIGN_DIGIT = new RegExp(`([${CJK}])(\\+)([0-9])`, "g");
	var CJK_HYPHEN_FLAG = new RegExp(`([${CJK}])(\\-)([a-z])\\b`, "g");
	var AN_PLUS_CJK = new RegExp(`([${AN}])(\\+)([${CJK}])`, "g");
	var CJK_LESS_THAN = new RegExp(`([${CJK}])(<)([${AN}])`, "g");
	var LESS_THAN_CJK = new RegExp(`([${AN}])(<)([${CJK}])`, "g");
	var CJK_GREATER_THAN = new RegExp(`([${CJK}])(>)([${AN}])`, "g");
	var GREATER_THAN_CJK = new RegExp(`([${AN}])(>)([${CJK}])`, "g");
	var CJK_LEFT_BRACKET = new RegExp(`([${CJK}])([${LEFT_BRACKETS_EXTENDED}])`, "g");
	var RIGHT_BRACKET_CJK = new RegExp(`([${RIGHT_BRACKETS_EXTENDED}])([${CJK}])`, "g");
	var ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new RegExp(`([${AN}${CJK}])[ ]*([\u201c])([${AN}${CJK}\\-_ ]+)([\u201d])`, "g");
	var LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new RegExp(`([\u201c])([${AN}${CJK}\\-_ ]+)([\u201d])[ ]*([${AN}${CJK}])`, "g");
	var ANS_CJK_RIGHT_QUOTE_ANY_RIGHT_QUOTE = new RegExp(`([${AN}${CJK}])[ ]*(?<![\u201c][^\u201c\u201d\n]*)([\u201d])[ ]*([${AN}${CJK}\\-_ ]+?)[ ]*([\u201d])`, "g");
	var AN_LEFT_BRACKET = new RegExp(`([${AN}])(?<!\\.[${AN}]*)([${LEFT_BRACKETS_BASIC}])`, "g");
	var RIGHT_BRACKET_AN = new RegExp(`([${RIGHT_BRACKETS_BASIC}])([${AN}])`, "g");
	var CJK_UNIX_ABSOLUTE_FILE_PATH = new RegExp(`([${CJK}])(${UNIX_ABSOLUTE_FILE_PATH.source})`, "g");
	var CJK_UNIX_RELATIVE_FILE_PATH = new RegExp(`([${CJK}])(${UNIX_RELATIVE_FILE_PATH.source})`, "g");
	var CJK_WINDOWS_PATH = new RegExp(`([${CJK}])(${WINDOWS_FILE_PATH.source})`, "g");
	var UNIX_ABSOLUTE_FILE_PATH_SLASH_CJK = new RegExp(`(${UNIX_ABSOLUTE_FILE_PATH.source}/)([${CJK}])`, "g");
	var UNIX_RELATIVE_FILE_PATH_SLASH_CJK = new RegExp(`(${UNIX_RELATIVE_FILE_PATH.source}/)([${CJK}])`, "g");
	var CJK_ANS = new RegExp(`([${CJK}])([${ANS_CJK_AFTER}])`, "g");
	var ANS_CJK = new RegExp(`([${ANS_BEFORE_CJK}])([${CJK}])`, "g");
	var S_A = new RegExp(`(%)([${A}])`, "g");
	var MIDDLE_DOT = /([ ]*)([\u00b7\u2022\u2027])([ ]*)/g;
	var VOID_HTML_TAGS = /* @__PURE__ */ new Set([
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	]);
	var BARE_HTML_TAG = /^<([a-zA-Z][a-zA-Z0-9]*)\s*\/?>$/;
	var CLOSING_HTML_TAG = /<\/([a-zA-Z][a-zA-Z0-9]*)/g;
	var CJK_HTML_TAG_MENTION = new RegExp(`([${CJK}])(?=\uE002)`, "g");
	var HTML_TAG_MENTION_CJK = new RegExp(`(?<=\uE003)([${CJK}])`, "g");
	var BRACKET_PATTERNS = [
		{
			pattern: /<([^<>]*)>/g,
			open: "<",
			close: ">"
		},
		{
			pattern: /\(([^()]*)\)/g,
			open: "(",
			close: ")"
		},
		{
			pattern: /\[([^\[\]]*)\]/g,
			open: "[",
			close: "]"
		},
		{
			pattern: /\{([^{}]*)\}/g,
			open: "{",
			close: "}"
		}
	];
	var PlaceholderReplacer = class PlaceholderReplacer {
		placeholder;
		startDelimiter;
		endDelimiter;
		static patternCache = /* @__PURE__ */ new Map();
		items = [];
		index = 0;
		pattern;
		constructor(placeholder, startDelimiter, endDelimiter) {
			this.placeholder = placeholder;
			this.startDelimiter = startDelimiter;
			this.endDelimiter = endDelimiter;
			const cacheKey = `${startDelimiter}${placeholder}${endDelimiter}`;
			let pattern = PlaceholderReplacer.patternCache.get(cacheKey);
			if (!pattern) {
				const escapedStart = this.startDelimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const escapedEnd = this.endDelimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				pattern = new RegExp(`${escapedStart}${this.placeholder}(\\d+)${escapedEnd}`, "g");
				PlaceholderReplacer.patternCache.set(cacheKey, pattern);
			}
			this.pattern = pattern;
		}
		store(item) {
			this.items[this.index] = item;
			return `${this.startDelimiter}${this.placeholder}${this.index++}${this.endDelimiter}`;
		}
		restore(text) {
			if (this.index === 0) return text;
			return text.replace(this.pattern, (_match, index) => {
				return this.items[parseInt(index, 10)] || "";
			});
		}
	};
	var Pangu = class {
		version;
		constructor() {
			this.version = "9.1.1";
		}
		spacingText(text) {
			if (typeof text !== "string") {
				console.warn(`spacingText(text) only accepts string but got ${typeof text}`);
				return text;
			}
			if (text.length <= 1 || !ANY_CJK.test(text)) return text;
			let newText = text;
			const backtickManager = new PlaceholderReplacer("BACKTICK_CONTENT_", "", "");
			newText = newText.replace(/`([^`]+)`/g, (_match, content) => {
				return `\`${backtickManager.store(content)}\``;
			});
			const htmlTagManager = new PlaceholderReplacer("HTML_TAG_PLACEHOLDER_", "", "");
			const mentionedTagManager = new PlaceholderReplacer("HTML_TAG_MENTION_", "", "");
			let hasHtmlTags = false;
			if (newText.includes("<")) {
				hasHtmlTags = true;
				const HTML_TAG_PATTERN = /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s+[^>]*)?>/g;
				const closedTagNames = /* @__PURE__ */ new Set();
				for (const closingTag of newText.matchAll(CLOSING_HTML_TAG)) closedTagNames.add(closingTag[1].toLowerCase());
				newText = newText.replace(HTML_TAG_PATTERN, (match) => {
					const bareTag = match.match(BARE_HTML_TAG);
					if (bareTag) {
						const tagName = bareTag[1].toLowerCase();
						if (!VOID_HTML_TAGS.has(tagName) && !closedTagNames.has(tagName)) return mentionedTagManager.store(match);
					}
					const processedTag = match.replace(/(\w+)="([^"]*)"/g, (_attrMatch, attrName, attrValue) => {
						return `${attrName}="${this.spacingText(attrValue)}"`;
					});
					return htmlTagManager.store(processedTag);
				});
			}
			newText = newText.replace(DOTS_CJK, "$1 $2");
			newText = newText.replace(CJK_PUNCTUATION, "$1$2 ");
			newText = newText.replace(PUNCTUATION_CJK, "$1 ");
			newText = newText.replace(CJK_TILDE, "$1$2 ");
			newText = newText.replace(CJK_TILDE_EQUALS, "$1 $2 ");
			newText = newText.replace(CJK_PERIOD, "$1$2 ");
			newText = newText.replace(AN_PERIOD_CJK, "$1$2 $3");
			newText = newText.replace(AN_COLON_CJK, "$1$2 $3");
			newText = newText.replace(FIX_CJK_COLON_ANS, "$1：$2");
			newText = newText.replace(CJK_QUOTE, "$1 $2");
			newText = newText.replace(QUOTE_CJK, "$1 $2");
			newText = newText.replace(FIX_QUOTE_ANY_QUOTE, "$1$2$3");
			newText = newText.replace(QUOTE_AN, "$1 $2");
			newText = newText.replace(CJK_QUOTE_AN, "$1$2 $3");
			newText = newText.replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's");
			const singleQuoteCJKManager = new PlaceholderReplacer("SINGLE_QUOTE_CJK_PLACEHOLDER_", "", "");
			newText = newText.replace(SINGLE_QUOTE_PURE_CJK, (match) => {
				return singleQuoteCJKManager.store(match);
			});
			newText = newText.replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, "$1 $2");
			newText = newText.replace(SINGLE_QUOTE_CJK, "$1 $2");
			newText = singleQuoteCJKManager.restore(newText);
			if (newText.length >= 5) newText = newText.replace(HASH_ANS_CJK_HASH, "$1 $2$3$4 $5");
			newText = newText.split("\n").map((line) => {
				if ((line.match(/\//g) || []).length <= 1) {
					line = line.replace(CJK_HASH, "$1 $2");
					line = line.replace(HASH_CJK, "$1 $3");
				} else line = line.replace(CJK_FINAL_HASHTAG, "$1$2 $3");
				return line;
			}).join("\n");
			const compoundWordManager = new PlaceholderReplacer("COMPOUND_WORD_PLACEHOLDER_", "", "");
			newText = newText.replace(/\b(?:[A-Za-z0-9]*[a-z][A-Za-z0-9]*-[A-Za-z0-9]+|[A-Za-z0-9]+-[A-Za-z0-9]*[a-z][A-Za-z0-9]*|[A-Za-z]+-[0-9]+|[A-Za-z]+[0-9]+-[A-Za-z0-9]+)(?:-[A-Za-z0-9]+)*\b/g, (match) => {
				return compoundWordManager.store(match);
			});
			newText = newText.replace(SINGLE_LETTER_GRADE_CJK, "$1$2 $3");
			newText = newText.replace(CJK_SIGN_DIGIT, "$1 $2$3");
			newText = newText.replace(CJK_HYPHEN_FLAG, "$1 $2$3");
			newText = newText.replace(AN_PLUS_CJK, "$1$2 $3");
			newText = newText.replace(CJK_OPERATOR_ANS, "$1 $2 $3");
			newText = newText.replace(ANS_OPERATOR_CJK, "$1 $2 $3");
			newText = newText.replace(CJK_LESS_THAN, "$1 $2 $3");
			newText = newText.replace(LESS_THAN_CJK, "$1 $2 $3");
			newText = newText.replace(CJK_GREATER_THAN, "$1 $2 $3");
			newText = newText.replace(GREATER_THAN_CJK, "$1 $2 $3");
			newText = newText.replace(CJK_UNIX_ABSOLUTE_FILE_PATH, "$1 $2");
			newText = newText.replace(CJK_UNIX_RELATIVE_FILE_PATH, "$1 $2");
			newText = newText.replace(CJK_WINDOWS_PATH, "$1 $2");
			newText = newText.replace(UNIX_ABSOLUTE_FILE_PATH_SLASH_CJK, "$1 $2");
			newText = newText.replace(UNIX_RELATIVE_FILE_PATH_SLASH_CJK, "$1 $2");
			newText = newText.split("\n").map((line) => {
				if ((line.match(/\//g) || []).length !== 1) return line;
				line = line.replace(CJK_SLASH_CJK, "$1 $2 $3");
				line = line.replace(CJK_SLASH_ANS, "$1 $2 $3");
				line = line.replace(ANS_SLASH_CJK, "$1 $2 $3");
				return line;
			}).join("\n");
			newText = newText.split("\n").map((line) => {
				if (!PIPE_CJK_CONTACT.test(line)) return line;
				return line.replace(PIPE_SEPARATOR, "$1 $2 ");
			}).join("\n");
			newText = newText.split("\n").map((line) => {
				if (!PLUS_CJK_CONTACT.test(line)) return line;
				return line.replace(PLUS_SEPARATOR, " + ");
			}).join("\n");
			newText = newText.replace(FIX_QUOTE_ANY_QUOTE, "$1$2$3");
			newText = compoundWordManager.restore(newText);
			newText = newText.replace(CJK_LEFT_BRACKET, "$1 $2");
			newText = newText.replace(RIGHT_BRACKET_CJK, "$1 $2");
			newText = newText.replace(ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET, "$1 $2$3$4");
			newText = newText.replace(LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK, "$1$2$3 $4");
			newText = newText.replace(ANS_CJK_RIGHT_QUOTE_ANY_RIGHT_QUOTE, "$1 $2$3$4");
			newText = newText.replace(AN_LEFT_BRACKET, "$1 $2");
			newText = newText.replace(RIGHT_BRACKET_AN, "$1 $2");
			newText = newText.replace(CJK_ANS, "$1 $2");
			newText = newText.replace(ANS_CJK, "$1 $2");
			newText = newText.replace(S_A, "$1 $2");
			newText = newText.replace(MIDDLE_DOT, "・");
			newText = this.fixBracketSpacing(newText);
			if (hasHtmlTags) {
				newText = newText.replace(CJK_HTML_TAG_MENTION, "$1 ");
				newText = newText.replace(HTML_TAG_MENTION_CJK, " $1");
				newText = mentionedTagManager.restore(newText);
				newText = htmlTagManager.restore(newText);
			}
			newText = backtickManager.restore(newText);
			return newText;
		}
		hasProperSpacing(text) {
			return this.spacingText(text) === text;
		}
		fixBracketSpacing(text) {
			for (const { pattern, open, close } of BRACKET_PATTERNS) text = text.replace(pattern, (_match, innerContent) => {
				if (!innerContent) return `${open}${close}`;
				const trimmedContent = innerContent.replace(/^ +| +$/g, "");
				return `${open}${trimmedContent}${close}`;
			});
			return text;
		}
	};
	var pangu$1 = new Pangu();
	//#endregion
	//#region src/browser/boundary-spacing.ts
	var QUOTE = /["\u201c\u201d]/;
	function decideBoundarySpacing(context) {
		if (context.spaceLikeSiblingAfterCurrent) return "none";
		if (context.currentEndsWithSpace || context.nextStartsWithSpace || context.whitespaceBetween) return "none";
		if (context.contentBetween) return "none";
		if (!needsBoundarySpace(context.currentTail, context.nextFirst)) return "none";
		if (context.spaceLikeSiblingAfterCurrentBoundary || context.currentBoundaryIsBlock) return "none";
		if (!context.nextBoundaryIsSpaceSensitive) {
			if (context.nextBoundaryIsIgnored || context.nextBoundaryIsBlock || context.spaceLikeSiblingBeforeNext || context.hiddenBoundaryBefore()) return "none";
			return "prepend-next";
		}
		if (!context.currentBoundaryIsSpaceSensitive) {
			if (context.hiddenBoundaryAfter()) return "none";
			return "append-current";
		}
		if (context.spaceLikeSiblingBeforeNextBoundary || context.hiddenBoundaryAfter()) return "none";
		if (context.inGridOrFlexContainer()) return "none";
		return "insert-element";
	}
	function decideTextRunSpacing(context) {
		const verdicts = [];
		let { text } = context;
		if (text.startsWith(" ") && context.hiddenBoundaryBefore()) {
			verdicts.push("trim-leading-space");
			text = text.substring(1);
		}
		if (isStandaloneQuote(text)) {
			if (context.previousElementLastChar !== null && ANY_CJK.test(context.previousElementLastChar)) verdicts.push("prepend-space");
		} else verdicts.push("apply-text-spacing");
		return verdicts;
	}
	var spacedJunctionCache = /* @__PURE__ */ new Map();
	var SPACED_JUNCTION_CACHE_MAX = 4096;
	function spaceJunction(currentTail, nextFirst) {
		const junction = `${currentTail}${nextFirst}`;
		const cached = spacedJunctionCache.get(junction);
		if (cached !== void 0) return cached;
		const spacedJunction = pangu$1.spacingText(junction);
		if (spacedJunctionCache.size >= SPACED_JUNCTION_CACHE_MAX) spacedJunctionCache.clear();
		spacedJunctionCache.set(junction, spacedJunction);
		return spacedJunction;
	}
	function needsBoundarySpace(currentTail, nextFirst) {
		return spaceJunction(currentTail, nextFirst).endsWith(` ${nextFirst}`) && !isQuoteNextToCjk(currentTail.slice(-1), nextFirst);
	}
	function respaceCurrentTail(currentTail, nextFirst) {
		const spacedJunction = spaceJunction(currentTail, nextFirst);
		if (!spacedJunction.endsWith(` ${nextFirst}`)) return null;
		const spacedTail = spacedJunction.slice(0, -2);
		return spacedTail === currentTail ? null : spacedTail;
	}
	function isQuoteNextToCjk(currentLast, nextFirst) {
		return QUOTE.test(currentLast) && ANY_CJK.test(nextFirst) || ANY_CJK.test(currentLast) && QUOTE.test(nextFirst);
	}
	function isStandaloneQuote(text) {
		return text.length === 1 && QUOTE.test(text);
	}
	//#endregion
	//#region src/browser/dom-walker.ts
	var DomWalker = class {
		static blockTags = /^(div|p|h1|h2|h3|h4|h5|h6)$/i;
		static ignoredTags = /^(code|pre|script|style|textarea|iframe|input)$/i;
		static spaceLikeTags = /^(br|hr|i|img|pangu)$/i;
		static spaceSensitiveTags = /^(a|del|pre|s|strike|u)$/i;
		static ignoredClass = "no-pangu-spacing";
		static collectTextNodes(contextNode, reverse = false) {
			const nodes = [];
			if (!contextNode || contextNode instanceof DocumentFragment) return nodes;
			const walker = document.createTreeWalker(contextNode, NodeFilter.SHOW_TEXT, { acceptNode: (node) => {
				if (!node.nodeValue || !/\S/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
				let currentNode = node;
				while (currentNode) {
					if (currentNode instanceof Element && this.isIgnoredElement(currentNode)) return NodeFilter.FILTER_REJECT;
					currentNode = currentNode.parentNode;
				}
				return NodeFilter.FILTER_ACCEPT;
			} });
			while (walker.nextNode()) nodes.push(walker.currentNode);
			return reverse ? nodes.reverse() : nodes;
		}
		static findBoundaryNode(textNode, edge) {
			let node = textNode;
			while (node.parentNode && !this.spaceSensitiveTags.test(node.nodeName) && (edge === "first" ? this.isFirstTextChild(node.parentNode, node) : this.isLastTextChild(node.parentNode, node))) node = node.parentNode;
			return node;
		}
		static isFirstTextChild(parentNode, targetNode) {
			const { childNodes } = parentNode;
			for (const childNode of childNodes) if (childNode.nodeType !== Node.COMMENT_NODE && childNode.textContent) return childNode === targetNode;
			return false;
		}
		static isLastTextChild(parentNode, targetNode) {
			const { childNodes } = parentNode;
			for (let i = childNodes.length - 1; i > -1; i--) {
				const childNode = childNodes[i];
				if (childNode.nodeType !== Node.COMMENT_NODE && childNode.textContent) return childNode === targetNode;
			}
			return false;
		}
		static isIgnoredElement(element) {
			return this.ignoredTags.test(element.nodeName) || this.isContentEditable(element) || element.classList.contains(this.ignoredClass);
		}
		static isContentEditable(node) {
			return node instanceof HTMLElement && (node.isContentEditable || node.getAttribute("g_editable") === "true");
		}
	};
	//#endregion
	//#region src/browser/task-scheduler.ts
	var TaskQueue = class {
		queue = [];
		isProcessing = false;
		add(task) {
			this.queue.push(task);
			this.scheduleProcessing();
		}
		clear() {
			this.queue.length = 0;
		}
		get length() {
			return this.queue.length;
		}
		scheduleProcessing() {
			if (!this.isProcessing && this.queue.length > 0) {
				this.isProcessing = true;
				requestIdleCallback((deadline) => this.process(deadline), { timeout: 5e3 });
			}
		}
		process(deadline) {
			try {
				while (deadline.timeRemaining() > 0 && this.queue.length > 0) this.queue.shift()?.();
			} finally {
				this.isProcessing = false;
				if (this.queue.length > 0) this.scheduleProcessing();
			}
		}
	};
	/**
	* Runs queued text spacing work during browser idle time to avoid blocking the UI.
	* Tasks execute via requestIdleCallback when the browser has spare time,
	* ensuring smooth user experience even when processing large amounts of text.
	*/
	var TaskScheduler = class {
		config = {
			enabled: true,
			timeout: 2e3
		};
		taskQueue = new TaskQueue();
		get queue() {
			return this.taskQueue;
		}
	};
	//#endregion
	//#region src/browser/visibility-detector.ts
	var VisibilityDetector = class {
		verdictCache = /* @__PURE__ */ new WeakMap();
		clearCache() {
			this.verdictCache = /* @__PURE__ */ new WeakMap();
		}
		isElementVisuallyHidden(element) {
			const style = getComputedStyle(element);
			if (style.display === "none") return true;
			if (style.visibility === "hidden") return true;
			if (parseFloat(style.opacity) === 0) return true;
			const clip = style.clip;
			if (clip && (clip.includes("rect(1px, 1px, 1px, 1px)") || clip.includes("rect(0px, 0px, 0px, 0px)") || clip.includes("rect(0, 0, 0, 0)"))) return true;
			if (style.overflow === "hidden" && style.position === "absolute") {
				const height = parseInt(style.height, 10);
				const width = parseInt(style.width, 10);
				if (height === 1 && width === 1) return true;
			}
			return false;
		}
		shouldSkipSpacingAfterNode(node) {
			let elementToCheck = null;
			if (node instanceof Element) elementToCheck = node;
			else if (node.parentElement) elementToCheck = node.parentElement;
			if (elementToCheck && this.isElementVisuallyHiddenCached(elementToCheck)) return true;
			let currentElement = elementToCheck?.parentElement;
			while (currentElement) {
				if (this.isElementVisuallyHiddenCached(currentElement)) return true;
				currentElement = currentElement.parentElement;
			}
			return false;
		}
		shouldSkipSpacingBeforeNode(node) {
			let previousNode = node.previousSibling;
			if (!previousNode && node.parentElement) {
				let parent = node.parentElement;
				while (parent && !previousNode) {
					previousNode = parent.previousSibling;
					if (!previousNode) parent = parent.parentElement;
				}
			}
			if (previousNode) {
				if (previousNode instanceof Element && this.isElementVisuallyHiddenCached(previousNode)) return true;
				else if (previousNode instanceof Text && previousNode.parentElement && this.isElementVisuallyHiddenCached(previousNode.parentElement)) return true;
			}
			return false;
		}
		isElementVisuallyHiddenCached(element) {
			const cached = this.verdictCache.get(element);
			if (cached !== void 0) return cached;
			const verdict = this.isElementVisuallyHidden(element);
			this.verdictCache.set(element, verdict);
			return verdict;
		}
	};
	//#endregion
	//#region src/browser/pangu.ts
	var TRAILING_WHITESPACE = /\s$/;
	var LEADING_WHITESPACE = /^\s/;
	function once(func) {
		let executed = false;
		return function(...args) {
			if (executed) return;
			executed = true;
			return func(...args);
		};
	}
	function debounce(func, delay, mustRunDelay = Infinity) {
		let timer = null;
		let startTime = null;
		return function(...args) {
			const currentTime = Date.now();
			if (timer) clearTimeout(timer);
			if (!startTime) startTime = currentTime;
			if (currentTime - startTime >= mustRunDelay) {
				func(...args);
				startTime = currentTime;
			} else timer = window.setTimeout(() => {
				func(...args);
			}, delay);
		};
	}
	var BrowserPangu = class BrowserPangu extends Pangu {
		static maxSyncTextNodes = 256;
		isAutoSpacingPageExecuted = false;
		autoSpacingPageObserver = null;
		lastWrittenData = /* @__PURE__ */ new WeakMap();
		taskScheduler = new TaskScheduler();
		visibilityDetector = new VisibilityDetector();
		autoSpacingPage({ pageDelayMs = 1e3, nodeDelayMs = 500, nodeMaxWaitMs = 2e3 } = {}) {
			if (!(document.body instanceof Node)) return;
			if (this.isAutoSpacingPageExecuted) return;
			this.isAutoSpacingPageExecuted = true;
			this.waitForVideosToLoad(pageDelayMs, once(() => this.spacingPage()));
			this.setupAutoSpacingPageObserver(nodeDelayMs, nodeMaxWaitMs);
		}
		spacingPage() {
			const title = document.querySelector("head > title");
			if (title) this.spacingNode(title);
			this.spacingNode(document.body);
		}
		spacingNode(contextNode) {
			const textNodes = DomWalker.collectTextNodes(contextNode, true);
			this.schedule(textNodes);
		}
		stopAutoSpacingPage() {
			if (this.autoSpacingPageObserver) {
				this.autoSpacingPageObserver.disconnect();
				this.autoSpacingPageObserver = null;
			}
			this.isAutoSpacingPageExecuted = false;
		}
		isElementVisuallyHidden(element) {
			return this.visibilityDetector.isElementVisuallyHidden(element);
		}
		isSpaceLikeSibling(node) {
			return !!node && DomWalker.spaceLikeTags.test(node.nodeName);
		}
		isGridOrFlexContainer(node) {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			const display = window.getComputedStyle(node).display;
			return display === "grid" || display === "inline-grid" || display === "flex" || display === "inline-flex";
		}
		spacingTextNodes(textNodes) {
			this.visibilityDetector.clearCache();
			let currentTextNode;
			let nextTextNode = null;
			for (let i = 0; i < textNodes.length; i++) {
				currentTextNode = textNodes[i];
				if (!currentTextNode) continue;
				if (currentTextNode instanceof Text) this.applyTextRunSpacing(currentTextNode);
				if (nextTextNode) {
					if (!(currentTextNode instanceof Text) || !(nextTextNode instanceof Text)) continue;
					const currentBoundaryNode = DomWalker.findBoundaryNode(currentTextNode, "last");
					const nextBoundaryNode = DomWalker.findBoundaryNode(nextTextNode, "first");
					const { whitespaceBetween, contentBetween } = this.scanBetweenTextRuns(currentBoundaryNode, nextBoundaryNode);
					const currentRun = currentTextNode;
					const nextRun = nextTextNode;
					const currentTail = currentTextNode.data.slice(-3);
					const nextFirst = nextTextNode.data.slice(0, 1);
					const verdict = decideBoundarySpacing({
						currentTail,
						nextFirst,
						currentEndsWithSpace: TRAILING_WHITESPACE.test(currentTextNode.data),
						nextStartsWithSpace: LEADING_WHITESPACE.test(nextTextNode.data),
						whitespaceBetween,
						contentBetween,
						spaceLikeSiblingAfterCurrent: this.isSpaceLikeSibling(currentTextNode.nextSibling),
						spaceLikeSiblingAfterCurrentBoundary: this.isSpaceLikeSibling(currentBoundaryNode.nextSibling),
						spaceLikeSiblingBeforeNext: this.isSpaceLikeSibling(nextTextNode.previousSibling),
						spaceLikeSiblingBeforeNextBoundary: this.isSpaceLikeSibling(nextBoundaryNode.previousSibling),
						currentBoundaryIsBlock: DomWalker.blockTags.test(currentBoundaryNode.nodeName),
						currentBoundaryIsSpaceSensitive: DomWalker.spaceSensitiveTags.test(currentBoundaryNode.nodeName),
						nextBoundaryIsBlock: DomWalker.blockTags.test(nextBoundaryNode.nodeName),
						nextBoundaryIsIgnored: DomWalker.ignoredTags.test(nextBoundaryNode.nodeName),
						nextBoundaryIsSpaceSensitive: DomWalker.spaceSensitiveTags.test(nextBoundaryNode.nodeName),
						hiddenBoundaryBefore: () => this.isHiddenBoundaryBefore(nextRun),
						hiddenBoundaryAfter: () => this.isHiddenBoundaryAfter(currentRun),
						inGridOrFlexContainer: () => !!nextBoundaryNode.parentNode && this.isGridOrFlexContainer(nextBoundaryNode.parentNode)
					});
					if (verdict !== "none") {
						const respacedTail = respaceCurrentTail(currentTail, nextFirst);
						if (respacedTail !== null) {
							currentTextNode.data = currentTextNode.data.slice(0, currentTextNode.data.length - currentTail.length) + respacedTail;
							this.lastWrittenData.set(currentTextNode, currentTextNode.data);
						}
					}
					switch (verdict) {
						case "prepend-next":
							nextTextNode.data = ` ${nextTextNode.data}`;
							this.lastWrittenData.set(nextTextNode, nextTextNode.data);
							break;
						case "append-current":
							currentTextNode.data = `${currentTextNode.data} `;
							this.lastWrittenData.set(currentTextNode, currentTextNode.data);
							break;
						case "insert-element":
							this.insertPanguElement(nextBoundaryNode);
							break;
						case "none": break;
					}
				}
				nextTextNode = currentTextNode;
			}
		}
		applyTextRunSpacing(textNode) {
			const verdicts = decideTextRunSpacing({
				text: textNode.data,
				previousElementLastChar: this.findPreviousElementLastChar(textNode),
				hiddenBoundaryBefore: () => this.isHiddenBoundaryBefore(textNode)
			});
			for (const verdict of verdicts) switch (verdict) {
				case "trim-leading-space":
					textNode.data = textNode.data.substring(1);
					this.lastWrittenData.set(textNode, textNode.data);
					break;
				case "prepend-space":
					textNode.data = ` ${textNode.data}`;
					this.lastWrittenData.set(textNode, textNode.data);
					break;
				case "apply-text-spacing": {
					const newText = this.spacingText(textNode.data);
					if (textNode.data !== newText) {
						textNode.data = newText;
						this.lastWrittenData.set(textNode, textNode.data);
					}
					break;
				}
			}
		}
		spacingNodeSync(contextNode, maxTextNodes) {
			const textNodes = DomWalker.collectTextNodes(contextNode, true);
			if (textNodes.length > maxTextNodes) return false;
			this.spacingTextNodes(textNodes);
			return true;
		}
		hasSpacedTextInSubtree(node) {
			if (node instanceof Text) return this.lastWrittenData.has(node);
			const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
			while (walker.nextNode()) if (this.lastWrittenData.has(walker.currentNode)) return true;
			return false;
		}
		insertPanguElement(nextBoundaryNode) {
			const panguSpace = document.createElement("pangu");
			panguSpace.innerHTML = " ";
			if (nextBoundaryNode.parentNode) nextBoundaryNode.parentNode.insertBefore(panguSpace, nextBoundaryNode);
			if (!panguSpace.previousElementSibling) {
				if (panguSpace.parentNode) panguSpace.parentNode.removeChild(panguSpace);
			}
		}
		findPreviousElementLastChar(textNode) {
			const previousNode = textNode.previousSibling;
			if (previousNode && previousNode.nodeType === Node.ELEMENT_NODE && previousNode.textContent) return previousNode.textContent.slice(-1);
			return null;
		}
		scanBetweenTextRuns(currentBoundaryNode, nextBoundaryNode) {
			let whitespaceBetween = false;
			let contentBetween = false;
			const scan = (node) => {
				if (node.nodeType === Node.TEXT_NODE && node.textContent) {
					if (/\s/.test(node.textContent)) whitespaceBetween = true;
					if (/\S/.test(node.textContent)) contentBetween = true;
				} else if (node instanceof Element && !DomWalker.isIgnoredElement(node)) for (let child = node.firstChild; child; child = child.nextSibling) scan(child);
			};
			let containerOfNext = null;
			let node = currentBoundaryNode;
			while (node && !containerOfNext) {
				let sibling = node.nextSibling;
				while (sibling && !sibling.contains(nextBoundaryNode)) {
					scan(sibling);
					sibling = sibling.nextSibling;
				}
				containerOfNext = sibling;
				node = node.parentNode;
			}
			while (containerOfNext && containerOfNext !== nextBoundaryNode) {
				let child = containerOfNext.firstChild;
				while (child && !child.contains(nextBoundaryNode)) {
					scan(child);
					child = child.nextSibling;
				}
				containerOfNext = child;
			}
			return {
				whitespaceBetween,
				contentBetween
			};
		}
		isHiddenBoundaryBefore(node) {
			return this.visibilityDetector.shouldSkipSpacingBeforeNode(node);
		}
		isHiddenBoundaryAfter(node) {
			return this.visibilityDetector.shouldSkipSpacingAfterNode(node);
		}
		schedule(textNodes) {
			if (!this.taskScheduler.config.enabled || typeof requestIdleCallback !== "function") {
				this.spacingTextNodes(textNodes);
				return;
			}
			this.taskScheduler.queue.add(() => {
				this.spacingTextNodes(textNodes);
			});
		}
		waitForVideosToLoad(delayMs, onLoaded) {
			const videos = Array.from(document.getElementsByTagName("video"));
			if (videos.length === 0) setTimeout(onLoaded, delayMs);
			else if (videos.every((video) => video.readyState >= 3)) setTimeout(onLoaded, delayMs);
			else {
				let loadedCount = 0;
				const videoCount = videos.length;
				const checkAllLoaded = () => {
					loadedCount++;
					if (loadedCount >= videoCount) setTimeout(onLoaded, delayMs);
				};
				for (const video of videos) if (video.readyState >= 3) checkAllLoaded();
				else video.addEventListener("loadeddata", checkAllLoaded, { once: true });
				setTimeout(onLoaded, delayMs + 5e3);
			}
		}
		setupAutoSpacingPageObserver(nodeDelayMs, nodeMaxWaitMs) {
			if (this.autoSpacingPageObserver) {
				this.autoSpacingPageObserver.disconnect();
				this.autoSpacingPageObserver = null;
			}
			const queue = [];
			const debouncedSpacingTitle = debounce(() => {
				const titleElement = document.querySelector("head > title");
				if (titleElement) this.spacingNode(titleElement);
			}, nodeDelayMs, nodeMaxWaitMs);
			const debouncedSpacingNode = debounce(() => {
				const nodesToProcess = [...queue];
				queue.length = 0;
				if (nodesToProcess.length === 0) return;
				nodesToProcess.sort((a, b) => {
					if (a === b) return 0;
					return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
				});
				const seenTextNodes = /* @__PURE__ */ new Set();
				const allTextNodes = [];
				for (const node of nodesToProcess) for (const textNode of DomWalker.collectTextNodes(node)) if (!seenTextNodes.has(textNode)) {
					seenTextNodes.add(textNode);
					allTextNodes.push(textNode);
				}
				allTextNodes.reverse();
				this.schedule(allTextNodes);
			}, nodeDelayMs, nodeMaxWaitMs);
			this.autoSpacingPageObserver = new MutationObserver((mutations) => {
				let titleChanged = false;
				let removedSpacedContent = false;
				for (const mutation of mutations) {
					for (const node of mutation.removedNodes) if (this.hasSpacedTextInSubtree(node)) {
						removedSpacedContent = true;
						break;
					}
					if (removedSpacedContent) break;
				}
				for (const mutation of mutations) {
					if (mutation.target.parentNode?.nodeName === "TITLE" || mutation.target.nodeName === "TITLE") {
						titleChanged = true;
						continue;
					}
					switch (mutation.type) {
						case "characterData": {
							const { target: node } = mutation;
							if (node instanceof Text && node.parentNode) {
								const lastWritten = this.lastWrittenData.get(node);
								if (lastWritten !== void 0) {
									if (node.data === lastWritten) break;
									if (this.spacingNodeSync(node.parentNode, BrowserPangu.maxSyncTextNodes)) break;
								}
								queue.push(node.parentNode);
							}
							break;
						}
						case "childList":
							for (const node of mutation.addedNodes) if (node.nodeType === Node.ELEMENT_NODE) {
								if (removedSpacedContent && this.spacingNodeSync(node, BrowserPangu.maxSyncTextNodes)) continue;
								queue.push(node);
							} else if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
								if (removedSpacedContent && this.spacingNodeSync(node.parentNode, BrowserPangu.maxSyncTextNodes)) continue;
								queue.push(node.parentNode);
							}
							break;
						default: break;
					}
				}
				if (titleChanged) debouncedSpacingTitle();
				debouncedSpacingNode();
			});
			this.autoSpacingPageObserver.observe(document.head, {
				characterData: true,
				childList: true,
				subtree: true
			});
			this.autoSpacingPageObserver.observe(document.body, {
				characterData: true,
				childList: true,
				subtree: true
			});
		}
	};
	var pangu = new BrowserPangu();
	//#endregion
	return Object.assign(pangu, { BrowserPangu });
});

