class PracticeBasket extends HTMLElement {
connectedCallback() {
this.innerHTML=`<div class="order-grid"><div class="order-guide"><h3>Try a shopping scenario</h3><label for="scenario">Choose an example</label><select id="scenario"><option value="dinner">Dinner for two</option><option value="budget">Stay within a ₱100 budget</option><option value="exact">Hit exactly ₱100</option><option value="address">Recover a missing address</option><option value="empty">Start with an empty basket</option></select><p id="task" aria-live="polite"></p>
<ol class="instructions"><li>Use the quantity buttons to build your basket.</li><li>Check the total and choose a sample delivery address.</li><li>Confirm the order to send your basket to the delivery diagram.</li></ol></div>
<div class="basket"><h3>Your practice basket</h3><div id="items"></div><div class="total"><strong>Produce total</strong><output id="sum">₱0</output></div><label class="destination" for="destination">Sample delivery address<select id="destination"><option value="">Choose a destination</option><option value="home">Home in Legazpi City</option><option value="office">Office in Daraga</option></select></label><button id="confirm">Confirm sample order</button><p class="feedback" id="feedback" role="status"></p></div></div>
`;
const find = id => this.querySelector('#'+id);
const produce = [
  {name:'Tomatoes', price:30}, {name:'Eggplants', price:25}
];
const scenarios = {
  dinner:{start:[0,0], hint:'For tonight’s dinner, add one pack of each vegetable. Your expected total is ₱55.', passes:q=>q[0]===1 && q[1]===1},
  budget:{start:[3,1], hint:'Your basket costs ₱115. Keep at least one pack of each vegetable and bring the total down to ₱100 or less.', passes:(q,total)=>q.every(n=>n>0) && total<=100},
  exact:{start:[0,0],hint:'Buy only eggplants at ₱25 per pack. Choose the number of packs that makes exactly ₱100.',passes:q=>q[0]===0 && q[1]===4},
  address:{start:[1,1],hint:'Your ₱55 basket is ready. Try confirming without an address, then choose Office in Daraga and confirm again.',passes:()=>true},
  empty:{start:[0,0], hint:'Try confirming the empty basket. Then add any pack and confirm again to see the difference.', passes:()=>true}
};
let quantities = [];

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
  find('feedback').textContent=''; find('destination').value=find('scenario').value==='address'?'':'home'; renderBasket(); document.dispatchEvent(new CustomEvent('practice-reset'));
}
find('scenario').onchange=selectScenario;
find('confirm').onclick=()=>{
  const total=totalPrice();
  if (!total) {find('feedback').textContent='Your basket is empty. Add at least one pack before confirming.'; return}
  if (!find('destination').value) {find('feedback').textContent='Choose a sample delivery address so the driver knows where to go.'; return}
  if (find('scenario').value==='address' && find('destination').value!=='office') {find('feedback').textContent='For this example, select Office in Daraga.'; return}
  if (!scenarios[find('scenario').value].passes(quantities,total)) {
    find('feedback').textContent='Your total is ₱'+total+'. Adjust your basket to meet the example above.'; return;
  }
  find('feedback').textContent='Sample order confirmed at ₱'+total+'. Follow the truck below.';
  document.dispatchEvent(new CustomEvent('practice-order',{detail:{total, destination:find('destination').selectedOptions[0].textContent, items:produce.map((item,i)=>quantities[i] ? quantities[i]+' × '+item.name.toLowerCase() : '').filter(Boolean).join(', ')}}));
};
selectScenario();
}
}
customElements.define('practice-basket',PracticeBasket);