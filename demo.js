const find = id => document.getElementById(id);
const produce = [
  {name:'Tomatoes', price:30}, {name:'Eggplants', price:25}
];
const scenarios = {
  dinner:{start:[0,0], hint:'For tonight’s dinner, add one pack of each vegetable. Your expected total is ₱55.', passes:q=>q[0]===1 && q[1]===1},
  budget:{start:[3,1], hint:'Your basket costs ₱115. Keep at least one pack of each vegetable and bring the total down to ₱100 or less.', passes:(q,total)=>q.every(n=>n>0) && total<=100},
  empty:{start:[0,0], hint:'Try confirming the empty basket. Then add any pack and confirm again to see the difference.', passes:()=>true}
};
let quantities = [];
let stop = 0;
const stages = ['At the farm. The grower gathers the produce for pickup.', 'At the packing hub. The team checks and packs the order for delivery.', 'Delivered. The basket has reached the customer’s home.'];
function renderRoute() {
  find('truck').style.setProperty('--progress', (stop*50)+'%');
  find('route-status').textContent = stages[stop];
  find('drive').textContent = ['Drive to packing hub','Drive to home','Replay route'][stop];
}
function renderBasket() {
  quantities.forEach((n,i)=>{
    find('qty'+i).textContent=n;
    find('minus'+i).disabled=n===0;
    find('plus'+i).disabled=n===99;
  });
  find('sum').textContent='₱'+totalPrice();
}
function totalPrice() {return quantities.reduce((sum,n,i)=>sum+n*produce[i].price,0)}
produce.forEach((item,i)=>{
  const row=document.createElement('div');
  row.className='item';
  row.innerHTML='<div><strong>'+item.name+'</strong><small>₱'+item.price+' per pack</small></div><div class="counter"><button id="minus'+i+'" aria-label="Remove one pack of '+item.name+'">−</button><output id="qty'+i+'" aria-label="'+item.name+' packs"></output><button id="plus'+i+'" aria-label="Add one pack of '+item.name+'">+</button></div>';
  find('items').append(row);
  for (const [prefix,delta] of [['plus',1],['minus',-1]]) {
    find(prefix+i).onclick=()=>{
      quantities[i]+=delta; find('feedback').textContent=''; renderBasket();
    };
  }
});
function selectScenario() {
  const choice=scenarios[find('scenario').value];
  quantities=[...choice.start]; find('task').textContent=choice.hint;
  find('feedback').textContent=''; stop=0; renderBasket(); renderRoute();
}
find('scenario').onchange=selectScenario;
find('confirm').onclick=()=>{
  const total=totalPrice();
  if (!total) {find('feedback').textContent='Your basket is empty. Add at least one pack before confirming.'; return}
  if (!scenarios[find('scenario').value].passes(quantities,total)) {
    find('feedback').textContent='Your total is ₱'+total+'. Adjust your basket to meet the example above.'; return;
  }
  find('feedback').textContent='Sample order confirmed at ₱'+total+'. Follow the truck below.';
  stop=0; renderRoute();
};
find('drive').onclick=()=>{stop=(stop+1)%stages.length;renderRoute()};
selectScenario();