// Small UI helpers: copy buttons and verifier stub
document.addEventListener('DOMContentLoaded', function(){
  // Copy button handler
  document.body.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('.copy-btn');
    if(!btn) return;
    const parent = btn.parentElement;
    let txt = '';
    if(parent){
      // remove the button text from the parent's text
      txt = parent.textContent.replace(btn.textContent, '').trim();
    }
    if(!txt) txt = btn.getAttribute('data-copy') || '';
    if(!txt) return;
    navigator.clipboard && navigator.clipboard.writeText(txt).then(()=>{
      const original = btn.textContent;
      btn.textContent = 'Copied';
      btn.disabled = true;
      setTimeout(()=>{ btn.textContent = original; btn.disabled = false; }, 1400);
    }).catch(()=>{
      // fallback
      const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); }catch(e){} ta.remove();
    });
  });

  // Verifier stub: toggle valid/invalid
  const verifierForm = document.querySelector('.verifier-portal form');
  if(verifierForm){
    verifierForm.addEventListener('submit', function(ev){
      ev.preventDefault();
      const input = verifierForm.querySelector('input[name="certificateId"]');
      const val = input && input.value.trim();
      const resultValid = document.querySelector('.result-valid');
      const resultInvalid = document.querySelector('.result-invalid');
      if(!resultValid || !resultInvalid) return;
      // simple heuristic: IDs starting with CERT or containing hex-like 0x are valid in demo
      const isValid = val && (/^CERT/i.test(val) || /0x[a-f0-9]{4,}/i.test(val));
      if(isValid){ resultValid.style.display = 'block'; resultInvalid.style.display = 'none'; resultValid.classList.add('fade-in'); }
      else { resultValid.style.display = 'none'; resultInvalid.style.display = 'block'; resultInvalid.classList.add('fade-in'); }
    });
  }

  // small enhancement: smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){ e.preventDefault(); const t=document.querySelector(this.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth',block:'start'}); });
  });
});
