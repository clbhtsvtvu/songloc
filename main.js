(function(){
  var $=function(id){return document.getElementById(id)};

  // Preloader (chỉ có ở trang chủ)
  var pre=$('preloader');
  if(pre)window.addEventListener('load',function(){setTimeout(function(){pre.classList.add('hide')},1500)});

  // Thanh tiến trình, menu dính, nút lên đầu, parallax
  var nav=$('nav'),prog=$('progress'),topBtn=$('topBtn'),heroBg=$('heroBg');
  function onScroll(){
    var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
    if(prog&&h>0)prog.style.width=(y/h*100)+'%';
    if(nav)nav.classList.toggle('scrolled',y>60);
    if(topBtn)topBtn.classList.toggle('show',y>500);
    if(heroBg&&window.innerWidth>800&&y<window.innerHeight*1.2)heroBg.style.transform='translateY('+(y*.35)+'px) scale(1.05)';
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  if(topBtn)topBtn.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};

  // Menu di động
  var menu=$('menu'),overlay=$('overlay'),burger=$('burger');
  function setMenu(o){
    menu.classList.toggle('open',o);
    if(overlay)overlay.classList.toggle('on',o);
    burger.textContent=o?'✕':'☰';
  }
  if(menu&&burger){
    burger.onclick=function(){setMenu(!menu.classList.contains('open'))};
    if(overlay)overlay.onclick=function(){setMenu(false)};
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  }

  // Hiện dần khi cuộn
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  // Đếm số
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target,to=+el.dataset.count,suf=el.dataset.suffix||'',t0=null,dur=1800;
    function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1),v=Math.floor(to*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);cio.unobserve(el);
  })},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});

  // Hiệu ứng gõ chữ (trang chủ)
  var tEl=$('typed');
  if(tEl){
    var words=['Bờ Lũy – chùa Lò Gạch','Làng bích họa “Không gian ký ức”','Văn hóa Óc Eo – Phù Nam','Văn hóa Khmer Nam Bộ'],wi=0,ci=0,del=false;
    (function type(){
      var w=words[wi];
      tEl.textContent=w.substring(0,ci);
      if(!del&&ci<w.length){ci++;setTimeout(type,70)}
      else if(!del){del=true;setTimeout(type,1600)}
      else if(ci>0){ci--;setTimeout(type,35)}
      else{del=false;wi=(wi+1)%words.length;setTimeout(type,300)}
    })();
  }

  // Hạt sáng (trang chủ)
  var cv=$('particles');
  if(cv){
    var cx=cv.getContext('2d'),ps=[];
    var rs=function(){cv.width=cv.offsetWidth;cv.height=cv.offsetHeight};
    rs();window.addEventListener('resize',rs);
    var pCount=window.innerWidth<700?22:55;
    for(var i=0;i<pCount;i++)ps.push({x:Math.random(),y:Math.random(),r:Math.random()*2.5+.8,s:Math.random()*.0007+.0002,a:Math.random()*.6+.2});
    (function draw(){
      cx.clearRect(0,0,cv.width,cv.height);
      ps.forEach(function(p){
        p.y-=p.s;if(p.y<-.02){p.y=1.02;p.x=Math.random()}
        cx.beginPath();cx.arc(p.x*cv.width,p.y*cv.height,p.r,0,6.283);
        cx.fillStyle='rgba(246,183,0,'+p.a+')';cx.shadowBlur=12;cx.shadowColor='#f6b700';cx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  // Lọc bích họa + nghiêng 3D (trang Làng bích họa)
  var chips=document.querySelectorAll('.chip'),cards=document.querySelectorAll('.mcard'),mGrid=$('mGrid');
  if(chips.length){
    var st=document.createElement('style');st.textContent='@keyframes pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}';document.head.appendChild(st);
    chips.forEach(function(c){c.onclick=function(){
      chips.forEach(function(x){x.classList.remove('on')});c.classList.add('on');
      var f=c.dataset.f;
      cards.forEach(function(m){
        var ok=f==='all'||m.dataset.c===f;
        if(ok){m.classList.remove('hide');m.style.animation='none';void m.offsetWidth;m.style.animation='pop .5s ease'}
        else m.classList.add('hide');
      });
      if(mGrid)mGrid.scrollLeft=0;
    }});
  }
  cards.forEach(function(c){
    c.addEventListener('mousemove',function(e){
      if(!c.classList.contains('show'))return;
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transition='transform .1s';
      c.style.transform='perspective(800px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg) translateY(-6px)';
    });
    c.addEventListener('mouseleave',function(){c.style.transition='transform .5s';c.style.transform=''});
  });

  // Cửa sổ chi tiết (hiện vật, bích họa)
  var lb=$('lightbox');
  if(lb){
    var lbImg=$('lbImg');
    var open=function(el){
      lbImg.style.display='';lbImg.src=el.dataset.img||'';
      $('lbTitle').innerHTML=el.dataset.title;
      $('lbDesc').textContent=el.dataset.desc;
      lb.classList.add('open');
    };
    var close=function(){lb.classList.remove('open')};
    document.querySelectorAll('.art,.mcard').forEach(function(el){el.addEventListener('click',function(){open(el)})});
    $('lbClose').onclick=close;
    lb.addEventListener('click',function(e){if(e.target===lb)close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
    new MutationObserver(function(){document.body.style.overflow=lb.classList.contains('open')?'hidden':''}).observe(lb,{attributes:true,attributeFilter:['class']});
  }

  // Lười tải ảnh
  document.querySelectorAll('img').forEach(function(im,i){if(i>1)im.loading='lazy'});
})();
