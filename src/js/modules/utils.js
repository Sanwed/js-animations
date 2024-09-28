function createElement(tag, options = {}) {
  const elem = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'className') {
      elem.classList.add(...value.split(' '));
    } else {
      elem[key] = value;
    }
  });
  return elem;
}

function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
  
  if (isMobile) {
    return 'mobile';
  } else {
    return 'desktop';
  }
}

export {createElement, getDeviceType};
