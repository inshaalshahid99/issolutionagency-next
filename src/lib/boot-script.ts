/**
 * Inline script that runs before first paint (see src/app/(site)/layout.tsx).
 * - x-anim: motion allowed (no prefers-reduced-motion)
 * - x-lite: touch / reduced motion / save-data / low-power -> no cursor, no canvas
 * - x-noload: preloader already shown this session
 */
export const bootScript = `(function(){try{var r=document.documentElement,n=navigator,c=n.connection||{};
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!reduce)r.classList.add("x-anim");
var coarse=matchMedia("(pointer: coarse)").matches||"ontouchstart" in window;
var low=!!c.saveData||(n.deviceMemory&&n.deviceMemory<=4)||(n.hardwareConcurrency&&n.hardwareConcurrency<=4);
if(coarse||reduce||low)r.classList.add("x-lite");
try{if(sessionStorage.getItem("x-seen"))r.classList.add("x-noload");sessionStorage.setItem("x-seen","1");}catch(e){r.classList.add("x-noload");}
}catch(e){}})();`;
