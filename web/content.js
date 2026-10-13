import {indianVideos,indianBikeVideo} from './indian-videos.js?v=36';
export const exercises = {
 assisted:{name:'Assisted pull-up',muscles:'Lats · biceps · upper back',pattern:'pull',reps:'6–10',setup:'Have staff demonstrate the assistance platform and safe entry/exit. More assistance makes the movement easier.',cues:['Choose enough assistance for controlled reps.','Pull without swinging or shrugging.','Lower smoothly; stop with pain or tingling.'],mistake:'Do not treat assistance as ordinary added weight. Less assistance is a progression, only when controlled and symptom-free.',alternative:'Comfortable lat pulldown, after equipment setup.',video:null},
 press:{name:'Machine chest press',muscles:'Chest · triceps · front shoulders',pattern:'push',reps:'8–12',setup:'Adjust the seat so handles meet mid-chest. Keep feet planted and back supported.',cues:['Keep wrists aligned with forearms.','Press smoothly without shrugging.','Return through a comfortable range.'],mistake:'Do not bounce, force a deep stretch, or continue with wrist pain or tingling.',alternative:'A comfortable neutral-grip press, only if symptom-free.',video:null},
 row:{name:'Chest-supported row',muscles:'Mid-back · lats · biceps',pattern:'pull',reps:'8–12',setup:'Adjust the chest pad and seat. Place feet securely and begin with a light load.',cues:['Keep chest in contact with the pad.','Drive elbows back without shrugging.','Return slowly without jerking.'],mistake:'Avoid lifting off the pad or pulling with momentum.',alternative:'Seated cable row if equipment is confirmed.',video:'https://www.youtube.com/watch?v=FU6YQawma2Q'},
 pulldown:{name:'Lat pulldown',muscles:'Lats · biceps · upper back',pattern:'pull',reps:'8–12',setup:'Secure the thigh pad, plant feet, and choose a comfortable grip.',cues:['Sit tall with a small natural lean.','Drive elbows downward toward your sides.','Return with control.'],mistake:'Do not pull behind the neck or swing your torso.',alternative:'Assisted pull-up after technique review.',video:null},
 raise:{name:'Lateral raise',muscles:'Side shoulders',pattern:'push',reps:'10–15',setup:'Use light dumbbells or a confirmed machine, with a relaxed grip.',cues:['Keep elbows slightly bent.','Raise within a comfortable range.','Lower slowly, keeping shoulders away from ears.'],mistake:'Do not swing or shrug to lift a heavier weight.',alternative:'Skip if shoulder or arm symptoms occur.',video:null},
 pushup:{name:'Push-up',muscles:'Chest · triceps · core',pattern:'push',reps:'8–12',setup:'Use a stable surface. Choose an incline if floor repetitions are too demanding.',cues:['Keep head, torso, and hips aligned.','Brace gently and lower with control.','Press back up without hips sagging.'],mistake:'Stop if wrist pain or arm tingling appears. Do not chase a daily rep total through symptoms.',alternative:'Symptom-free machine press; assessment comes first.',video:'https://www.youtube.com/watch?v=WDIpL0pjun0'},
 legpress:{name:'Leg press',muscles:'Quadriceps · glutes',pattern:'legs',reps:'8–12',setup:'Set seat/backrest, learn safety stops, and place feet comfortably on the platform.',cues:['Keep knees tracking in the direction of toes.','Lower only while pelvis and back remain supported.','Press smoothly without snapping knees straight.'],mistake:'Do not lower until your pelvis rolls off the pad.',alternative:'Bodyweight squat to a stable bench.',video:'https://www.youtube.com/watch?v=cDGOn-yfKJA'},
 squat:{name:'Squat to bench',muscles:'Quadriceps · glutes · core',pattern:'legs',reps:'8–12',setup:'Use a stable bench behind you. Start without external weight.',cues:['Keep whole feet planted.','Bend hips and knees together.','Touch the bench gently and stand with control.'],mistake:'Do not collapse onto the bench or force depth.',alternative:'Leg press after equipment orientation.',video:null},
 curl:{name:'Leg curl',muscles:'Hamstrings',pattern:'legs',reps:'10–15',setup:'Align knees with the machine pivot and position pads as its instructions show.',cues:['Keep hips supported.','Bend knees smoothly.','Return slowly without lifting your hips.'],mistake:'Avoid a weight that forces your body off the pad.',alternative:'Glute bridge; a different movement, not an exact replacement.',video:null},
 bridge:{name:'Glute bridge',muscles:'Glutes · hamstrings',pattern:'legs',reps:'10–15',setup:'Lie on your back with knees bent and feet flat, arms relaxed.',cues:['Exhale and brace gently.','Lift hips until shoulders, hips, and knees align.','Lower without arching your lower back.'],mistake:'Do not turn the movement into a lower-back arch.',alternative:'Supported hip-thrust machine after instruction.',video:null},
 calf:{name:'Calf raise',muscles:'Calves',pattern:'legs',reps:'12–15',setup:'Stand on a flat surface with light support for balance.',cues:['Rise through the balls of your feet.','Pause briefly.','Lower heels slowly.'],mistake:'Avoid bouncing or rolling your ankles.',alternative:'Seated calf raise.',video:null},
 deadbug:{name:'Dead bug',muscles:'Abdominal muscles · trunk control',pattern:'core',reps:'6–10 each side',setup:'Lie on your back with hips and knees bent. Start with legs only if needed.',cues:['Breathe normally with a gentle brace.','Extend one leg only as far as your trunk stays still.','Return and alternate sides.'],mistake:'Do not hold your breath or arch the back as the leg extends.',alternative:'Short, controlled heel slides.',video:null},
 walk:{name:'Easy cardio',muscles:'Cardiovascular endurance',pattern:'cardio',reps:'20–30 minutes',setup:'Choose walking or cycling at an intensity that permits conversation.',cues:['Start easy and build gradually.','Use a comfortable pace.','Finish with a few easier minutes.'],mistake:'Stop for dizziness, chest discomfort, or unusual breathlessness.',alternative:'Shorter bouts of walking.',video:null}
};
// Equipment evidence describes existing notes, not a verified current inventory.
// Each YouTube ID returned HTTP 200 from YouTube oEmbed on 10 October 2026; label is the video title and channel.
const equipmentGuide={
 assisted:['Assisted pull-up machine with knee/foot platform',['pulldown'],['assisted'],'6i7adZVlwIk','How to properly use the assisted pull-up machine · Gerardi Performance'],
 press:['Chest-press machine with adjustable seat',['pushup'],['press'],'CIykDiF4sfg','How to do a seated chest press · PureGym'],
 row:['Chest-supported row machine with secure foot supports',['cablerow'],['row'],'FU6YQawma2Q','How to properly use the chest-supported row machine · Colossus Fitness'],
 pulldown:['Lat-pulldown station, bar and adjustable thigh pad',['assisted'],['pulldown'],'AOpi-p0cJkc','Beginner’s guide: lat pulldown · SilverSneakers'],
 raise:['Pair of light dumbbells, or a cable tower with a D-handle',[],['dumbbells','cable'],'3VcKaXpzqRo','How to: dumbbell side lateral raise · ScottHermanFitness'],
 pushup:['Floor, mat or a fixed, stable bench for incline push-ups',['press'],['mat','bench'],'WDIpL0pjun0','How to do a push-up · NASM'],
 legpress:['Leg-press machine with safety stops',['squat'],['legpress'],'cDGOn-yfKJA','How to do a leg press · NASM'],
 squat:['Stable bench and clear floor space',['legpress'],['bench'],'-GaRp6_b2vk','How to do a box squat · NASM'],
 curl:['Seated or prone leg-curl machine',[],['curl'],'_2Kd0d-JEUM','How to do a seated leg curl · NASM'],
 bridge:['Exercise mat or comfortable floor',[],['mat'],'SKOMwg1JLrU','How to do a glute bridge · NASM'],
 calf:['Step or flat floor with a rail for balance',[],['calfstep'],'eMTy3qylqnE','Calf raise exercise demo · Redefined Health'],
 deadbug:['Exercise mat or comfortable floor',[],['mat'],'bxn9FBrt4-A','How to do a dead bug · NASM'],
 walk:['Treadmill, stationary bike or safe walking route',[],['treadmill','bike'],'kr9fHMbztn0','Treadmill basics for beginners · Emily Elle'],
 cablerow:['Low cable row station, handle and secure foot plates',['row'],['cablerow'],'DHA7QGDa2qg','How to do a seated row · Nuffield Health']
};
exercises.cablerow={name:'Seated cable row',muscles:'Mid-back · lats · biceps',pattern:'pull',reps:'8–12',setup:'Use the low-pulley row station. Sit with feet supported and knees slightly bent. Choose a comfortable handle.',cues:['Keep the trunk steady and wrists aligned.','Draw elbows back toward your sides.','Return slowly without rounding or rocking your back.'],mistake:'Keep the torso steady; do not rock backward to move the weight.',alternative:'Chest-supported row after setup review.'};
for(const [id,[equipment,alternatives,tools,youtube,videoLabel]] of Object.entries(equipmentGuide))Object.assign(exercises[id],{equipment,evidence:'Standard equipment available — confirmed by you. Exact machine setup varies.',alternatives,tools,youtube,videoLabel});
export const tools={
 press:{name:'Chest press machine',img:'press',use:'Pushing strength for chest, front shoulders and triceps with a guided path.',setup:['Set the seat so handles line up with mid-chest.','Keep your back on the pad and feet flat.','Pick the starting load with the pin; start light.'],safety:'Keep wrists straight. Stop with wrist pain or arm tingling.'},
 row:{name:'Chest-supported row machine',img:'row',use:'Pulling strength for the mid-back with the chest supported, so the lower back can rest.',setup:['Adjust the chest pad so you can reach the handles with straight arms.','Place feet securely on the supports.','Load plates or the pin lightly at first.'],safety:'Keep the chest on the pad; do not jerk the handles.'},
 pulldown:{name:'Lat pulldown station',img:'pulldown',use:'Vertical pulling for lats and upper back; prepares you for pull-ups.',setup:['Lock thighs under the pad.','Take a grip slightly wider than shoulders.','Sit tall before the first pull.'],safety:'Pull the bar in front of your face to the upper chest, never behind the neck.'},
 assisted:{name:'Assisted pull-up machine',img:'assisted',use:'Pull-ups with a counterweight that lifts part of your bodyweight.',setup:['Choose assistance with the pin: more weight means more help.','Step up, grip the handles, then lower the knee pad carefully.','Exit by stepping down with both feet before letting go.'],safety:'Less assistance is the harder progression. Ask staff to show safe entry and exit.'},
 cablerow:{name:'Seated low cable row',img:'cablerow',use:'Horizontal pulling for the mid-back and lats with smooth cable resistance.',setup:['Attach a V-grip or bar to the low pulley.','Place feet on the plates with knees slightly bent.','Sit tall before pulling.'],safety:'Keep the torso steady; do not rock back to move the stack.'},
 legpress:{name:'Leg press',img:'legpress',use:'Squat-pattern strength for thighs and glutes with back support.',setup:['Adjust the backrest and learn the safety catches first.','Place feet hip-width in the middle of the platform.','Release the safety handles only when ready.'],safety:'Lower only while the pelvis stays on the pad; do not snap the knees straight.'},
 curl:{name:'Leg curl machine',img:'curl',use:'Knee-bending strength for the hamstrings.',setup:['Align knees with the machine pivot.','Place the roller pad just above the heels.','Secure the thigh pad if your machine has one.'],safety:'Keep hips on the seat; avoid loads that lift you off the pad.'},
 dumbbells:{name:'Dumbbells',img:'dumbbells',use:'Free weights for lateral raises and other accessory work.',setup:['Choose a light pair you can lift with control.','Lift them from the rack with a neutral back.','Return them to the rack after the set.'],safety:'Start light; swinging means the weight is too heavy.'},
 cable:{name:'Cable tower',img:'cable',use:'Adjustable pulley for cable raises and alternatives when a station is busy.',setup:['Set the pulley height for the movement.','Clip on the handle securely.','Stand stable before starting.'],safety:'Check the clip and pin before each set.'},
 bench:{name:'Flat bench',img:'bench',use:'Target for squat-to-bench depth and a stable surface for incline push-ups.',setup:['Place the bench on flat floor away from traffic.','Check it does not rock or slide.','Stand a short step in front of it.'],safety:'Touch the bench gently; do not drop onto it.'},
 mat:{name:'Exercise mat',img:'mat',use:'Comfortable floor surface for bridges, dead bugs and push-ups.',setup:['Lay the mat flat in a clear area.','Keep a towel nearby.'],safety:'Wipe it down after use.'},
 calfstep:{name:'Step and balance rail',img:'calfstep',use:'Calf raises with light hand support for balance.',setup:['Stand on flat floor or a stable step.','Hold a rail lightly; it is only for balance.'],safety:'Rise and lower slowly; avoid bouncing.'},
 treadmill:{name:'Treadmill',img:'treadmill',use:'Easy walking for the cardio day and warm-ups.',setup:['Clip the safety key to your clothing.','Start the belt slowly while standing on the side rails.','Step on, then raise speed gradually.'],safety:'Keep a pace where you can still talk. Use the stop button, not a jump off.'},
 bike:{name:'Stationary bike',img:'bike',use:'Low-impact cardio alternative to walking.',setup:['Set the seat to hip height when standing beside it.','Knee should stay slightly bent at the bottom of the pedal stroke.','Start with low resistance.'],safety:'Stop for dizziness, chest discomfort or unusual breathlessness.'}
};
export const basics=[
 {id:'rep',term:'Rep (repetition)',short:'One complete movement: down and back up.',detail:'One rep is one full cycle of an exercise, for example lowering into a squat and standing up again. Count only reps done with control.'},
 {id:'set',term:'Set',short:'A group of reps done in a row, then a rest.',detail:'“2 × 10” means 2 sets of 10 reps: do 10 reps, rest, then do 10 more. Foundation sessions use 2 working sets per exercise.'},
 {id:'rest',term:'Rest interval',short:'The pause between sets.',detail:'Rest about 90–120 seconds between strength sets so you can repeat good technique. Use the rest timer on the Train screen.'},
 {id:'rir',term:'Reps in reserve (RIR)',short:'How many more clean reps you could still do.',detail:'If you stop a set and could have done 2 more good reps, that set was RIR 2. Foundation sets finish with 2–3 reps in reserve.'},
 {id:'rpe',term:'Effort (RPE)',short:'A 1–10 effort score; 10 is maximal.',detail:'In resistance training, RPE 10 means no more reps were possible. RPE is roughly 10 minus RIR, so RIR 2 ≈ RPE 8.'},
 {id:'range',term:'Rep range',short:'The target span of reps, such as 8–12.',detail:'Choose a load that lets you reach the range with good form. When every set reaches the top of the range, it is time to consider a small increase.'},
 {id:'load',term:'Load / weight',short:'The resistance you move, in kg.',detail:'Loads only compare on the same machine and setting. On the assisted pull-up, the number is help, so a lower number is harder.'},
 {id:'volume',term:'Volume',short:'Total work: sets × reps × load.',detail:'2 sets of 10 reps at 20 kg = 400 kg of volume. The app also counts working sets per muscle group each week.'},
 {id:'warmup',term:'Warm-up vs working set',short:'Light preparation sets come before the sets that count.',detail:'Warm-up sets use a light load to rehearse the movement. Working sets are the prescribed sets you log and progress.'},
 {id:'tempo',term:'Tempo',short:'The speed of each phase of a rep.',detail:'A simple guide: lower in about 2 seconds, no pause, lift in about 1 second. Control matters more than the exact count.'},
 {id:'overload',term:'Progressive overload',short:'Small, gradual increases over time.',detail:'Add a rep, then a set or a small load step only when form is stable and you are symptom-free. Progress is measured over weeks, not single sessions.'},
 {id:'form',term:'Form / technique',short:'The safe, controlled way to do the movement.',detail:'Good form means a steady body position, a comfortable range and no pain. If form breaks down, end the set.'},
 {id:'superset',term:'Superset',short:'Two exercises done back to back, then rest.',detail:'Supersets save time but add fatigue. The foundation plan does not use them; it is listed so you recognise the term.'}
];
exercises.curl.alternative='Ask staff for another seated/prone leg-curl station. If none exists, omit this slot pending a coached replacement. A bridge is hip extension, not equivalent knee-flexion training.';
exercises.raise.alternative='Ask staff about a lateral-raise machine and its setup. If unavailable, omit this accessory; presses are not an exact substitute.';
exercises.bridge.alternative='No equipment replacement needed. A hip-thrust machine is a separate progression requiring instruction.';
exercises.calf.alternative='Bodyweight version needs only balance support; a calf machine is optional after instruction.';
exercises.deadbug.alternative='Reduce reach or use heel slides if trunk control is difficult; do not force range.';
export const gym={name:'Dynamic Gym Upgraded',location:'Ghatikia / Kalinganagar, Bhubaneswar',url:'https://share.google/V9EaVnQTEKHRnEJdw',checked:'9 October 2026',note:'You confirmed that your gym is fully equipped. The plan uses standard machines, cables, dumbbells and benches. Ask staff for the exact seat, pad and safety-stop settings; alternatives help when a station is occupied.'};
export const week=[
 {name:'Rest & reset',kind:'Recovery',ids:[]},
 {name:'Upper A',kind:'Strength',ids:['press','row','pulldown','raise']},
 {name:'Lower A + core',kind:'Strength',ids:['legpress','curl','bridge','calf','deadbug']},
 {name:'Cardio & technique',kind:'Light day',ids:['walk']},
 {name:'Upper B',kind:'Strength',ids:['cablerow','press','pulldown','raise']},
 {name:'Lower B + core',kind:'Strength',ids:['squat','curl','bridge','calf','deadbug']},
 {name:'Rest or easy walk',kind:'Recovery',ids:[]}
];
export const meals=[
 {name:'Egg breakfast',description:'3 eggs + oats or roti + fruit',protein:24,kcal:450},
 {name:'Chicken lunch',description:'100 g cooked chicken + rice + dal + vegetables',protein:40,kcal:650},
 {name:'Fish dinner',description:'150 g cooked fish + roti + vegetables',protein:35,kcal:550},
 {name:'Office snack',description:'200 g plain yogurt + 30 g roasted chana',protein:14,kcal:250},
 {name:'Egg & dal meal',description:'2 eggs + cooked dal + rice + vegetables',protein:25,kcal:550}
];
export const sources=[['Training guidance','https://acsm.org/resistance-training-guidelines-update-2026/'],['Sets, reps, rest & progression (ACSM position stand)','https://doi.org/10.1249/MSS.0b013e3181915670'],['Reps in reserve & RPE scale','https://doi.org/10.1519/JSC.0000000000001049'],['Wrist pain & tingling','https://www.nhs.uk/symptoms/hand-pain/wrist-pain/'],['Pelvic-floor guidance','https://www.niddk.nih.gov/health-information/urologic-diseases/kegel-exercises'],['Protein guidance','https://doi.org/10.1186/s12970-017-0177-8'],['Indian dietary guidance','https://nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf']];
// Reference photos are hotlinked from Wikimedia Commons; each URL returned HTTP 200 image on 10 October 2026. Credits are shown wherever a photo appears.
const photo={
 p0:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Blue_exercise_mat_20160810.jpg/500px-Blue_exercise_mat_20160810.jpg", "page": "https://commons.wikimedia.org/wiki/File:Blue_exercise_mat_20160810.jpg", "author": "Santeri Viinamäki", "license": "CC BY-SA 4.0"},
 p1:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Bridge-1.png/500px-Bridge-1.png", "page": "https://commons.wikimedia.org/wiki/File:Bridge-1.png", "author": "Everkinetic", "license": "CC BY-SA 3.0"},
 p2:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Calf-raises-1.png/500px-Calf-raises-1.png", "page": "https://commons.wikimedia.org/wiki/File:Calf-raises-1.png", "author": "Everkinetic", "license": "CC BY-SA 3.0"},
 p3:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/DumbbellLateralRaise.JPG/500px-DumbbellLateralRaise.JPG", "page": "https://commons.wikimedia.org/wiki/File:DumbbellLateralRaise.JPG", "author": "GeorgeStepanek", "license": "CC BY-SA 3.0"},
 p4:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Dumbbells_on_rack_20180112.jpg/500px-Dumbbells_on_rack_20180112.jpg", "page": "https://commons.wikimedia.org/wiki/File:Dumbbells_on_rack_20180112.jpg", "author": "Santeri Viinamäki", "license": "CC BY-SA 4.0"},
 p5:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Girl_doing_chest_press_machine_exercise.jpg/500px-Girl_doing_chest_press_machine_exercise.jpg", "page": "https://commons.wikimedia.org/wiki/File:Girl_doing_chest_press_machine_exercise.jpg", "author": "Tyler Read", "license": "CC BY 2.0"},
 p6:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Girl_doing_lat_pulldown_exercise.jpg/500px-Girl_doing_lat_pulldown_exercise.jpg", "page": "https://commons.wikimedia.org/wiki/File:Girl_doing_lat_pulldown_exercise.jpg", "author": "Tyler Read", "license": "CC BY 2.0"},
 p7:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Lat_pulldown_machine_20180112.jpg/500px-Lat_pulldown_machine_20180112.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lat_pulldown_machine_20180112.jpg", "author": "Santeri Viinamäki", "license": "CC BY-SA 4.0"},
 p8:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Leg_press_machine.jpg/500px-Leg_press_machine.jpg", "page": "https://commons.wikimedia.org/wiki/File:Leg_press_machine.jpg", "author": "Teemeah", "license": "CC BY-SA 4.0"},
 p9:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/LyingLegCurlMachineExercise.JPG/500px-LyingLegCurlMachineExercise.JPG", "page": "https://commons.wikimedia.org/wiki/File:LyingLegCurlMachineExercise.JPG", "author": "GeorgeStepanek", "license": "CC BY-SA 3.0"},
 p10:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Magnetic_resistance_stationary_bicycle_exercise_bike.JPG/500px-Magnetic_resistance_stationary_bicycle_exercise_bike.JPG", "page": "https://commons.wikimedia.org/wiki/File:Magnetic_resistance_stationary_bicycle_exercise_bike.JPG", "author": "T g7", "license": "CC BY-SA 3.0"},
 p11:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Multifunctional_cable_and_row_machines_in_a_gym.jpg/500px-Multifunctional_cable_and_row_machines_in_a_gym.jpg", "page": "https://commons.wikimedia.org/wiki/File:Multifunctional_cable_and_row_machines_in_a_gym.jpg", "author": "San Francisco Foghorn", "license": "CC BY 2.0"},
 p12:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nordic_walking_on_treadmill.jpg/500px-Nordic_walking_on_treadmill.jpg", "page": "https://commons.wikimedia.org/wiki/File:Nordic_walking_on_treadmill.jpg", "author": "Wolfgang1018", "license": "CC BY-SA 4.0"},
 p13:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Push-up-2.png/500px-Push-up-2.png", "page": "https://commons.wikimedia.org/wiki/File:Push-up-2.png", "author": "Everkinetic", "license": "CC BY-SA 3.0"},
 p14:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Seated-leg-curl-1.png/500px-Seated-leg-curl-1.png", "page": "https://commons.wikimedia.org/wiki/File:Seated-leg-curl-1.png", "author": "Everkinetic", "license": "CC BY-SA 3.0"},
 p15:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sz%C3%A9kesfeh%C3%A9rv%C3%A1r%2C_Cutler_Gym%2C_Combined_cable_machine.jpg/500px-Sz%C3%A9kesfeh%C3%A9rv%C3%A1r%2C_Cutler_Gym%2C_Combined_cable_machine.jpg", "page": "https://commons.wikimedia.org/wiki/File:Sz%C3%A9kesfeh%C3%A9rv%C3%A1r,_Cutler_Gym,_Combined_cable_machine.jpg", "author": "Teemeah", "license": "CC BY-SA 4.0"},
 p16:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Treadmill_from_Viking_Sport%2C_side.jpg/500px-Treadmill_from_Viking_Sport%2C_side.jpg", "page": "https://commons.wikimedia.org/wiki/File:Treadmill_from_Viking_Sport,_side.jpg", "author": "W.carter", "license": "CC BY 4.0"},
 p17:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Weight_Bench_set.jpg/500px-Weight_Bench_set.jpg", "page": "https://commons.wikimedia.org/wiki/File:Weight_Bench_set.jpg", "author": "SAgbley", "license": "CC BY-SA 4.0"},
 p18:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Woman_using_a_seated_cable_row_machine_at_the_gym.jpg/500px-Woman_using_a_seated_cable_row_machine_at_the_gym.jpg", "page": "https://commons.wikimedia.org/wiki/File:Woman_using_a_seated_cable_row_machine_at_the_gym.jpg", "author": "Miguel Angel Omaña Rojas", "license": "CC0"},
 p19:{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Young_man_using_a_leg_press_machine_at_the_gym.jpg/500px-Young_man_using_a_leg_press_machine_at_the_gym.jpg", "page": "https://commons.wikimedia.org/wiki/File:Young_man_using_a_leg_press_machine_at_the_gym.jpg", "author": "Nenad Stojkovic", "license": "CC BY 2.0"},
};
const toolPhoto={press:photo.p5,row:photo.p11,pulldown:photo.p7,cablerow:photo.p18,legpress:photo.p8,curl:photo.p9,dumbbells:photo.p4,cable:photo.p15,bench:photo.p17,mat:photo.p0,calfstep:photo.p2,treadmill:photo.p16,bike:photo.p10};
const exercisePhoto={press:photo.p5,row:photo.p11,pulldown:photo.p6,raise:photo.p3,pushup:photo.p13,legpress:photo.p19,curl:photo.p14,bridge:photo.p1,calf:photo.p2,walk:photo.p12,cablerow:photo.p18};
// Machine how-to videos. Each ID returned HTTP 200 from YouTube oEmbed on 10 October 2026; label is the video title and channel.
const toolVideo={
 press:['CIykDiF4sfg','How to do a seated chest press · PureGym'],
 row:['FTwvmczf7bE','How to properly use the chest-supported row machine · Gerardi Performance'],
 pulldown:['AOpi-p0cJkc','Beginner’s guide: lat pulldown · SilverSneakers'],
 assisted:['6i7adZVlwIk','How to properly use the assisted pull-up machine · Gerardi Performance'],
 cablerow:['DHA7QGDa2qg','How to do a seated row · Nuffield Health'],
 legpress:['cDGOn-yfKJA','How to do a leg press · NASM'],
 curl:['_2Kd0d-JEUM','How to do a seated leg curl · NASM'],
 dumbbells:['iaQRFm5Hyms','The proper way to pick up dumbbells · Simon Binkowski'],
 cable:['hJVbJxClBEw','How to use the cable machines · PureGym'],
 bench:['NEdo_I3OuVk','How to do an incline push-up · Luke Selway'],
 mat:['IOfgmabzWqU','Top 10 mat/floor exercises for beginners · Bob & Brad'],
 calfstep:['ms-DDjXN2rU','Wall-supported calf raise · Sustain Physical Therapy and Performance'],
 treadmill:['kr9fHMbztn0','Treadmill basics for beginners · Emily Elle'],
 bike:['Go0YHupGnAg','How to set up a spin bike · Fitness 19']
};
for(const [id,[youtube,videoLabel]] of Object.entries(toolVideo))Object.assign(tools[id],{youtube,videoLabel,photo:toolPhoto[id]||null});
const strength={rest:'90–120 seconds between sets; longer if needed',tempo:'Lower in about 2 seconds, lift in about 1 second, no bouncing',rir:'Finish each set with 2–3 clean reps in reserve'};
const details={
 assisted:{breathing:'Exhale as you pull up; inhale as you lower.',progression:'When every set reaches 10 controlled reps, reduce the assistance by the smallest step.',stop:'Shoulder pain, elbow or wrist tingling, or losing control of the platform.'},
 press:{breathing:'Exhale as you press; inhale as the handles return.',progression:'When every set reaches 12 clean reps, add the smallest load step.',stop:'Wrist pain, arm tingling, or shoulder pinching at the front.'},
 row:{breathing:'Exhale as you pull; inhale as you return.',progression:'When every set reaches 12 clean reps with the chest on the pad, add the smallest load step.',stop:'Lower-back strain, elbow pain or arm tingling.'},
 pulldown:{breathing:'Exhale as the bar comes down; inhale as it rises.',progression:'When every set reaches 12 clean reps without swinging, add the smallest load step.',stop:'Neck or shoulder pain, or tingling in the arms or hands.'},
 raise:{breathing:'Exhale as you raise; inhale as you lower.',progression:'Add reps toward 15 first; increase weight only by the smallest dumbbell step.',stop:'Shoulder pinching or pain, or the need to swing the weight.'},
 pushup:{breathing:'Inhale as you lower; exhale as you press up.',progression:'Lower the incline gradually only when 12 controlled reps feel steady.',stop:'Wrist pain or arm tingling; switch to the machine press only if symptom-free.'},
 legpress:{breathing:'Inhale as you lower; exhale as you press.',progression:'When every set reaches 12 clean reps with the pelvis on the pad, add the smallest load step.',stop:'Knee or lower-back pain, or the pelvis rolling off the pad.'},
 squat:{breathing:'Inhale as you sit back; exhale as you stand.',progression:'Use a lower bench or add a light hold only after 12 steady reps.',stop:'Knee or hip pain, or dizziness on standing.'},
 curl:{breathing:'Exhale as you curl; inhale as you return.',progression:'When every set reaches 15 controlled reps, add the smallest load step.',stop:'Hamstring cramping, knee pain, or hips lifting off the pad.'},
 bridge:{breathing:'Exhale as you lift; inhale as you lower.',progression:'Add a 2-second pause at the top, then progress to a single-leg version later.',stop:'Lower-back pain or hamstring cramping.'},
 calf:{breathing:'Breathe steadily; exhale as you rise.',progression:'Add a slow 3-second lowering, then progress to one leg at a time.',stop:'Ankle or Achilles pain, or loss of balance.'},
 deadbug:{breathing:'Exhale as the limbs extend; breathe normally throughout.',progression:'Extend the limbs further only while the lower back stays on the mat.',stop:'Lower-back pain, or the back arching off the mat.'},
 walk:{breathing:'Breathe easily; you should be able to talk in full sentences.',progression:'Add 5 minutes per week up to 30 minutes before adding speed or incline.',stop:'Chest discomfort, dizziness, or unusual breathlessness.'},
 cablerow:{breathing:'Exhale as you pull; inhale as you return.',progression:'When every set reaches 12 clean reps without rocking, add the smallest load step.',stop:'Lower-back strain, elbow pain or arm tingling.'}
};
for(const [id,d] of Object.entries(details))Object.assign(exercises[id],id==='walk'?{rest:'Not needed; keep a steady easy pace',tempo:'Comfortable, even steps',rir:'Talk-test pace: you can speak in full sentences'}:strength,d,{photo:exercisePhoto[id]||null});
meals.forEach((m,i)=>{m.img=`./img/meals/${i}.webp`;});

// Original previews are supplied by each demonstration publisher, not AI-generated.
// Small JPEGs are hotlinked; videos load only after a tap. Verified metadata is in resources/media-audit.json.
for(const [id,e] of Object.entries(exercises)){
 e.img=`./img/generated/${id}.webp`;
 e.photo={url:`https://i.ytimg.com/vi/${e.youtube}/hqdefault.jpg`,page:`https://www.youtube.com/watch?v=${e.youtube}`,author:e.videoLabel.split(' · ').at(-1),license:'Publisher preview · rights retained by original creator',kind:'video'};
 e.video=`https://www.youtube.com/watch?v=${e.youtube}`;
}
exercises.deadbug.rest='60–90 seconds between sets; longer if needed';
exercises.deadbug.rir='Stop with control remaining; finish before the back arches or breathing is held';
exercises.deadbug.progression='Start with short bent-knee reaches, then build to 10 controlled reps per side. Once both sets remain steady and symptom-free across sessions, lengthen the reach or add the opposite arm. Change one thing at a time.';
sources.push(['Gradual core training & abdominal definition','https://www.nasm.org/resource-center/blog/training/core-training-programming']);

// Compressed local copies preserve source attribution in the equipment detail.
for(const [id,t] of Object.entries(tools)){
 const generated={assisted:'assisted',calfstep:'calf',row:'row'}[id];
 t.image=generated?`./img/generated/${generated}.webp`:`./img/equipment-photos/${id}.webp`;
 t.imageKind=generated?'generated':'photo';
 if(generated)t.photo={url:`https://i.ytimg.com/vi/${t.youtube}/hqdefault.jpg`,page:`https://www.youtube.com/watch?v=${t.youtube}`,author:t.videoLabel.split(' · ').at(-1),license:'Publisher preview · rights retained by original creator',kind:'video'};
 else t.photo={...t.photo,url:t.image,license:t.photo.license+' · resized/compressed'};
}

// Primary demonstrations use Indian fitness creators; scope notes identify variations.
for(const [id,e] of Object.entries(exercises))if(id!=='walk')e.img=`./img/coach/${id}-steps.webp`;
for(const [id,media] of Object.entries(indianVideos)){
 const e=exercises[id];Object.assign(e,media,{video:`https://www.youtube.com/watch?v=${media.youtube}`});
 e.photo={url:`https://i.ytimg.com/vi/${media.youtube}/hqdefault.jpg`,page:e.video,author:media.videoLabel.split(' · ').at(-1),license:'Publisher preview · rights retained by original creator',kind:'video'};
}
const indianToolExamples={press:'press',row:'row',pulldown:'pulldown',assisted:'assisted',cablerow:'cablerow',legpress:'legpress',curl:'curl',dumbbells:'raise',cable:'cablerow',bench:'squat',mat:'deadbug',calfstep:'calf',treadmill:'walk',bike:'walk'};
for(const [id,exercise] of Object.entries(indianToolExamples)){
 const media=id==='bike'?indianBikeVideo:indianVideos[exercise];Object.assign(tools[id],media);
 tools[id].videoNote=media.videoNote||'';
 tools[id].photo={url:`https://i.ytimg.com/vi/${media.youtube}/hqdefault.jpg`,page:`https://www.youtube.com/watch?v=${media.youtube}`,author:media.videoLabel.split(' · ').at(-1),license:'Publisher preview · rights retained by original creator',kind:'video'};
}
