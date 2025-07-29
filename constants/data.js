export const sliderData = [
  {
    id: 1,
    title: "SLIDER",
    name: "EAGLE",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/eagel1.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 2,
    title: "SLIDER",
    name: "OWL",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/owl1.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 3,
    title: "SLIDER",
    name: "CROW",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/crow.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 4,
    title: "SLIDER",
    name: "BUTTERFLY",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/butterfly1.jpeg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 5,
    title: "SLIDER",
    name: "OWL",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/owl2.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 6,
    title: "SLIDER",
    name: "EAGLE",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/eagel3.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 7,
    title: "SLIDER",
    name: "KINGFISHER",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/kingfirser2.jpeg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 8,
    title: "SLIDER",
    name: "PARROT",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/parrot1.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 9,
    title: "SLIDER",
    name: "HERON",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/heron.jpeg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 10,
    title: "SLIDER",
    name: "BUTTERFLY",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/butterfly2.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
  {
    id: 11,
    title: "SLIDER",
    name: "PARROT",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique consequuntur, reprehenderit dicta repudiandae.",
    image: "/image/parrot2.jpg",
    buttons: {
      primary: "See More",
      secondary: "Subscribe",
    },
  },
];

export const showSlider = (type) => {
  const carousel = document.querySelector(".carousel");
  const list = document.querySelector(".list");
  const items = document.querySelectorAll(".carousel .list .item");
  const runningTime = document.querySelector(".carousel .timeRunning");

  if (type === "next") {
    list.appendChild(items[0]);
    carousel.classList.add("next");
  } else {
    list.prepend(items[items.length - 1]);
    carousel.classList.add("prev");
  }

  const timeRunning = 3000;
  const timeAutoNext = 7000;

  clearTimeout(window.runTimeOut);
  window.runTimeOut = setTimeout(() => {
    carousel.classList.remove("next");
    carousel.classList.remove("prev");
  }, timeRunning);

  clearTimeout(window.runNextAuto);
  window.runNextAuto = setTimeout(() => {
    document.querySelector(".next").click();
  }, timeAutoNext);

  // Reset time animation
  runningTime.style.animation = "none";
  runningTime.offsetHeight;
  runningTime.style.animation = null;
  runningTime.style.animation = "runningTime 7s linear 1 forwards";
};
