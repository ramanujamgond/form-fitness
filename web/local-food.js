// Household portions and estimates are examples, not an individual diet prescription.
export const localFoods={
 breakfast:[
  {name:'Chuda, dahi and eggs',description:'1 medium bowl chuda (flattened rice) + 150 g plain dahi + 2 boiled eggs + 1 banana',protein:23,kcal:550,diet:'any',proteinSources:'Eggs and dahi',fiberSources:'Banana; add another seasonal fruit if preferred',swap:'For vegetarian food, choose chuda with dahi and cooked moong below.'},
  {name:'Chuda with dahi and cooked moong',description:'1 medium bowl chuda + 150 g plain dahi + ½ cup cooked moong + 1 banana',protein:18,kcal:550,diet:'vegetarian',proteinSources:'Moong and dahi',fiberSources:'Moong and banana',swap:'Dairy-free: choose cooked moong ghugni and chuda.'},
  {name:'Moong ghugni and chuda',description:'1 cup cooked moong ghugni + 1 small bowl plain chuda + 1 banana',protein:17,kcal:500,diet:'vegan',proteinSources:'Cooked moong',fiberSources:'Moong and fruit',swap:'Swap chuda for 2 small atta rotis if suitable.'}
 ],
 lunch:[
  {name:'Rice, dalma and machha jhola',description:'1 cup cooked rice + 1 cup dalma (dal with vegetables) + 100 g cooked rohu or other fish + cucumber',protein:32,kcal:650,diet:'any',proteinSources:'Fish and dal in dalma',fiberSources:'Dalma vegetables, dal and cucumber',swap:'Vegetarian or vegan: replace fish with another serving of dal or cooked chana.'},
  {name:'Rice, dalma and saaga',description:'1 cup cooked rice + 1½ cups dalma + 1 cup cooked saaga (leafy greens) + cucumber',protein:18,kcal:550,diet:'vegan',proteinSources:'Dal in dalma',fiberSources:'Dal, mixed vegetables and leafy greens',swap:'Swap rice for 2 atta rotis; keep the dal and vegetables.'},
  {name:'Rice, dal and plain chhena',description:'1 cup cooked rice + 1 cup dal + 75 g plain chhena (not a sweet) + 1 cup vegetables',protein:25,kcal:650,diet:'vegetarian',proteinSources:'Dal and plain chhena',fiberSources:'Dal and vegetables',swap:'Use paneer if plain chhena is unavailable.'}
 ],
 snack:[
  {name:'Roasted chana and guava',description:'30 g roasted chana + 1 medium guava + water',protein:7,kcal:200,diet:'vegan',proteinSources:'Roasted chana',fiberSources:'Chana and guava',swap:'Use seasonal papaya or an orange instead of guava.'},
  {name:'Dahi, chana and papaya',description:'150 g plain dahi + 30 g roasted chana + 1 small bowl papaya',protein:12,kcal:300,diet:'vegetarian',proteinSources:'Dahi and chana',fiberSources:'Chana and papaya',swap:'For dairy-free food, choose roasted chana and guava.'}
 ],
 dinner:[
  {name:'Roti, dal and santula',description:'2 small atta rotis + 1 cup cooked dal + 1 cup santula (mixed vegetables)',protein:18,kcal:500,diet:'vegan',proteinSources:'Dal and atta',fiberSources:'Dal, atta and santula vegetables',swap:'Swap roti for 1 cup cooked rice if wheat does not suit you.'},
  {name:'Rice, dal and egg curry',description:'1 cup cooked rice + ¾ cup dal + 2-egg curry + 1 cup vegetables',protein:25,kcal:650,diet:'any',proteinSources:'Eggs and dal',fiberSources:'Dal and vegetables',swap:'Choose dal and santula for a vegetarian or vegan dinner.'},
  {name:'Rice, dal and santula',description:'1 cup cooked rice + 1¼ cups dal + 1 cup santula',protein:17,kcal:550,diet:'vegan',proteinSources:'Dal',fiberSources:'Dal and mixed vegetables',swap:'Add seasonal saaga as another vegetable side.'}
 ]
};
export function localMealOptions(slot,profile){
 const aliases={milk:['milk','dahi','curd','chhena','paneer','dairy'],dairy:['milk','dahi','curd','chhena','paneer'],curd:['curd','dahi'],gluten:['roti','atta','wheat'],wheat:['roti','atta','wheat'],chickpeas:['chana','chickpea'],chana:['chana','chickpea'],egg:['egg'],eggs:['egg'],fish:['fish','rohu','machha']};
 const excluded=(profile.avoid||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
 return (localFoods[slot.id]||[]).filter(m=>{
  if(profile.diet==='vegan'&&m.diet!=='vegan'||profile.diet==='vegetarian'&&m.diet==='any')return false;
  const text=(m.name+' '+m.description).toLowerCase();
  return !excluded.some(term=>(aliases[term]||[term]).some(word=>text.includes(word)));
 });
}
