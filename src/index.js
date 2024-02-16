const speeds = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0, 5.0];
let default_speed_index;

const slider = document.getElementById("k_range");
const list = document.getElementById("k_speedList");
const button = document.getElementById("reset_button");
const input = document.getElementById("k_current");

const api = window.hasOwnProperty("browser") ? window.browser : window.chrome;

//const circleradius = getComputedStyle(slider, "::-moz-range-thumb").width;
//const trackwidth = getComputedStyle(slider).width;

function setValue(val)
{
  val = Number(val);
  document.getElementById("k_current").innerText = speeds[val].toPrecision(3);
  api.storage.local.set({speed: val});

  api.tabs.executeScript({
    allFrames: true,
    code: `[...document.getElementsByTagName("video")].forEach(tag => (tag.playbackRate = ${speeds[val]}));`,
  })
}


button.onclick = (e) => {
  slider.value = default_speed_index;
  setValue(default_speed_index);
}

slider.onchange=(e)=>{
	setValue(e.target.value);
}

slider.min = 0;
slider.max = speeds.length - 1;

for (const speed_index in speeds)
{
	const opt = document.createElement("option");
  opt.value = speed_index;
  opt.label = speeds[speed_index];
  
  if (speeds[speed_index] === 1)
  {
  	slider.value = speed_index;
    default_speed_index = speed_index;
  }
  
  list.appendChild(opt);
}

async function getSpeed() {
  let {speed} = await api.storage.local.get("speed");

  if (typeof speed !== "undefined")
  {
    speed = Number(speed);
    slider.value = speed;
    setValue(speed);
  }
}

getSpeed();