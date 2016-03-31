import _ from 'lodash';

export function decodeData(p,a,c,k,e,d) {
	e = function(c) {
	    return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
	};

	while (c--) {
	    if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
	}

	return p;
}

export function decodeHTML(html) {
	if (html.match(/sources:/)) {
		return html;
	}
	// @todo: There HAS to be a better way to do this
	const args = eval('(function() { return Array.from(arguments); }' + html.match(/eval.+?\;return p\}([^\n]+)/)[1]);

	return decodeData(...args);
}

export function getSources(script) {
	const matches = script.match(/sources:\s*(.+?)\s*\,image/);

	if (!matches) {
		// @todo What is this bug???/
		console.log(script);
		alert('Loading error');
		throw new Error('Loading error');
	}

	return _.chain(
		matches[1].match(/((file)|(label))\:"(.+?)"/g)
			.map(item => item.slice(0, -1).split(':"'))
	)
		.chunk(2)
		.map(item => _.fromPairs(item))
	.value();
}