(function(){
  var burger=document.querySelector(".burger");
  var links=document.querySelector(".nav-links");
  if(burger&&links){
    burger.addEventListener("click",function(){
      links.style.display=links.style.display==="flex"?"none":"flex";
    });
  }

  var chips=document.querySelectorAll(".form-chip");
  chips.forEach(function(chip,i){
    chip.addEventListener("click",function(){
      chips.forEach(function(c){c.classList.remove("active")});
      chip.classList.add("active");
      if(window.setHeroForm)window.setHeroForm(i);
    });
  });

  if(window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll(".reveal").forEach(function(el){
      gsap.to(el,{
        opacity:1,y:0,duration:.8,ease:"power3.out",
        scrollTrigger:{trigger:el,start:"top 85%"}
      });
    });
  }else{
    document.querySelectorAll(".reveal").forEach(function(el){
      el.style.opacity=1;el.style.transform="none";
    });
  }
})();
