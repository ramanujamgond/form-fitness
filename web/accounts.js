import {validDate} from './scheduling.js?v=41';
import {stageHistory} from './training.js?v=41';
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
 profile.stageHistory=stageHistory(p.stageHistory);profile.easyUntil=validDate(p.easyUntil)?p.easyUntil:null;
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
export function accountPanel({auth,cloudReady,emailReady,googleReady=false,mode,message,resetToken}) {
 let body;
 if(resetToken)body=`<h2>Set a new PIN</h2><form data-form="resetpin">${pinInput('pin','New PIN',true)}${pinInput('confirm','Repeat new PIN',true)}<p><button class="btn">Save new PIN</button></p></form>`;
 else if(auth)body=`<h2>Your account</h2><p>Signed in as <strong>${esc(auth.user.name)}</strong><br>${esc(auth.user.email)}</p><p><button class="btn" data-action="sync">Sync now</button> <button class="btn secondary" data-action="signout">Log out / switch account</button></p><p><button class="btn secondary" data-action="authmode:forgot">Reset PIN by email</button></p>${mode==='forgot'?recoveryForm():''}`;
 else if(!cloudReady)body='<h2>Your account</h2><p>Could not reach the account service. Try connecting again to sign in.</p><button class="btn secondary" data-action="checkcloud">Check connection</button>';
 else if(mode==='forgot')body=`<h2>Forgot your PIN?</h2>${recoveryForm()}${backToLogin()}`;
 else if(mode==='verify')body=`<h2>Verify your email</h2><p>Open the link in your inbox, then return here to sign in. Check your spam folder too. Wait 60 seconds before requesting another link.</p><form data-form="resendverification"><label>Email</label><input name="email" type="email" autocomplete="email" required><p><button class="btn secondary" ${emailReady?'':'disabled'}>Resend verification link</button></p></form>${backToLogin()}`;
 else body=`<h2>${mode==='signup'?'Create your account':'Welcome back'}</h2>${googleReady?'<p><button class="btn google-signin" data-action="googlelogin"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24.4v7.42h10.77a9.2 9.2 0 0 1-4 6.04v5.02h6.47c3.79-3.49 5.97-8.63 5.97-14.56Z"/><path fill="#34A853" d="M24.4 44c5.4 0 9.93-1.79 13.24-4.98l-6.47-5.02c-1.79 1.2-4.08 1.93-6.77 1.93-5.21 0-9.63-3.52-11.22-8.25H6.5v5.18A20 20 0 0 0 24.4 44Z"/><path fill="#FBBC05" d="M13.18 27.68a12 12 0 0 1 0-7.36v-5.18H6.5a20 20 0 0 0 0 17.72l6.68-5.18Z"/><path fill="#EA4335" d="M24.4 12.07c2.95 0 5.58 1.02 7.67 3.02l5.75-5.75A19.3 19.3 0 0 0 24.4 4 20 20 0 0 0 6.5 15.14l6.68 5.18c1.59-4.73 6.01-8.25 11.22-8.25Z"/></svg> Continue with Google</button></p><p class="muted">Same email, same journal. New here? We’ll help you get started.</p><p class="auth-divider">or use email + PIN</p>':''}<div class="segmented"><button data-action="authmode:signin" class="${mode!=='signup'?'active':''}">Sign in</button><button data-action="authmode:signup" class="${mode==='signup'?'active':''}">Sign up</button></div>${mode==='signup'&&!emailReady?'<p class="notice">Sign-up will open when verification email delivery is configured.</p>':`<form data-form="account" data-mode="${mode}">${mode==='signup'?'<label>Your name</label><input name="name" maxlength="80" autocomplete="given-name" required>':''}<label>Email</label><input name="email" type="email" autocomplete="username" required>${pinInput('pin',mode==='signup'?'Create a PIN':'PIN',mode==='signup')}${mode==='signup'?pinInput('confirm','Repeat PIN',true):''}<p><button class="btn">${mode==='signup'?'Create account':'Sign in'}</button></p></form>`}<p><button class="btn secondary" data-action="authmode:forgot">Forgot PIN?</button> <button class="btn secondary" data-action="authmode:verify">Verify email</button></p><small>Have an old password? Use Forgot PIN to choose a new PIN.</small>`;
 return `<section class="card" id="account-panel">${body}${message?`<p class="notice" role="status">${esc(message)}</p>`:''}${!emailReady&&cloudReady?'<p class="muted">Email verification and PIN reset are not available yet.</p>':''}<p id="cloud-status" class="muted"></p></section>`;
}
function recoveryForm(){return '<form data-form="forgotpin"><label>Account email</label><input name="email" type="email" autocomplete="email" required><p><button class="btn">Send reset link</button></p></form><small>The link expires in 15 minutes. Setting a new PIN signs out other sessions. Wait 60 seconds before requesting another link.</small>';}
function backToLogin(){return '<p><button class="btn secondary" data-action="authmode:signin">Back to sign in</button></p>';}
export function onboarding() {
 return `<section class="card beginner-guide" id="onboarding"><div class="eyebrow">Your gym companion</div><h1>Your first workout starts here.</h1><p>Follow a simple plan to build strength and muscle.</p><ol class="journey"><li><strong>Warm up</strong> · one short checklist.</li><li><strong>Train</strong> · watch the demo, do your set, save it.</li><li><strong>Finish</strong> · cool down and see your progress.</li></ol><p>A rep is one movement. A set is a group of reps. Start light and leave 2–3 good reps in reserve.</p><small>Start as a beginner. Move up when you’re ready. Missed days won’t add extra workouts.</small><p><button class="btn" data-action="begin">Show my workout →</button></p></section>`;
}
