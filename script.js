// Summit Shield Roofing — step form, mobile nav, and before/after comparison.
// Static demo: connect the form to a CRM or backend before collecting real leads.

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  mainNav.classList.toggle('open', !expanded);
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Three-step inspection lead capture.
const form = document.getElementById('inspectionForm');
const steps = [...document.querySelectorAll('.form-step')];
const stepCounter = document.getElementById('stepCounter');
const progressFill = document.getElementById('progressFill');
const successPanel = document.getElementById('formSuccess');
let currentStep = 0;

function showStep(index) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, i) => step.classList.toggle('active', i === currentStep));
  stepCounter.textContent = `STEP ${String(currentStep + 1).padStart(2, '0')} / 03`;
  progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
}

function validateCurrentStep() {
  const fields = [...steps[currentStep].querySelectorAll('input[required], select[required]')];
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }
  return true;
}

document.querySelectorAll('.next-step').forEach(button => {
  button.addEventListener('click', () => {
    if (validateCurrentStep()) showStep(currentStep + 1);
  });
});
document.querySelectorAll('.prev-step').forEach(button => {
  button.addEventListener('click', () => showStep(currentStep - 1));
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateCurrentStep()) return;
  form.hidden = true;
  document.querySelector('.form-topline').hidden = true;
  document.querySelector('.progress-track').hidden = true;
  document.querySelector('.form-foot').hidden = true;
  successPanel.classList.add('show');
});

document.getElementById('restartForm').addEventListener('click', () => {
  form.reset();
  form.hidden = false;
  document.querySelector('.form-topline').hidden = false;
  document.querySelector('.progress-track').hidden = false;
  document.querySelector('.form-foot').hidden = false;
  successPanel.classList.remove('show');
  showStep(0);
});

// Before/after reveal slider. The top image layer is clipped to the selected width.
const comparison = document.getElementById('comparison');
const beforeImage = document.getElementById('beforeImage');
const comparisonHandle = document.getElementById('comparisonHandle');
const comparisonRange = document.getElementById('comparisonRange');

function setComparison(value) {
  const position = Math.max(0, Math.min(100, Number(value)));
  beforeImage.style.width = `${position}%`;
  comparisonHandle.style.left = `${position}%`;
  comparisonHandle.setAttribute('aria-valuenow', String(Math.round(position)));
  comparisonRange.value = String(position);
}
comparisonRange.addEventListener('input', event => setComparison(event.target.value));
comparisonHandle.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 2 : -2;
    setComparison(Number(comparisonRange.value) + direction);
  }
});
setComparison(50);

document.getElementById('year').textContent = new Date().getFullYear();
