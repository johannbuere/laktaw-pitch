const screens = [
  ['Store','Choose what to cook','Browse the store and open a vegetable to see its details. Try following the tomatoes, labeled Kamatis, from the shelf to checkout.','store','Store screen with fresh produce listings'],
  ['Product','Choose the quantity','The Kamatis detail screen shows ₱75 per kilogram. Use the quantity controls to choose how much you need, then tap Add to Cart.','product','Kamatis details with price per kilogram, quantity controls and Add to Cart'],
  ['Cart','Choose which items to buy','Tick the items to include. In this example, one kilogram of Kamatis at ₱75 and two kilograms of Talong at ₱80 add up to ₱235 before shipping and discounts.','cart','Cart showing Kamatis and Talong selected and Sibuyas unchecked'],
  ['Checkout','Check the order before placing it','Review each selected item and its quantity. Check the delivery address and shipping option before you finish. Try the missing-address case below to practice this step.','review','Detail of the current order on the checkout screen']
];
class ScreenGuide extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="guide-panel"><div class="guide-copy"><h3>Tour the app</h3><div class="guide-tabs" aria-label="Choose an app screen"></div><div aria-live="polite"><p class="origin" data-count></p><h4></h4><p data-instruction></p></div><div class="guide-actions"><button data-prev>Previous</button><button data-next>Next screen</button></div></div><figure><img loading="lazy" alt=""><figcaption></figcaption></figure></div>`;
    const tabs = this.querySelector('.guide-tabs');
    screens.forEach(([name],i) => {const button=document.createElement('button');button.textContent=name;button.onclick=()=>show(i);tabs.append(button)});
    let current=0;
    const show = index => {
      current=index;
      const [name,title,description,image,alt]=screens[index];
      [...tabs.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
      this.querySelector('[data-count]').textContent='SCREEN '+(index+1)+' OF '+screens.length;
      this.querySelector('h4').textContent=title;
      this.querySelector('[data-instruction]').textContent=description;
      const img=this.querySelector('img');img.src='assets/'+image+'.webp';img.alt=alt;
      this.querySelector('figcaption').textContent=name+' · Prototype screen';
      this.querySelector('[data-prev]').disabled=index===0;
      this.querySelector('[data-next]').disabled=index===screens.length-1;
    };
    this.querySelector('[data-prev]').onclick=()=>show(current-1);
    this.querySelector('[data-next]').onclick=()=>show(current+1);
    show(0);
  }
}
customElements.define('screen-guide',ScreenGuide);