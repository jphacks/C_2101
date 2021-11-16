export const secToMMSS = (sec: number) => {
  const mm = Math.floor(Math.abs(sec) / 60);
  const ss = Math.abs(sec) % 60;
  return `${sec < 0 ? "-" : ""}${mm.toString().padStart(2, "0")}:${ss
    .toString()
    .padStart(2, "0")}`;
};

export const secToHHMMSS = (sec: number) => {
  const hh = Math.floor(Math.abs(sec) / 3600);
  const mm = Math.floor(Math.abs(sec) / 60) % 60;
  const ss = Math.abs(sec) % 60;
  return `${sec < 0 ? "-" : ""}${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};
