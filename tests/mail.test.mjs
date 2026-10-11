import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emailConfigured,emailTransport,sendAccountEmail} from '../server/email.js';
import {validPin} from '../server/pin.js';
import {preferencesFrom} from '../web/accounts.js';
test('PIN accepts 6–12 digits only, including leading zeroes',()=>{
 for(const value of ['012345','123456789012'])assert.ok(validPin(value));
 for(const value of ['12345','1234567890123','abcdef','123 456',123456])assert.equal(validPin(value),false);
});
const smtpEnv={SMTP_HOST:'smtp.gmail.com',SMTP_PORT:'587',SMTP_USER:'sender@gmail.com',SMTP_PASS:'test-app-password',EMAIL_FROM:'FORM <sender@gmail.com>'};
test('SMTP sends reset links using STARTTLS without exposing the credential in mail',async()=>{
 let options,message,closed=false;
 await sendAccountEmail({to:'sister@example.com',kind:'reset',url:'https://form.example.com/reset'},{env:smtpEnv,createTransport:value=>{options=value;return {sendMail:async value=>{message=value;return {accepted:value.to,rejected:[]};},close(){closed=true;}};}});
 assert.equal(options.host,'smtp.gmail.com');assert.equal(options.port,587);assert.equal(options.secure,false);assert.equal(options.requireTLS,true);assert.equal(options.auth.pass,smtpEnv.SMTP_PASS);
 assert.equal(message.to[0],'sister@example.com');assert.match(message.text,/15 minutes/);assert.match(message.subject,/PIN/);assert.ok(!JSON.stringify(message).includes(smtpEnv.SMTP_PASS));assert.ok(closed);
});
test('port 465 uses immediate TLS and unsupported ports fail configuration',()=>{
 let options;emailTransport({...smtpEnv,SMTP_PORT:'465'},value=>{options=value;return {};});assert.equal(options.secure,true);assert.equal(options.requireTLS,true);
 assert.equal(emailConfigured({...smtpEnv,SMTP_PORT:'25'}),false);
 assert.equal(emailConfigured({...smtpEnv,SMTP_PASS:''}),false);
});
test('missing, rejected and failed SMTP delivery cannot claim success or expose credentials',async()=>{
 assert.equal(emailConfigured({}),false);await assert.rejects(sendAccountEmail({},{env:{}}),/not configured/);
 for(const sendMail of [async()=>({accepted:[],rejected:['sister@example.com']}),async()=>{throw Error('secret '+smtpEnv.SMTP_PASS);}]){
  let closed=false;await assert.rejects(sendAccountEmail({},{env:smtpEnv,createTransport:()=>({sendMail,close(){closed=true;}})}),err=>err.message.includes('delivery failed')&&!err.message.includes(smtpEnv.SMTP_PASS));assert.ok(closed);
 }
});
test('fresh accounts have no inherited body details and equipment is unknown',()=>{
 const {profile,equipment}=preferencesFrom([]);assert.equal(profile.weight,null);assert.equal(profile.height,null);assert.equal(profile.experience,'New to the gym');assert.equal(profile.onboardingDone,false);assert.deepEqual(equipment,{});
});
test('synced preferences sanitize stage and optional profile values',()=>{
 const {profile,equipment}=preferencesFrom([{type:'preferences',updatedAt:'2026-10-11T10:00:00.000Z',data:{profile:{weight:500,stage:'<script>',experience:'New to the gym',onboardingDone:true},equipment:{press:'unknown',raise:'bad'}}}]);
 assert.equal(profile.weight,null);assert.equal(profile.stage,'Foundation');assert.equal(profile.onboardingDone,true);assert.deepEqual(equipment,{press:'unknown'});
});
