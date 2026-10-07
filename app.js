const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

// Progressive reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
$$('.reveal').forEach((el) => {
  if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`);
  revealObserver.observe(el);
});

// Cursor ambient light
const glow = $('.cursor-glow');
window.addEventListener('pointermove', (e) => {
  if (!glow) return;
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
}, { passive: true });

// Mobile nav
const menuBtn = $('.menu-btn');
const mobileMenu = $('.mobile-menu');
menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('is-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

// Architecture layer explorer
const layerContent = {
  'Objective Layer': 'Converts strategy into explicit goals, constraints, priorities and measurable success conditions before any model acts.',
  'Meta-Harness': 'Routes work across models, agents, tools and workflows according to the objective — without depending on a single model provider.',
  'Context & Memory': 'Maintains durable operational state across sessions, projects and agents so execution does not reset at every conversation.',
  'Evidence & Evaluation': 'Links outputs to sources, calculations and tests; evaluates work against explicit criteria before consequential actions are accepted.',
  'Human Governance': 'Creates approval, escalation and intervention gates so people remain responsible for high-impact decisions and exceptions.'
};
const detail = $('#layer-detail');
$$('.layer-card').forEach(btn => btn.addEventListener('click', () => {
  $$('.layer-card').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  detail.innerHTML = `<span>${btn.dataset.layer.toUpperCase()}</span><p>${layerContent[btn.dataset.layer]}</p>`;
}));

// Dialogs
const accessModal = $('#access-modal');
const dataroomModal = $('#dataroom-modal');
function openDialog(dialog) {
  if (!dialog) return;
  if (dialog.open) return;
  dialog.showModal();
}
function closeDialog(dialog) { if (dialog?.open) dialog.close(); }
$$('[data-open-access]').forEach(btn => btn.addEventListener('click', () => {
  closeDialog(dataroomModal);
  openDialog(accessModal);
}));
$$('[data-open-dataroom]').forEach(btn => btn.addEventListener('click', () => openDialog(dataroomModal)));
$$('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => closeDialog(btn.closest('dialog'))));
$$('dialog').forEach(dialog => dialog.addEventListener('click', e => {
  if (e.target === dialog) closeDialog(dialog);
}));

// Static investor access request: privacy-preserving by default.
const form = $('#access-form');
const output = $('#request-output');
const requestText = $('#request-text');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const message = [
    'PRAXIOS — Investor Access Request',
    '',
    `Name: ${data.get('name')}`,
    `Fund / Company: ${data.get('company')}`,
    `Email: ${data.get('email')}`,
    `Message: ${data.get('message') || '—'}`,
    '',
    'Requested materials: Investor Deck, Architecture Memo, Product Roadmap, Financial Model, Security & Governance, Data Room.'
  ].join('\n');
  requestText.textContent = message;
  output.hidden = false;
  output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
$('#copy-request')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestText.textContent);
    $('#copy-request').textContent = 'Copied ✓';
    setTimeout(() => $('#copy-request').textContent = 'Copy request', 1600);
  } catch {
    $('#copy-request').textContent = 'Select text above to copy';
  }
});
