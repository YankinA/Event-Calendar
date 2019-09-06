const supportsTemplate = () => 'content' in document.createElement('template');
supportsTemplate() ? console.log('template поддерживается')
  : alert('Ваш браузер устарел \nРекомендуем использовать Google Chrome:\nhttps://www.google.com/chrome/?hl=ru');

let proxyTest = new Proxy({}, {});
proxyTest instanceof Object ? console.log('Proxyx  поддерживается')
: alert('Ваш браузер устарел \nРекомендуем использовать Google Chrome:\nhttps://www.google.com/chrome/?hl=ru');
