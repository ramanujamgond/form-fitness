import {validDate} from './scheduling.js?v=36';
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const goals = ['Not sure yet','Get fitter','Build strength','Lose fat','Build core strength'];
export const experiences = ['New to the gym','Some experience','Regular training'];
export const defaultProfile = () => ({name:'',weight:null,height:null,protein:120,pelvic:false,stage:'Foundation',goal:'Not sure yet',experience:'New to the gym',onboardingDone:false,workoutDays:5,planHistory:[]});
export function preferencesFrom(records) {
 const row=records.filter(r=>r.type==='preferences'&&!r.deleted).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 const p=row?.data?.profile||{},profile=defaultProfile();
 for(const key of ['weight','height','protein']){
  const [min,max]=key==='weight'?[25,400]:key==='height'?[100,250]:[40,250];
  if(Number.isFinite(p[key])&&p[key]>=min&&p[key]<=max)profile[key]=p[key];
 }
 profile.name=typeof p.name==='string'?p.name.slice(0,80):'';
 profile.stage=['Foundation','Building','Intermediate','Advanced'].includes(p.stage)?p.stage:'Foundation';
 profile.goal=goals.includes(p.goal)?p.goal:goals[0];profile.experience=experiences.includes(p.experience)?p.experience:experiences[0];
 profile.workoutDays=Number.isInteger(p.workoutDays)&&p.workoutDays>=1&&p.workoutDays<=7?p.workoutDays:5;
 profile.planHistory=Array.isArray(p.planHistory)?p.planHistory.filter(r=>r&&validDate(r.effectiveFrom)&&Number.isInteger(r.days)&&r.days>=1&&r.days<=7).slice(-365):[];
 profile.pelvic=p.pelvic===true;profile.onboardingDone=p.onboardingDone===true;
 profile.guideVersion=p.guideVersion===22?22:null;
 profile.diet=['any','vegetarian','vegan'].includes(p.diet)?p.diet:null;
 profile.avoid=typeof p.avoid==='string'?p.avoid.slice(0,120):'';
 profile.mealChoices=Object.fromEntries(Object.entries(p.mealChoices||{}).filter(([key,value])=>/^\d{4}-\d{2}-\d{2}:(breakfast|lunch|snack|dinner)$/.test(key)&&Number.isInteger(value)&&value>=0&&value<10).slice(-365));
 const equipment={};for(const [id,value] of Object.entries(row?.data?.equipment||{}))if(['yes','no','unknown'].includes(value))equipment[id]=value;
 return {profile,equipment};
}
const pinInput=(name,label,confirm=false)=>`<label>${label}</label><input name="${name}" type="password" inputmode="numeric" pattern="[0-9]{6,12}" minlength="6" maxlength="12" autocomplete="${confirm?'new-password':'current-password'}" required><small>Use 6–12 digits. A longer PIN is stronger.</small>`;
export function accountPanel({auth,cloudReady,emailReady,mode,message,resetToken}) {
 let body;
 if(resetToken)body=`<h2>Set a new PIN</h2><form data-form="resetpin">${pinInput('pin','New PIN',true)}${pinInput('confirm','Repeat new PIN',true)}<p><button class="btn">Save new PIN</button></p></form>`;
 else if(auth)body=`<h2>Your account</h2><p>Signed in as <strong>${esc(auth.user.name)}</strong><br>${esc(auth.user.email)}</p><p><button class="btn" data-action="sync">Sync now</button> <button class="btn secondary" data-action="signout">Sign out / switch account</button></p><p><button class="btn secondary" data-action="authmode:forgot">Reset PIN by email</button></p>${mode==='forgot'?recoveryForm():''}`;
 else if(!cloudReady)body='<h2>Your account</h2><p>Account connection is unavailable. Connect to the internet and try again to sign in.</p><button class="btn secondary" data-action="checkcloud">Check connection</button>';
 else if(mode==='forgot')body=`<h2>Forgot your PIN?</h2>${recoveryForm()}${backToLogin()}`;
 else if(mode==='verify')body=`<h2>Verify your email</h2><p>Open the link in your inbox, then return here to sign in. Check your spam folder too. Wait 60 seconds before requesting another link.</p><form data-form="resendverification"><label>Email</label><input name="email" type="email" autocomplete="email" required><p><button class="btn secondary" ${emailReady?'':'disabled'}>Resend verification link</button></p></form>${backToLogin()}`;
 else body=`<h2>${mode==='signup'?'Create your account':'Welcome back'}</h2><div class="segmented"><button data-action="authmode:signin" class="${mode!=='signup'?'active':''}">Sign in</button><button data-action="authmode:signup" class="${mode==='signup'?'active':''}">Sign up</button></div>${mode==='signup'&&!emailReady?'<p class="notice">Sign-up will open when verification email delivery is configured.</p>':`<form data-form="account" data-mode="${mode}">${mode==='signup'?'<label>Your name</label><input name="name" maxlength="80" autocomplete="given-name" required>':''}<label>Email</label><input name="email" type="email" autocomplete="username" required>${pinInput('pin',mode==='signup'?'Choose a PIN':'PIN',mode==='signup')}${mode==='signup'?pinInput('confirm','Repeat PIN',true):''}<p><button class="btn">${mode==='signup'?'Create account & verify email':'Sign in'}</button></p></form>`}<p><button class="btn secondary" data-action="authmode:forgot">Forgot PIN?</button> <button class="btn secondary" data-action="authmode:verify">Verify email</button></p><small>Used a password before? Choose Forgot PIN to set your new PIN.</small>`;
 return `<section class="card" id="account-panel">${body}${message?`<p class="notice" role="status">${esc(message)}</p>`:''}${!emailReady&&cloudReady?'<p class="muted">Verification and recovery email delivery still needs setup.</p>':''}<p id="cloud-status" class="muted"></p></section>`;
}
function recoveryForm(){return '<form data-form="forgotpin"><label>Account email</label><input name="email" type="email" autocomplete="email" required><p><button class="btn">Send reset link</button></p></form><small>The link expires in 15 minutes. Setting a new PIN signs out other sessions. Wait 60 seconds before requesting another link.</small>';}
function backToLogin(){return '<p><button class="btn secondary" data-action="authmode:signin">Back to sign in</button></p>';}
export function onboarding() {
 return `<section class="card beginner-guide" id="onboarding"><div class="eyebrow">Start here · Beginner guide</div><h1>Your first step, explained.</h1><p>No training experience needed. We’ll guide you through a beginner plan, one action at a time.</p><ol class="journey"><li><h3>Learn the basics</h3><p>A rep is one movement. A set is a group of reps. Start light enough to finish with 2–3 more clean reps possible.</p></li><li><h3>Follow your workout</h3><p>Warm up, watch the demonstration, then record each set’s reps and weight. Rest before the next set. Ask gym staff to check unfamiliar equipment.</p></li><li><h3>Fuel and recover</h3><p>Your day includes meal suggestions and recovery. Times and portions are starting points you can adjust.</p></li><li><h3>Build confidence</h3><p>Your stage grows with recorded technique, effort and recovery. Missed days do not create extra workouts.</p></li></ol><p>If a movement causes pain or tingling, stop it and record why.</p><button class="btn" data-action="begin">I’m ready · Show my day →</button></section>`;
}
