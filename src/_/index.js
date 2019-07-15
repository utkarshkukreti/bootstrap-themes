import $ from 'jquery';
import 'bootstrap';
import * as clipboard from 'clipboard-polyfill';

// Highlight.js
import hljs from 'highlight.js/lib/highlight';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('xml', xml);

$(document).on('click', 'a[href="#"]', event => event.preventDefault());

$(document).on('click', '[data-toggle=copy]', function() {
  const $this = $(this);
  clipboard.writeText($this.data('text'));
  const html = $this.html();
  $this.text('Copied!');
  setTimeout(() => $this.html(html), 2000);
});

$(document).on('submit', 'form:not([target])', event => event.preventDefault());

const indent = string =>
  string
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n');

const prettify = html => {
  const recur = node => {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        const name = node.tagName.toLowerCase();
        const isSelfClosing = name === 'input';
        let html = `<${name}`;
        for (const name of node.getAttributeNames()) {
          const value = node.getAttribute(name);
          html += value ? ` ${name}="${value}"` : ` ${name}`;
        }
        html += '>';
        if (isSelfClosing) {
          return html;
        }
        for (const child of node.childNodes) {
          html += '\n' + indent(recur(child));
        }
        html += `\n</${name}>`;
        return html;
      case Node.TEXT_NODE:
        return node.textContent.trim();
      default:
        return '';
    }
  };
  const t = document.createElement('template');
  t.innerHTML = html;
  return [].map.call(t.content.childNodes, recur).join('\n');
};

const $code = $('#code');
$('.snippet').each(function() {
  const html = prettify($(this).html());
  $(`
    <div class="show-code">
      <svg width="16" height="16" fill="${
        window.config.isBackgroundLight ? 'var(--dark)' : 'var(--light)'
      }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M.7 9.3l4.8-4.8 1.4 1.42L2.84 10l4.07 4.07-1.41 1.42L0 10l.7-.7zm18.6 1.4l.7-.7-5.49-5.49-1.4 1.42L17.16 10l-4.07 4.07 1.41 1.42 4.78-4.78z">
      </svg>
    </div>
  `)
    .on('click', () => {
      hljs.highlightBlock($code.find('pre code').text(html)[0]);
      $code.find('.copy').data('text', html);
      $code.modal('show');
    })
    .appendTo(this);
});

$('a[data-href]').each(function() {
  const $this = $(this);
  $this.attr('href', $this.data('href'));
});
