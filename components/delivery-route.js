class DeliveryRoute extends HTMLElement {
  connectedCallback() {
    this.innerHTML=`<div class="journey" id="journey"><h3>From farm to front door</h3><p>Step through the handoffs or play the full route.</p><div class="map" role="img" aria-label="Illustrated route from the Albay farm through a packing hub to a customer's home"><svg class="land" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden="true"><rect width="800" height="200" fill="#eff4dd"/><circle cx="596" cy="41" r="26" fill="#f4d987"/><path d="M0 122Q95 62 197 116L308 32Q316 22 324 34L435 116Q560 54 800 95V200H0Z" fill="#cadbb8"/><path d="M0 118Q126 157 280 126T580 114T800 103V200H0Z" fill="#a8c58d"/></svg><div class="stops"><img src="assets/farmer.svg" alt=""><img src="assets/hub.svg" alt=""><img src="assets/house.svg" alt=""></div><div class="road"><img id="truck" src="assets/truck.svg" alt=""></div></div><div class="route-pins" aria-label="Inspect a delivery stop"><button>Farm</button><button>Packing hub</button><button>Doorstep</button></div><p class="manifest"></p><p id="route-status" role="status"></p><div class="route-actions"><button id="drive">Next stop</button><button id="play">Play full route</button></div></div>`;
    const el = selector => this.querySelector(selector);
    const pins = [...this.querySelectorAll('.route-pins button')];
    let stop=0, timer=null, order=null;
    const describe = () => [
      'The grower gathers '+(order?order.items:'the local produce')+' for pickup.',
      'The packing team checks quantities and packs the basket for its last trip.',
      'The driver hands the basket to the customer at '+(order?order.destination:'the sample doorstep')+'.'
    ];
    const pause = () => {clearInterval(timer);timer=null};
    const render = () => {
      el('#truck').style.setProperty('--progress',stop*50+'%');
      pins.forEach((pin,i)=>pin.setAttribute('aria-pressed',String(i===stop)));
      el('.manifest').textContent=order?'Your delivery · '+order.items+' · ₱'+order.total+' · '+order.destination:'Sample delivery · Farm to doorstep';
      el('#route-status').textContent=(stop+1)+' of 3 · '+pins[stop].textContent+'. '+describe()[stop];
      el('#drive').textContent=['Drive to packing hub','Drive to doorstep','Return to farm'][stop];
      el('#play').textContent=timer?'Pause route':stop===2?'Replay full route':stop===1?'Play from here':'Play full route';
    };
    pins.forEach((pin,i)=>pin.onclick=()=>{pause();stop=i;render()});
    el('#drive').onclick=()=>{pause();stop=(stop+1)%3;render()};
    el('#play').onclick=()=>{
      if(timer){pause();render();return}
      if(stop===2)stop=0;
      timer=setInterval(()=>{stop++;if(stop===2)pause();render()},2400);
      render();
    };
    const reset = nextOrder => {pause();stop=0;order=nextOrder;render()};
    document.addEventListener('practice-order',event=>reset(event.detail));
    document.addEventListener('practice-reset',()=>reset(null));
    render();
  }
}
customElements.define('delivery-route',DeliveryRoute);