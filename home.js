function createObserver(element, className, removeBool, thresholdValue) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
        } else if (removeBool) {
          entry.target.classList.remove(className);
        }
      });
    },
    {
      threshold: thresholdValue,
    }
  );
  if (
    NodeList.prototype.isPrototypeOf(element) ||
    HTMLCollection.prototype.isPrototypeOf(element)
  ) {
    element.forEach((ele) => observer.observe(ele));
  } else {
    observer.observe(element);
  }
}
const heroCon = document.querySelector(".heroCon") || undefined;
if (heroCon) {
  createObserver(heroCon, "heroConAnime", false, 1);
}
