// Shared photos explain training terms; text carries the exact counts and timing.
const media={
 rep:['squat','Stand → lower to the bench → stand again. That complete cycle is one rep.'],
 set:['press','Example: 10 controlled chest presses, rest, then another 10 = 2 sets of 10.'],
 rest:['rest','Pause between sets. Use the timer for about 90–120 seconds, or longer if needed.'],
 rir:['press','Stop while you could still perform 2–3 more clean repetitions.'],
 rpe:['press','RPE 7–8 is roughly 2–3 clean reps left. Your effort rating is an estimate.'],
 range:['squat','8–12 means a target range of repetitions, with controlled technique throughout.'],
 load:['load','The selector pin chooses resistance. Check the units and settings on your own machine.'],
 volume:['press','Example: 2 sets × 10 reps × 20 kg = 400 kg of logged volume.'],
 warmup:['press','Rehearse with a light preparation load before logging your working sets.'],
 tempo:['squat','Move smoothly: about 2 seconds lowering and 1 second lifting. Keep breathing.'],
 overload:['load','Build controlled reps first, then consider the smallest weight step when ready.'],
 form:['row','Keep a steady position and move through a comfortable range without jerking.'],
 superset:['press','A superset pairs two different exercises before resting. It is not used in this beginner plan.']
};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function basicsVisual(id,label){
 const entry=media[id];if(!entry)return '';
 const [photo,caption]=entry,path=['rest','load'].includes(photo)?`./img/basics/${photo}.webp`:`./img/generated/${photo}.webp`;
 return `<figure class="basic-media"><img src="${path}" alt="${esc(label)} — ${esc(caption)}" width="800" height="450" loading="lazy" decoding="async"><figcaption><small>AI-generated teaching image</small><p>${esc(caption)}</p></figcaption></figure>`;
}
export function basicsExercise(id){const photo=media[id]?.[0];return ['rest','load'].includes(photo)?null:photo;}
