'use client';
import { useState, useEffect, useRef } from 'react';

/* ── types ── */
interface FormData {
  prenom: string; nom: string; date_naissance: string; sexe: string;
  telephone: string; email: string; ville: string; situation_familiale: string;
  type_contrat: string; secteur: string; poste: string; anciennete: string;
  salaire_net: string; autres_revenus: string; charges_mensuelles: string;
  budget_vehicule: string; duree_remboursement: string; apport_personnel: string;
  taux_acceptable: string; marque_preferee: string; type_vehicule: string;
  motorisation: string; delai_achat: string; commentaire: string;
}

const empty: FormData = {
  prenom:'',nom:'',date_naissance:'',sexe:'',telephone:'',email:'',ville:'',
  situation_familiale:'',type_contrat:'',secteur:'',poste:'',anciennete:'',
  salaire_net:'',autres_revenus:'',charges_mensuelles:'',budget_vehicule:'',
  duree_remboursement:'',apport_personnel:'',taux_acceptable:'',marque_preferee:'',
  type_vehicule:'',motorisation:'',delai_achat:'',commentaire:'',
};

export default function InscriptionForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [toasts, setToasts] = useState<{id:number;msg:string;type:string}[]>([]);
  const [counter, setCounter] = useState(1100);
  const curRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0); const my = useRef(0);
  const rx = useRef(0); const ry = useRef(0);

  /* ── Counter animation ── */
  useEffect(() => {
    const target = 1247;
    const t = setInterval(() => {
      setCounter(v => { if (v >= target) { clearInterval(t); return target; } return v + 3; });
    }, 16);
    return () => clearInterval(t);
  }, []);

  /* ── Cursor ── */
  useEffect(() => {
    const move = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; };
    window.addEventListener('mousemove', move);
    let raf: number;
    const loop = () => {
      if (curRef.current)  { curRef.current.style.left  = mx.current+'px'; curRef.current.style.top  = my.current+'px'; }
      if (ringRef.current) {
        rx.current += (mx.current - rx.current) * 0.12;
        ry.current += (my.current - ry.current) * 0.12;
        ringRef.current.style.left = rx.current+'px';
        ringRef.current.style.top  = ry.current+'px';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  /* ── Toast ── */
  const toast = (msg: string, type = '') => {
    const id = Date.now();
    setToasts(t => [...t, {id, msg, type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  };

  /* ── Field helpers ── */
  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(f => ({...f, [k]: e.target.value}));
    setErrors(err => ({...err, [k]: ''}));
  };

  const req1 = ['prenom','nom','date_naissance','telephone','email','ville','secteur','poste','anciennete','salaire_net'] as (keyof FormData)[];

  /* ── Step 1 → 2 ── */
  const nextStep = () => {
    const errs: Partial<FormData> = {};
    req1.forEach(k => { if (!form[k]) errs[k] = 'requis'; });
    if (!form.type_contrat) { toast('Veuillez sélectionner un type de contrat','err'); return; }
    if (!consent1) { toast('Veuillez accepter la politique de confidentialité','err'); return; }
    if (Object.keys(errs).length) { setErrors(errs); toast('Veuillez remplir tous les champs requis','err'); window.scrollTo({top:0,behavior:'smooth'}); return; }
    setStep(2); window.scrollTo({top:0,behavior:'smooth'});
  };

  /* ── Submit ── */
  const submit = async () => {
    if (!form.budget_vehicule) { toast('Veuillez indiquer votre budget véhicule','err'); return; }
    if (!form.delai_achat)     { toast('Veuillez indiquer votre délai d\'achat','err'); return; }
    if (!consent2)             { toast('Veuillez accepter les conditions','err'); return; }

    setLoading(true);
    try {
      const res  = await fetch('/api/inscription', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast(data.error || 'Erreur serveur','err'); return; }
      setRefNumber(data.ref_number);
      setStep(3);
      setCounter(c => c + 1);
      toast('Dossier enregistré avec succès ✦','ok');
      window.scrollTo({top:0,behavior:'smooth'});
    } catch {
      toast('Erreur réseau inattendue','err');
    } finally {
      setLoading(false);
    }
  };

  /* ── Share ── */
  const share = () => {
    const msg = 'Je viens de rejoindre AutoCI — un mouvement pour un financement auto direct en Côte d\'Ivoire, sans les 18% des banques. Rejoins-nous !';
    if (navigator.share) navigator.share({title:'AutoCI', text:msg, url:window.location.href});
    else { navigator.clipboard.writeText(window.location.href); toast('Lien copié ✦'); }
  };

  const pct = ((counter/5000)*100).toFixed(1);

  return (
    <>
      {/* Cursor */}
      <div ref={curRef}  style={{position:'fixed',width:'8px',height:'8px',background:'var(--gold)',borderRadius:'50%',pointerEvents:'none',zIndex:9999,transform:'translate(-50%,-50%)',mixBlendMode:'difference'}} />
      <div ref={ringRef} style={{position:'fixed',width:'32px',height:'32px',border:'1px solid var(--gold-line)',borderRadius:'50%',pointerEvents:'none',zIndex:9998,transform:'translate(-50%,-50%)'}} />

      {/* Toasts */}
      <div style={{position:'fixed',bottom:'32px',right:'32px',display:'flex',flexDirection:'column',gap:'10px',zIndex:9997}}>
        {toasts.map(t => (
          <div key={t.id} style={{padding:'16px 24px',borderLeft:`2px solid ${t.type==='ok'?'var(--success)':t.type==='err'?'var(--error)':'var(--gold)'}`,background:'var(--ink-3)',fontSize:'13px',fontWeight:300,color:'var(--white)',minWidth:'260px',boxShadow:'0 8px 32px rgba(0,0,0,.5)',animation:'toastIn .3s ease'}}>
            {t.msg}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes reveal  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fstep { animation: reveal .45s cubic-bezier(.4,0,.2,1); }
        input, select, textarea { color-scheme: dark; }
        input::placeholder, textarea::placeholder { color: var(--w30) !important; }
        input:focus, select:focus, textarea:focus {
          border-color: var(--gold-line) !important;
          border-bottom-color: var(--gold) !important;
          background: var(--ink-4) !important;
          box-shadow: 0 1px 0 var(--gold) !important;
          outline: none !important;
        }
        input.err { border-bottom-color: var(--error) !important; box-shadow: 0 1px 0 var(--error) !important; }
        select option { background: #1a1a1a; color: #f8f4ed; }
        .rpill input { position:absolute;opacity:0;width:0;height:0; }
        .rpill input:checked + label {
          border-color: var(--gold) !important;
          background: var(--gold-dim) !important;
          color: var(--gold-2) !important;
        }
        .btn-cta::before {
          content:''; position:absolute; top:0; left:-100%;
          width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
          transition:left .5s;
        }
        .btn-cta:hover::before { left:100% !important; }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media(max-width:960px){
          .shell{grid-template-columns:1fr !important}
          .sidebar{position:relative !important;height:auto !important}
          .snav,.sb-desc{display:none !important}
          .sb-counter{display:none !important}
          .g2,.g3{grid-template-columns:1fr !important}
        }
      `}</style>

      <div className="shell" style={{display:'grid',gridTemplateColumns:'380px 1fr',minHeight:'100vh',position:'relative',zIndex:2}}>

        {/* ══ SIDEBAR ══ */}
        <aside style={{background:'var(--ink-2)',borderRight:'1px solid var(--border)',padding:'52px 44px',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,right:'-1px',width:'1px',height:'100%',background:'linear-gradient(180deg,transparent 0%,var(--gold) 30%,var(--gold) 70%,transparent 100%)'}}/>
          <div style={{position:'absolute',bottom:'-120px',left:'-80px',width:'360px',height:'360px',background:'radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'72px'}}>
            <div style={{width:'36px',height:'36px',border:'1px solid var(--gold-line)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              <div style={{position:'absolute',inset:'4px',border:'1px solid var(--gold-dim)'}}/>
              <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:'16px',fontWeight:700,color:'var(--gold)',position:'relative',zIndex:1}}>A</span>
            </div>
            <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase'}}>
              Auto<span style={{color:'var(--gold)'}}>CI</span>
            </span>
          </div>

          {/* Body */}
          <div className="sb-body" style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{fontSize:'10px',fontWeight:500,letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',marginBottom:'22px',display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'24px',height:'1px',background:'var(--gold)'}}/>
              Côte d&apos;Ivoire · 2025
            </div>
            <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'48px',fontWeight:300,lineHeight:1.1,letterSpacing:'-.5px',marginBottom:'28px'}}>
              Ensemble,<br/>changeons les<br/><strong style={{fontWeight:700,fontStyle:'italic',color:'var(--gold-2)'}}>règles du jeu.</strong>
            </h1>
            <p className="sb-desc" style={{fontSize:'13px',fontWeight:300,lineHeight:2,color:'var(--w60)',marginBottom:'52px',borderLeft:'1px solid var(--gold-line)',paddingLeft:'20px'}}>
              700 000 FCFA de salaire, CDI, et pourtant 18% de taux bancaire. Nous construisons la preuve collective pour convaincre un constructeur chinois d&apos;ouvrir une filiale de financement directe en Côte d&apos;Ivoire.
            </p>

            {/* Step nav */}
            <nav className="snav" style={{display:'flex',flexDirection:'column'}}>
              {[
                {n:'I',  title:'Profil & Revenus',      sub:'Identité, emploi, capacité financière'},
                {n:'II', title:'Projet véhicule',        sub:'Budget, marque, délai d\'achat'},
                {n:'✦', title:'Confirmation',            sub:'Votre place est réservée'},
              ].map((item, i) => {
                const idx = i+1;
                const isActive = step === idx;
                const isDone   = step >  idx;
                const isLocked = step <  idx;
                return (
                  <div key={idx} style={{display:'flex',alignItems:'flex-start',gap:'18px',padding:'16px 0',position:'relative',opacity:isLocked?.28:isDone?.6:1}}>
                    {idx < 3 && <div style={{position:'absolute',left:'14px',top:'46px',width:'1px',height:'calc(100% - 16px)',background:'linear-gradient(180deg,var(--gold-line),transparent)'}}/>}
                    <div style={{width:'30px',height:'30px',flexShrink:0,border:`1px solid ${isActive?'var(--gold)':isDone?'var(--gold-line)':'var(--border)'}`,background:isActive?'var(--gold-dim)':isDone?'rgba(201,168,76,.08)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1}}>
                      <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:'13px',fontWeight:600,color:(isActive||isDone)?'var(--gold)':'var(--w30)'}}>{item.n}</span>
                    </div>
                    <div>
                      <strong style={{display:'block',fontSize:'13px',fontWeight:500,color:'var(--white)',marginBottom:'2px'}}>{item.title}</strong>
                      <span style={{fontSize:'11px',fontWeight:300,color:'var(--w30)'}}>{item.sub}</span>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Counter */}
          <div className="sb-counter" style={{marginTop:'48px',padding:'24px',border:'1px solid var(--gold-line)',background:'var(--gold-dim)',position:'relative'}}>
            <div style={{position:'absolute',top:'-1px',left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,var(--gold),transparent)'}}/>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'42px',fontWeight:700,color:'var(--gold-2)',lineHeight:1,marginBottom:'8px'}}>
              {counter.toLocaleString('fr-FR')}
            </div>
            <div style={{fontSize:'11px',fontWeight:300,letterSpacing:'1.5px',color:'var(--w60)',textTransform:'uppercase'}}>Cadres inscrits · Objectif 5 000</div>
            <div style={{marginTop:'16px',height:'2px',background:'var(--border)'}}>
              <div style={{height:'100%',background:'linear-gradient(90deg,var(--gold),var(--gold-3))',width:`${pct}%`,transition:'width 1.5s cubic-bezier(.4,0,.2,1)'}}/>
            </div>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main style={{padding:'60px 72px',display:'flex',flexDirection:'column',maxWidth:'760px'}}>
          {/* Progress pips */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'56px'}}>
            <span style={{fontSize:'11px',fontWeight:400,letterSpacing:'3px',textTransform:'uppercase',color:'var(--w30)'}}>Inscription</span>
            <div style={{display:'flex',gap:'6px'}}>
              {[1,2,3].map(i => (
                <div key={i} style={{width:step===i?'40px':'24px',height:'2px',background:step>i?'var(--gold-line)':step===i?'var(--gold)':'var(--border)',transition:'all .4s'}}/>
              ))}
            </div>
          </div>

          {/* ─── STEP 1 ─── */}
          {step === 1 && (
            <div className="fstep">
              <FormHead tag="Étape 1 sur 2" title={<>Votre profil<br/><em>personnel & professionnel</em></>} sub="Ces informations restent strictement confidentielles. Elles servent uniquement à construire notre dossier collectif anonymisé destiné aux constructeurs partenaires." />

              <SLabel>Identité</SLabel>
              <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
                <Field label="Prénom" req><input style={inp} value={form.prenom} onChange={set('prenom')} placeholder="Kouassi" className={errors.prenom?'err':''}/></Field>
                <Field label="Nom" req><input style={inp} value={form.nom} onChange={set('nom')} placeholder="Diabaté" className={errors.nom?'err':''}/></Field>
                <Field label="Date de naissance" req><input type="date" style={inp} value={form.date_naissance} onChange={set('date_naissance')} max="2005-01-01" min="1970-01-01" className={errors.date_naissance?'err':''}/></Field>
                <Field label="Sexe"><select style={sel} value={form.sexe} onChange={set('sexe')}><option value="">— Sélectionner —</option><option>Homme</option><option>Femme</option><option>Non précisé</option></select></Field>
                <Field label="Téléphone" req><input style={inp} value={form.telephone} onChange={set('telephone')} placeholder="+225 07 XX XX XX XX" className={errors.telephone?'err':''}/></Field>
                <Field label="Email" req><input type="email" style={inp} value={form.email} onChange={set('email')} placeholder="vous@email.com" className={errors.email?'err':''}/></Field>
                <Field label="Ville de résidence" req>
                  <select style={sel} value={form.ville} onChange={set('ville')} className={errors.ville?'err':''}>
                    <option value="">— Sélectionner —</option>
                    {['Abidjan – Cocody','Abidjan – Plateau','Abidjan – Marcory','Abidjan – Yopougon','Abidjan – Bingerville','Abidjan – Adjamé','Abidjan – Autre commune','Bouaké','Daloa','San-Pédro','Korhogo','Yamoussoukro','Autre ville'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Situation familiale">
                  <select style={sel} value={form.situation_familiale} onChange={set('situation_familiale')}>
                    <option value="">— Sélectionner —</option>
                    {['Célibataire sans enfant','Célibataire avec enfant(s)','En couple sans enfant','En couple avec enfant(s)','Marié(e)'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>

              <SLabel>Situation professionnelle</SLabel>
              <div style={{marginBottom:'20px'}}>
                <Field label="Type de contrat" req>
                  <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                    {['CDI','CDD','Fonctionnaire','Indépendant'].map(v=>(
                      <div key={v} className="rpill" style={{position:'relative'}}>
                        <input type="radio" name="contrat" id={`r-${v}`} value={v} checked={form.type_contrat===v} onChange={()=>setForm(f=>({...f,type_contrat:v}))}/>
                        <label htmlFor={`r-${v}`} style={{...rpillLbl,borderColor:form.type_contrat===v?'var(--gold)':'var(--border)',background:form.type_contrat===v?'var(--gold-dim)':'transparent',color:form.type_contrat===v?'var(--gold-2)':'var(--w60)'}}>{v}</label>
                      </div>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
                <Field label="Secteur d'activité" req>
                  <select style={sel} value={form.secteur} onChange={set('secteur')} className={errors.secteur?'err':''}>
                    <option value="">— Sélectionner —</option>
                    {['Banque / Finance / Assurance','Télécommunications','BTP / Immobilier','Commerce / Distribution','Éducation / Formation','Santé','Industrie / Manufacture','Transport / Logistique','Fonction publique','ONG / Organisation internationale','Tech / Startup','Autre'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Intitulé du poste" req><input style={inp} value={form.poste} onChange={set('poste')} placeholder="Ex : Responsable Comptable" className={errors.poste?'err':''}/></Field>
                <Field label="Ancienneté" req>
                  <select style={sel} value={form.anciennete} onChange={set('anciennete')} className={errors.anciennete?'err':''}>
                    <option value="">— Sélectionner —</option>
                    {['Moins de 6 mois','6 mois – 1 an','1 – 2 ans','2 – 3 ans','3 – 5 ans','Plus de 5 ans'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>

              <SLabel>Revenus déclarés</SLabel>
              <div className="g3" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'20px',marginBottom:'20px'}}>
                <Field label="Salaire net mensuel (FCFA)" req><input type="number" style={inp} value={form.salaire_net} onChange={set('salaire_net')} placeholder="700 000" className={errors.salaire_net?'err':''}/></Field>
                <Field label="Autres revenus" opt><input type="number" style={inp} value={form.autres_revenus} onChange={set('autres_revenus')} placeholder="0"/></Field>
                <Field label="Charges fixes" opt><input type="number" style={inp} value={form.charges_mensuelles} onChange={set('charges_mensuelles')} placeholder="Loyer, crédits…"/></Field>
              </div>

              <Consent checked={consent1} onChange={setConsent1}>
                J&apos;accepte que mes informations soient utilisées de manière <strong style={{color:'var(--gold-2)'}}>agrégée et anonymisée</strong> pour constituer un dossier collectif destiné à des constructeurs automobiles.
              </Consent>

              <div style={actionsStyle}>
                <button className="btn-cta" onClick={nextStep} style={btnCta}>
                  Continuer — Étape 2 &nbsp;›
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2 ─── */}
          {step === 2 && (
            <div className="fstep">
              <FormHead tag="Étape 2 sur 2" title={<>Votre projet<br/><em>véhicule</em></>} sub="Dites-nous quel véhicule vous envisagez. Ces informations permettent de cibler le bon constructeur et de lui présenter une demande précise." />

              <div style={{display:'flex',gap:'16px',border:'1px solid var(--gold-line)',borderLeft:'2px solid var(--gold)',background:'var(--gold-dim)',padding:'20px 24px',marginBottom:'32px'}}>
                <p style={{fontSize:'13px',fontWeight:300,color:'var(--w60)',lineHeight:1.75}}>
                  ◈ &nbsp;<strong style={{color:'var(--gold-2)'}}>Aucun document à fournir.</strong> Vos déclarations suffisent pour constituer le dossier collectif. La vérification individuelle n&apos;interviendra qu&apos;au moment du financement réel, si le programme est lancé.
                </p>
              </div>

              <SLabel>Budget & financement</SLabel>
              <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
                <Field label="Budget véhicule envisagé (FCFA)" req>
                  <select style={sel} value={form.budget_vehicule} onChange={set('budget_vehicule')}>
                    <option value="">— Sélectionner —</option>
                    {['5 000 000 – 8 000 000','8 000 000 – 12 000 000','12 000 000 – 18 000 000','18 000 000 – 25 000 000','Plus de 25 000 000'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Durée de remboursement">
                  <select style={sel} value={form.duree_remboursement} onChange={set('duree_remboursement')}>
                    <option value="">— Sélectionner —</option>
                    {['24 mois','36 mois','48 mois','60 mois'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Apport personnel envisagé">
                  <select style={sel} value={form.apport_personnel} onChange={set('apport_personnel')}>
                    <option value="">— Sélectionner —</option>
                    {['Aucun apport','Moins de 10%','10% – 20%','20% – 30%','Plus de 30%'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Taux d'intérêt acceptable">
                  <select style={sel} value={form.taux_acceptable} onChange={set('taux_acceptable')}>
                    <option value="">— Sélectionner —</option>
                    {['Moins de 5%','5% – 8%','8% – 12%','Peu importe si < 18% banques'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>

              <SLabel>Préférences véhicule</SLabel>
              <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
                <Field label="Marque préférée" opt>
                  <select style={sel} value={form.marque_preferee} onChange={set('marque_preferee')}>
                    <option value="">— Aucune préférence —</option>
                    {['BYD','Chery','JAC','Haval / GWM','MG','Geely','Toyota','Hyundai','Autre'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Type de véhicule">
                  <select style={sel} value={form.type_vehicule} onChange={set('type_vehicule')}>
                    <option value="">— Sélectionner —</option>
                    {['Berline / Citadine','SUV / 4x4','Pick-up','Monospace / Van','Peu importe'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Motorisation">
                  <select style={sel} value={form.motorisation} onChange={set('motorisation')}>
                    <option value="">— Sélectionner —</option>
                    {['Essence','Diesel','Hybride','Électrique','Peu importe'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Délai d'achat envisagé" req>
                  <select style={sel} value={form.delai_achat} onChange={set('delai_achat')}>
                    <option value="">— Sélectionner —</option>
                    {['Dès que le programme est disponible','Dans les 6 mois','Dans l\'année','Dans 1 à 2 ans'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>

              <SLabel>Votre mot <span style={{fontSize:'9px',color:'var(--w30)',fontWeight:300,letterSpacing:'1px',textTransform:'none',marginLeft:'6px'}}>optionnel</span></SLabel>
              <div style={{marginBottom:'20px'}}>
                <textarea style={{...inp,width:'100%',minHeight:'100px',lineHeight:1.8,resize:'vertical'}} value={form.commentaire} onChange={set('commentaire')} placeholder="Votre situation, pourquoi vous rejoignez le mouvement, vos attentes…"/>
              </div>

              <Consent checked={consent2} onChange={setConsent2}>
                Je certifie que les informations déclarées sont exactes. Je comprends que mes données sont protégées et ne seront <strong style={{color:'var(--gold-2)'}}>jamais vendues ni transmises</strong> à des tiers sans mon accord explicite.
              </Consent>

              <div style={actionsStyle}>
                <button onClick={() => { setStep(1); window.scrollTo({top:0,behavior:'smooth'}); }} style={{padding:'15px 28px',border:'1px solid var(--border)',background:'transparent',color:'var(--w60)',fontFamily:'Jost,sans-serif',fontSize:'12px',fontWeight:400,letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',borderRadius:'2px'}}>
                  ‹ Retour
                </button>
                <button className="btn-cta" onClick={submit} disabled={loading} style={{...btnCta,flex:1,opacity:loading?.7:1,pointerEvents:loading?'none':'auto'}}>
                  {loading ? 'Enregistrement…' : 'Rejoindre le mouvement'}
                </button>
              </div>
            </div>
          )}

          {/* ─── SUCCESS ─── */}
          {step === 3 && (
            <div className="fstep" style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'60px 0'}}>
              <div style={{width:'90px',height:'90px',marginBottom:'36px',border:'1px solid var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                <div style={{position:'absolute',inset:'6px',border:'1px solid var(--gold-line)'}}/>
                <span style={{fontSize:'34px',color:'var(--gold)',position:'relative',zIndex:1}}>✦</span>
              </div>
              <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'52px',fontWeight:300,lineHeight:1.1,marginBottom:'18px'}}>
                Vous êtes dans<br/><em style={{fontStyle:'italic',fontWeight:600,color:'var(--gold-2)'}}>le mouvement.</em>
              </h2>
              <p style={{fontSize:'14px',fontWeight:300,color:'var(--w60)',maxWidth:'420px',lineHeight:1.9,marginBottom:'40px'}}>
                Votre dossier a été enregistré avec succès. Nous vous contacterons dès que nous atteignons notre objectif ou qu&apos;un constructeur répond favorablement.
              </p>
              <div style={{border:'1px solid var(--gold-line)',background:'var(--gold-dim)',padding:'24px 56px',marginBottom:'40px',position:'relative'}}>
                <div style={{position:'absolute',top:'-1px',left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,var(--gold),transparent)'}}/>
                <div style={{position:'absolute',bottom:'-1px',left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,var(--gold),transparent)'}}/>
                <div style={{fontSize:'9px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--w30)',marginBottom:'8px'}}>Numéro de dossier</div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'30px',fontWeight:700,color:'var(--gold-2)',letterSpacing:'2px'}}>{refNumber}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'var(--border)',width:'100%',maxWidth:'520px',marginBottom:'40px'}}>
                {[
                  'Un email de confirmation vous est envoyé sous peu.',
                  'Votre profil est visible dans notre dossier collectif anonymisé.',
                  'Partagez — plus on est nombreux, plus le dossier est fort.',
                  'Vous êtes informé(e) de chaque avancée avec les constructeurs.',
                ].map((txt,i) => (
                  <div key={i} style={{background:'var(--ink-2)',padding:'24px',textAlign:'left'}}>
                    <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'28px',fontWeight:700,color:'rgba(201,168,76,.2)',marginBottom:'8px'}}>0{i+1}</div>
                    <p style={{fontSize:'13px',fontWeight:300,color:'var(--w60)',lineHeight:1.7}}>{txt}</p>
                  </div>
                ))}
              </div>
              <button onClick={share} style={{display:'inline-flex',alignItems:'center',gap:'10px',padding:'15px 36px',border:'1px solid var(--gold)',background:'transparent',color:'var(--gold)',fontFamily:'Jost,sans-serif',fontSize:'11px',fontWeight:500,letterSpacing:'3px',textTransform:'uppercase',cursor:'pointer',borderRadius:'2px'}}>
                ↗ &nbsp;Partager la plateforme
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* ── Shared sub-components ── */
const inp: React.CSSProperties = {background:'var(--ink-3)',border:'1px solid var(--border)',borderBottom:'1px solid rgba(248,244,237,.18)',padding:'14px 18px',fontFamily:'Jost,sans-serif',fontSize:'15px',fontWeight:300,color:'var(--white)',borderRadius:'2px',width:'100%',transition:'border-color .25s,background .25s,box-shadow .25s'};
const sel: React.CSSProperties = {...inp,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(248,244,237,0.3)' stroke-width='1.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",backgroundRepeat:'no-repeat',backgroundPosition:'right 16px center',paddingRight:'44px',cursor:'pointer'};
const rpillLbl: React.CSSProperties = {display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 20px',border:'1px solid var(--border)',fontSize:'13px',fontWeight:400,letterSpacing:'.5px',cursor:'pointer',borderRadius:'2px',minWidth:'90px',transition:'all .2s'};
const actionsStyle: React.CSSProperties = {display:'flex',gap:'14px',alignItems:'center',marginTop:'48px',paddingTop:'40px',borderTop:'1px solid var(--border)'};
const btnCta: React.CSSProperties = {padding:'17px 40px',background:'var(--gold)',border:'none',color:'var(--ink)',fontFamily:'Jost,sans-serif',fontSize:'12px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',cursor:'pointer',borderRadius:'2px',position:'relative',overflow:'hidden',transition:'all .25s'};

function FormHead({tag,title,sub}:{tag:string;title:React.ReactNode;sub:string}) {
  return (
    <div style={{marginBottom:'48px'}}>
      <div style={{fontSize:'10px',fontWeight:500,letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',marginBottom:'20px',display:'flex',alignItems:'center',gap:'14px'}}>
        {tag}<div style={{maxWidth:'40px',flex:1,height:'1px',background:'var(--gold-line)'}}/>
      </div>
      <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'48px',fontWeight:300,lineHeight:1.1,letterSpacing:'-.5px',marginBottom:'14px'}}>{title}</h2>
      <p style={{fontSize:'14px',fontWeight:300,lineHeight:1.9,color:'var(--w60)'}}>{sub}</p>
    </div>
  );
}

function SLabel({children}:{children:React.ReactNode}) {
  return (
    <div style={{fontSize:'9px',fontWeight:500,letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',margin:'40px 0 22px',display:'flex',alignItems:'center',gap:'16px'}}>
      {children}<div style={{flex:1,height:'1px',background:'linear-gradient(90deg,var(--gold-line),transparent)'}}/>
    </div>
  );
}

function Field({label,children,req:r,opt:o}:{label:string;children:React.ReactNode;req?:boolean;opt?:boolean}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
      <label style={{fontSize:'10px',fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'var(--w60)',display:'flex',alignItems:'center',gap:'6px'}}>
        {label}
        {r && <span style={{color:'var(--gold)',fontSize:'14px',lineHeight:1}}>*</span>}
        {o && <span style={{color:'var(--w30)',fontSize:'9px',fontWeight:400,letterSpacing:'1px',textTransform:'uppercase'}}>optionnel</span>}
      </label>
      {children}
    </div>
  );
}

function Consent({checked,onChange,children}:{checked:boolean;onChange:(v:boolean)=>void;children:React.ReactNode}) {
  return (
    <div style={{display:'flex',gap:'16px',alignItems:'flex-start',padding:'20px 24px',border:'1px solid var(--border)',background:'var(--w5)',marginTop:'32px',borderRadius:'2px'}}>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{width:'18px',height:'18px',minWidth:'18px',marginTop:'1px',accentColor:'var(--gold)',cursor:'pointer'}}/>
      <p style={{fontSize:'12px',fontWeight:300,color:'var(--w60)',lineHeight:1.8}}>{children}</p>
    </div>
  );
}
